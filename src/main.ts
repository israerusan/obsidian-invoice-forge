import { Editor, Notice, Platform, Plugin, TFile, normalizePath } from "obsidian";
import { DEFAULT_BUSINESS, DEFAULT_SETTINGS, type InvoiceForgeSettings } from "./settings";
import { InvoiceForgeSettingTab } from "./ui/SettingTab";
import { InvoiceModal } from "./ui/InvoiceModal";
import { LicenseManager } from "./license/LicenseManager";
import { VaultScanner, detectNewline } from "./time/VaultScanner";
import { lineHasInvoiceMarker, lineMatchesEntry, markLineBilled } from "./time/entryParser";
import { buildInvoice, filterEntries, toISODate, type BuildOptions } from "./invoice/InvoiceBuilder";
import { round2 } from "./invoice/money";
import { renderInvoiceMarkdown, renderInvoiceHtml } from "./invoice/InvoiceRenderer";
import { formatInvoiceNumber } from "./invoice/numbering";
import { ReminderManager } from "./reminders/ReminderManager";
import type { BusinessProfile, Client, Invoice } from "./model/types";

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

			// Mark FIRST: if this throws, markBilled has already validated + rolled
			// back so nothing is billed and no note exists yet. Clear the journal
			// before rethrowing — otherwise recovery would resurrect a phantom
			// invoice on next launch (creating a note for work that was never billed).
			try {
				await this.scanner.markBilled(entries, number);
			} catch (error) {
				this.settings.pendingInvoice = null;
				await this.saveSettings();
				throw error;
			}

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
		// Serialize against createInvoice: recovery and a user-triggered create must
		// never run at once, or they could both bill the same still-unmarked entries
		// (recovery creating the OLD note while a create issues a NEW one). Recovery
		// runs at layout-ready before any modal can open, so it wins the lock first.
		if (this.creating) return;
		this.creating = true;
		try {
			// Keep only well-formed journal elements ([null], strings, missing fields
			// from a hand-edited data.json) so a corrupt entry can't throw mid-replay.
			const entries = pending.entries.filter(
				(e): e is { sourcePath: string; line: number; raw: string } =>
					!!e &&
					typeof e === "object" &&
					typeof e.sourcePath === "string" &&
					typeof e.raw === "string" &&
					Number.isInteger(e.line)
			);
			const byPath = new Map<string, typeof entries>();
			for (const e of entries) {
				const group = byPath.get(e.sourcePath) ?? [];
				group.push(e);
				byPath.set(e.sourcePath, group);
			}

			// Phase 1 — validate EVERY entry before writing anything. A source line is
			// safe if it is already marked with this invoice number (a clean crash
			// after marking) OR still byte-identical to what was scanned (ready to
			// mark). A note or line that no longer exists is also safe: gone work is
			// not re-billable. But an unmarked line that has DRIFTED (edited/moved)
			// means we can't reproduce the billing — creating the invoice now would
			// charge that work while its source stays unmarked, so the next scan would
			// bill it AGAIN. On any such drift, write nothing, keep the journal, and
			// ask the user to reconcile. (All-or-nothing beats a silent double bill.)
			for (const [path, fileEntries] of byPath) {
				const file = this.app.vault.getAbstractFileByPath(path);
				if (!(file instanceof TFile)) continue;
				const lines = (await this.app.vault.cachedRead(file)).split(/\r?\n/);
				for (const entry of fileEntries) {
					if (entry.line >= lines.length) continue;
					const ln = lines[entry.line];
					if (lineHasInvoiceMarker(ln, pending.number)) continue;
					if (lineMatchesEntry(ln, entry.raw)) continue;
					new Notice(
						`Invoice ${pending.number} couldn't be auto-recovered: a billable line in "${path}" changed since it was interrupted. Recreate the invoice to reconcile — your entries are untouched.`,
						12000
					);
					return;
				}
			}

			// Phase 2 — safe to apply. Create the note if it's missing…
			const existing = this.app.vault.getAbstractFileByPath(pending.path);
			if (!(existing instanceof TFile)) {
				const slash = pending.path.lastIndexOf("/");
				if (slash > 0) await this.ensureFolder(pending.path.slice(0, slash));
				await this.app.vault.create(pending.path, pending.markdown);
			}
			// …then mark any still-unmarked source lines, one write per note (not one
			// per entry), preserving each note's newline convention.
			for (const [path, fileEntries] of byPath) {
				const file = this.app.vault.getAbstractFileByPath(path);
				if (!(file instanceof TFile)) continue;
				await this.app.vault.process(file, (content) => {
					const newline = detectNewline(content);
					const lines = content.split(/\r?\n/);
					for (const entry of fileEntries) {
						if (entry.line < lines.length && lineMatchesEntry(lines[entry.line], entry.raw)) {
							lines[entry.line] = markLineBilled(lines[entry.line], pending.number);
						}
					}
					return lines.join(newline);
				});
			}
			new Notice(`Recovered an interrupted invoice: ${pending.number}.`);
			// Clear the journal ONLY if it's still the record we just replayed — never
			// wipe a fresh journal a create wrote in the meantime.
			if (this.settings.pendingInvoice === pending) {
				this.settings.pendingInvoice = null;
				await this.saveSettings();
			}
		} catch {
			// Leave the journal in place to retry on the next load if recovery failed.
		} finally {
			this.creating = false;
		}
	}

	// The normalized, filesystem-safe folder where invoice notes live. Shared by
	// invoice creation and the reminder scan so they always agree on the location
	// even when the user's setting has a stray slash or an invalid path character.
	invoiceFolderPath(): string {
		return normalizePath(safeFolderPath(this.settings.invoiceFolder || "Invoices"));
	}

	// Reserve the next invoice number and a non-colliding file path. Increments
	// nextSeq once; if that number's file already exists, BOTH the number and the
	// file name are suffixed so persisted invoice numbers stay unique — otherwise
	// a numberTemplate without a {seq} token (e.g. "INV-{YYYY}-{MM}") would emit
	// the identical number on every invoice in the period, and rollback/unmark
	// (which keys on the number) would then hit the wrong invoice's markers.
	private reserveInvoicePath(issueDate: string): { number: string; path: string; folder: string } {
		const folder = this.invoiceFolderPath();
		const baseNumber = formatInvoiceNumber(
			this.settings.numberTemplate,
			this.settings.nextSeq,
			new Date(issueDate + "T00:00:00")
		);
		this.settings.nextSeq += 1;

		let number = baseNumber;
		let path = normalizePath(`${folder}/${safeFileName(number)}.md`);
		let suffix = 2;
		while (this.app.vault.getAbstractFileByPath(path)) {
			number = `${baseNumber}-${suffix}`;
			path = normalizePath(`${folder}/${safeFileName(number)}.md`);
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

		// Coerce every field a corrupt/hand-edited/mis-migrated data.json could
		// hold at the wrong type. The value of Number/string discipline here is
		// that the rest of the plugin (settings tab, scanner, invoice builder,
		// numbering) can never crash or misbehave on persisted junk.
		const nonNeg = (v: unknown, fallback: number): number =>
			typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : fallback;
		const posInt = (v: unknown, fallback: number): number =>
			typeof v === "number" && Number.isInteger(v) && v > 0 ? v : fallback;
		const str = (v: unknown, fallback: string): string => (typeof v === "string" ? v : fallback);
		const bool = (v: unknown, fallback: boolean): boolean => (typeof v === "boolean" ? v : fallback);

		// Coerce every top-level string/boolean a corrupt or hand-edited data.json
		// could hold at the wrong type. Without this a numeric licenseKey crashes
		// startup at LicenseManager.verify (`.trim()` on a number), and a numeric
		// invoiceFolder/numberTemplate crashes path building — the whole plugin
		// would fail to load on otherwise-recoverable persisted junk.
		this.settings.licenseKey = str(this.settings.licenseKey, DEFAULT_SETTINGS.licenseKey);
		this.settings.licenseEmail = str(this.settings.licenseEmail, DEFAULT_SETTINGS.licenseEmail);
		this.settings.purchaseUrl = str(this.settings.purchaseUrl, DEFAULT_SETTINGS.purchaseUrl) || DEFAULT_SETTINGS.purchaseUrl;
		this.settings.invoiceFolder = str(this.settings.invoiceFolder, DEFAULT_SETTINGS.invoiceFolder);
		this.settings.numberTemplate = str(this.settings.numberTemplate, DEFAULT_SETTINGS.numberTemplate) || DEFAULT_SETTINGS.numberTemplate;
		this.settings.openAfterCreate = bool(this.settings.openAfterCreate, DEFAULT_SETTINGS.openAfterCreate);
		this.settings.reminderEnabled = bool(this.settings.reminderEnabled, DEFAULT_SETTINGS.reminderEnabled);

		const business = loaded.business;
		this.settings.business = normalizeBusiness(
			business && typeof business === "object" ? (business as Record<string, unknown>) : {}
		);

		// Top-level numerics: a string nextSeq would make `nextSeq += 1` a string
		// concatenation ("5"+1 -> "51") and corrupt every future invoice number.
		// Day counts are non-negative (a negative due/reminder/period window is
		// nonsense and would compute due dates in the past or an inverted range).
		this.settings.nextSeq = posInt(this.settings.nextSeq, DEFAULT_SETTINGS.nextSeq);
		this.settings.dueInDays = nonNeg(this.settings.dueInDays, DEFAULT_SETTINGS.dueInDays);
		this.settings.reminderDaysBefore = nonNeg(this.settings.reminderDaysBefore, DEFAULT_SETTINGS.reminderDaysBefore);
		this.settings.defaultPeriodDays = nonNeg(this.settings.defaultPeriodDays, DEFAULT_SETTINGS.defaultPeriodDays);

		// A hand-edited/corrupt clients value must not crash the settings tab or scanner.
		this.settings.clients = Array.isArray(loaded.clients)
			? loaded.clients.filter((c): c is Record<string, unknown> => !!c && typeof c === "object").map(normalizeClient)
			: [];
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}

// Windows basenames that are reserved regardless of extension (CON.md still fails).
const RESERVED_WINDOWS_NAMES = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;

function safeFileName(name: string): string {
	let safe = name
		.replace(/[\\/:*?"<>|]/g, "-")
		// A trailing dot or space makes a filename un-createable on Windows.
		.replace(/[. ]+$/, "")
		.trim();
	if (!safe) safe = "invoice";
	// Prefix a reserved device name so "CON"/"NUL"/… can't produce an un-createable
	// note that fails on every attempt (and burns an invoice number each time).
	if (RESERVED_WINDOWS_NAMES.test(safe)) safe = `_${safe}`;
	return safe;
}

// Sanitize a user-supplied folder path: scrub characters that are invalid in a
// path segment (keeping "/" as the separator), and drop empty segments so a
// leading/trailing/double slash can't produce an un-createable path that burns
// an invoice number on every failed attempt.
function safeFolderPath(path: string): string {
	return path
		.split("/")
		.map((seg) => seg.replace(/[\\:*?"<>|]/g, "-").trim())
		.filter((seg) => seg.length > 0)
		.join("/");
}

// Coerce an untrusted persisted business object into a valid BusinessProfile.
// A non-string field (e.g. `name: null` from a corrupt data.json) would crash
// the settings tab and invoice modal on `.trim()`; a non-number rate would zero
// invoice totals. Every field is forced to its declared type here.
function normalizeBusiness(raw: Record<string, unknown>): BusinessProfile {
	const d = DEFAULT_BUSINESS;
	const str = (v: unknown, fallback: string): string => (typeof v === "string" ? v : fallback);
	const num = (v: unknown, fallback: number): number =>
		typeof v === "number" && Number.isFinite(v) ? v : fallback;
	return {
		name: str(raw.name, d.name),
		email: str(raw.email, d.email),
		address: str(raw.address, d.address),
		logoUrl: str(raw.logoUrl, d.logoUrl),
		defaultRate: num(raw.defaultRate, d.defaultRate),
		currency: str(raw.currency, d.currency),
		taxRate: num(raw.taxRate, d.taxRate),
		taxLabel: str(raw.taxLabel, d.taxLabel),
		notes: str(raw.notes, d.notes),
	};
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
