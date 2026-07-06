import { Editor, Notice, Platform, Plugin, TFile, normalizePath } from "obsidian";
import { DEFAULT_SETTINGS, type InvoiceForgeSettings } from "./settings";
import { InvoiceForgeSettingTab } from "./ui/SettingTab";
import { InvoiceModal } from "./ui/InvoiceModal";
import { LicenseManager } from "./license/LicenseManager";
import { VaultScanner } from "./time/VaultScanner";
import { lineMatchesEntry, markLineBilled } from "./time/entryParser";
import { buildInvoice, filterEntries, toISODate, type BuildOptions } from "./invoice/InvoiceBuilder";
import { round2 } from "./invoice/money";
import { renderInvoiceMarkdown, renderInvoiceHtml } from "./invoice/InvoiceRenderer";
import { formatInvoiceNumber } from "./invoice/numbering";
import { ReminderManager } from "./reminders/ReminderManager";
import type { Client, Invoice } from "./model/types";

export default class InvoiceForgePlugin extends Plugin {
	settings: InvoiceForgeSettings = DEFAULT_SETTINGS;
	scanner!: VaultScanner;
	reminders!: ReminderManager;
	private creating = false;

	async onload(): Promise<void> {
		await this.loadSettings();
		await this.refreshLicense();

		this.scanner = new VaultScanner(this.app);
		this.reminders = new ReminderManager(this);

		this.addRibbonIcon("receipt", "Invoice Forge", () => this.openInvoiceModal());

		this.addCommand({
			id: "create-invoice",
			name: "Create invoice",
			callback: () => this.openInvoiceModal(),
		});

		this.addCommand({
			id: "insert-billable-entry",
			name: "Insert billable entry",
			editorCallback: (editor: Editor) => this.insertBillableEntry(editor),
		});

		this.addCommand({
			id: "preview-billable-hours",
			name: "Preview unbilled hours by client",
			callback: () => void this.previewHours(),
		});

		this.addSettingTab(new InvoiceForgeSettingTab(this.app, this));

		this.app.workspace.onLayoutReady(() => {
			void this.recoverPendingInvoice();
			this.reminders.start();
		});
	}

	onunload(): void {
		this.reminders?.stop();
	}

	openInvoiceModal(): void {
		new InvoiceModal(this.app, this).open();
	}

	insertBillableEntry(editor: Editor): void {
		editor.replaceSelection(this.exampleBillableLine());
	}

	private exampleBillableLine(): string {
		const slug = this.settings.clients[0]?.id ?? "acme";
		const today = toISODate(new Date());
		return `- #billable #client/${slug} 1h [date:: ${today}] Describe the work\n`;
	}

	// Onboarding on-ramp: drop a working example #billable line where the user can
	// see it — into the active note if one is open, otherwise a fresh log note.
	async insertExampleNote(): Promise<void> {
		const line = this.exampleBillableLine();
		const editor = this.app.workspace.activeEditor?.editor;
		if (editor) {
			editor.replaceSelection(line);
			new Notice("Inserted an example #billable line — edit it, then run Create invoice.");
			return;
		}
		const path = normalizePath("Billable log.md");
		const existing = this.app.vault.getAbstractFileByPath(path);
		let file: TFile;
		if (existing instanceof TFile) {
			file = existing;
			await this.app.vault.process(file, (content) => `${content.replace(/\s*$/, "")}\n${line}`);
		} else {
			file = await this.app.vault.create(path, `# Billable log\n\n${line}`);
		}
		await this.app.workspace.getLeaf(true).openFile(file);
		new Notice("Added an example #billable line in “Billable log” — edit it, then run Create invoice.");
	}

	getClient(id: string | null): Client | null {
		if (!id) return null;
		return this.settings.clients.find((c) => c.id === id) ?? null;
	}

	async previewHours(): Promise<void> {
		const entries = await this.scanner.scan(this.settings.clients);
		if (entries.length === 0) {
			new Notice("No #billable entries found in the vault.");
			return;
		}
		const totals = new Map<string, number>();
		for (const e of entries) totals.set(e.clientName, (totals.get(e.clientName) ?? 0) + e.hours);
		const summary = [...totals.entries()]
			.sort((a, b) => b[1] - a[1])
			.map(([name, hours]) => `${name}: ${round2(hours)}h`)
			.join("\n");
		const skipped = this.scanner.lastUnparsed.length;
		const warn = skipped > 0 ? `\n⚠ ${skipped} #billable line(s) skipped (fix their time).` : "";
		new Notice(`Unbilled hours:\n${summary}${warn}`, 8000);
	}

	// Core: scan → build → mark source entries → write invoice note. The order and
	// locking make double-billing impossible: we reserve a unique number, then
	// mark entries (validated + atomic + rolled back on failure), and create the
	// note LAST so a failure falls toward "nothing billed" (retryable) rather than
	// "billed but re-billable" (double charge).
	async createInvoice(client: Client | null, clientName: string, periodStart: string, periodEnd: string): Promise<{ file: TFile; invoice: Invoice }> {
		if (this.creating) {
			throw new Error("An invoice is already being created — please wait for it to finish.");
		}
		this.creating = true;
		try {
			const all = await this.scanner.scan(this.settings.clients);
			const entries = filterEntries(all, client, clientName, periodStart, periodEnd);
			if (entries.length === 0) {
				throw new Error("No billable entries match that client and date range.");
			}

			const issueDate = toISODate(new Date());
			// Reserve a number + a free file path and persist immediately so the
			// number is "burned" — a later failure skips it rather than reusing it
			// (a duplicate invoice number is worse than a gap in the sequence).
			const { number, path, folder } = this.reserveInvoicePath(issueDate);
			await this.saveSettings();

			const opts: BuildOptions = {
				number,
				issueDate,
				periodStart,
				periodEnd,
				dueInDays: this.settings.dueInDays,
				isPro: this.settings.isPro,
			};

			const invoice = buildInvoice(entries, client, this.settings.business, opts);
			const markdown = renderInvoiceMarkdown(invoice, this.settings.business);

			// Journal the pending invoice BEFORE marking. If the process dies
			// between marking and note creation, onload replays this record so the
			// markers never end up without an invoice (crash consistency).
			this.settings.pendingInvoice = {
				number,
				path,
				markdown,
				entries: entries.map((e) => ({ sourcePath: e.sourcePath, line: e.line, raw: e.raw })),
			};
			await this.saveSettings();

			// Mark FIRST: if this throws, nothing is billed and no note exists yet.
			await this.scanner.markBilled(entries, number);

			// Create the note LAST: if it fails, entries were already marked, so
			// unmark them to avoid silently losing that billable work.
			await this.ensureFolder(folder);
			let file: TFile;
			try {
				file = await this.app.vault.create(path, markdown);
			} catch (error) {
				const failed = await this.scanner.unmarkBilled(entries, number);
				this.settings.pendingInvoice = null;
				await this.saveSettings();
				if (failed.length) {
					throw new Error(
						`${error instanceof Error ? error.message : String(error)} (and could not undo markers in: ${failed.join(", ")} — check these notes).`
					);
				}
				throw error;
			}

			// Success — clear the journal.
			this.settings.pendingInvoice = null;
			await this.saveSettings();
			return { file, invoice };
		} finally {
			this.creating = false;
		}
	}

	// Replay a journaled invoice left behind by a crash: create the note if it's
	// missing and mark any entries that weren't marked, then clear the journal.
	private async recoverPendingInvoice(): Promise<void> {
		const pending = this.settings.pendingInvoice;
		if (!pending) return;
		// Guard against a malformed/hand-edited journal so recovery can't loop.
		if (typeof pending.path !== "string" || typeof pending.markdown !== "string" || !Array.isArray(pending.entries)) {
			this.settings.pendingInvoice = null;
			await this.saveSettings();
			return;
		}
		try {
			const existing = this.app.vault.getAbstractFileByPath(pending.path);
			if (!(existing instanceof TFile)) {
				const slash = pending.path.lastIndexOf("/");
				if (slash > 0) await this.ensureFolder(pending.path.slice(0, slash));
				await this.app.vault.create(pending.path, pending.markdown);
			}
			// Best-effort: mark any still-unmarked source lines that still match.
			for (const entry of pending.entries) {
				const file = this.app.vault.getAbstractFileByPath(entry.sourcePath);
				if (!(file instanceof TFile)) continue;
				await this.app.vault.process(file, (content) => {
					const lines = content.split(/\r?\n/);
					if (entry.line < lines.length && lineMatchesEntry(lines[entry.line], entry.raw)) {
						lines[entry.line] = markLineBilled(lines[entry.line], pending.number);
					}
					return lines.join("\n");
				});
			}
			new Notice(`Recovered an interrupted invoice: ${pending.number}.`);
		} catch {
			// Leave the journal in place to retry on the next load if recovery failed.
			return;
		}
		this.settings.pendingInvoice = null;
		await this.saveSettings();
	}

	// Reserve the next invoice number and a non-colliding file path. Increments
	// nextSeq once; if that number's file already exists, the FILE name is
	// suffixed (the number is preserved) so we never overwrite an existing note.
	private reserveInvoicePath(issueDate: string): { number: string; path: string; folder: string } {
		const folder = normalizePath(this.settings.invoiceFolder || "Invoices");
		const number = formatInvoiceNumber(
			this.settings.numberTemplate,
			this.settings.nextSeq,
			new Date(issueDate + "T00:00:00")
		);
		this.settings.nextSeq += 1;

		let path = normalizePath(`${folder}/${safeFileName(number)}.md`);
		let suffix = 2;
		while (this.app.vault.getAbstractFileByPath(path)) {
			path = normalizePath(`${folder}/${safeFileName(number)} ${suffix}.md`);
			suffix += 1;
		}
		return { number, path, folder };
	}

	// Pro: open a printable HTML invoice in a new window (Print → Save as PDF).
	exportInvoiceHtml(invoice: Invoice): void {
		if (!this.settings.isPro) {
			new Notice("PDF / print export is a Pro feature.");
			return;
		}
		// window.open (the print window) isn't available on Obsidian mobile — tell
		// the user accurately instead of failing with a misleading "popup blocked".
		if (Platform.isMobile) {
			new Notice("PDF / print export is available on desktop only. Open this invoice on desktop to print or save as PDF.");
			return;
		}
		const html = renderInvoiceHtml(invoice, this.settings.business);
		// Render via a Blob URL rather than document.write (which Obsidian disallows).
		const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
		const win = window.open(url, "_blank");
		if (!win) {
			URL.revokeObjectURL(url);
			new Notice("Could not open a print window (popup blocked). Use Ctrl/Cmd+P to print to PDF.");
			return;
		}
		// Free the object URL once the window has had time to load it.
		window.setTimeout(() => URL.revokeObjectURL(url), 60000);
	}

	private async ensureFolder(path: string): Promise<void> {
		const existing = this.app.vault.getAbstractFileByPath(path);
		if (existing) return;
		await this.app.vault.createFolder(path).catch(() => undefined);
	}

	async refreshLicense(): Promise<void> {
		if (!this.settings.licenseKey) {
			this.settings.isPro = false;
			this.settings.licenseEmail = "";
			await this.saveSettings();
			return;
		}
		const result = LicenseManager.verify(this.settings.licenseKey);
		this.settings.isPro = result.valid;
		this.settings.licenseEmail = result.email ?? "";
		await this.saveSettings();
	}

	async loadSettings(): Promise<void> {
		const data: unknown = await this.loadData();
		const loaded: Record<string, unknown> =
			data !== null && typeof data === "object" ? (data as Record<string, unknown>) : {};
		// Drop dangerous keys before merging untrusted persisted data.
		for (const key of ["__proto__", "constructor", "prototype"]) {
			delete loaded[key];
		}

		this.settings = Object.assign({}, DEFAULT_SETTINGS, loaded);
		const business = loaded.business;
		this.settings.business = Object.assign(
			{},
			DEFAULT_SETTINGS.business,
			business && typeof business === "object" ? business : {}
		);
		// A hand-edited/corrupt clients value must not crash the settings tab or scanner.
		this.settings.clients = Array.isArray(loaded.clients)
			? loaded.clients.filter((c): c is Record<string, unknown> => !!c && typeof c === "object").map(normalizeClient)
			: [];
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}

function safeFileName(name: string): string {
	return name.replace(/[\\/:*?"<>|]/g, "-");
}

// Coerce an untrusted persisted client object into a valid Client so the rest of
// the plugin (settings tab, scanner, invoice builder) can never crash on it.
function normalizeClient(raw: Record<string, unknown>): Client {
	const str = (v: unknown): string => (typeof v === "string" ? v : "");
	const numOrNull = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);
	return {
		id: str(raw.id),
		name: str(raw.name),
		email: str(raw.email),
		address: str(raw.address),
		defaultRate: numOrNull(raw.defaultRate),
		currency: typeof raw.currency === "string" ? raw.currency : null,
		taxRate: numOrNull(raw.taxRate),
	};
}
