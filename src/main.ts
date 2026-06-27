import { Editor, Notice, Plugin, TFile, normalizePath } from "obsidian";
import { DEFAULT_SETTINGS, type InvoiceForgeSettings } from "./settings";
import { InvoiceForgeSettingTab } from "./ui/SettingTab";
import { InvoiceModal } from "./ui/InvoiceModal";
import { LicenseManager } from "./license/LicenseManager";
import { VaultScanner } from "./time/VaultScanner";
import { buildInvoice, filterEntries, toISODate, type BuildOptions } from "./invoice/InvoiceBuilder";
import { renderInvoiceMarkdown, renderInvoiceHtml } from "./invoice/InvoiceRenderer";
import { formatInvoiceNumber } from "./invoice/numbering";
import { ReminderManager } from "./reminders/ReminderManager";
import type { Client, Invoice } from "./model/types";

export default class InvoiceForgePlugin extends Plugin {
	settings: InvoiceForgeSettings = DEFAULT_SETTINGS;
	scanner!: VaultScanner;
	reminders!: ReminderManager;

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

		this.app.workspace.onLayoutReady(() => this.reminders.start());
	}

	onunload(): void {
		this.reminders?.stop();
	}

	openInvoiceModal(): void {
		new InvoiceModal(this.app, this).open();
	}

	insertBillableEntry(editor: Editor): void {
		const slug = this.settings.clients[0]?.id ?? "client";
		const today = toISODate(new Date());
		editor.replaceSelection(`- #billable #client/${slug} 1h ${today} Describe the work\n`);
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
			.map(([name, hours]) => `${name}: ${hours}h`)
			.join("\n");
		new Notice(`Unbilled hours:\n${summary}`, 8000);
	}

	// Core: scan → build → write invoice note. Returns the created file.
	async createInvoice(client: Client | null, clientName: string, periodStart: string, periodEnd: string): Promise<{ file: TFile; invoice: Invoice }> {
		const all = await this.scanner.scan(this.settings.clients);
		const entries = filterEntries(all, client, clientName, periodStart, periodEnd);
		if (entries.length === 0) {
			throw new Error("No billable entries match that client and date range.");
		}

		const issueDate = toISODate(new Date());
		const number = formatInvoiceNumber(this.settings.numberTemplate, this.settings.nextSeq, new Date(issueDate + "T00:00:00"));
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

		const folder = normalizePath(this.settings.invoiceFolder || "Invoices");
		await this.ensureFolder(folder);
		const path = normalizePath(`${folder}/${safeFileName(number)}.md`);
		const file = await this.app.vault.create(path, markdown);

		this.settings.nextSeq += 1;
		await this.saveSettings();

		return { file, invoice };
	}

	// Pro: open a printable HTML invoice in a new window (Print → Save as PDF).
	exportInvoiceHtml(invoice: Invoice): void {
		if (!this.settings.isPro) {
			new Notice("PDF / print export is a Pro feature.");
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
		const loaded = data !== null && typeof data === "object" ? (data as Partial<InvoiceForgeSettings>) : {};
		this.settings = Object.assign({}, DEFAULT_SETTINGS, loaded);
		this.settings.business = Object.assign({}, DEFAULT_SETTINGS.business, this.settings.business);
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}

function safeFileName(name: string): string {
	return name.replace(/[\\/:*?"<>|]/g, "-");
}
