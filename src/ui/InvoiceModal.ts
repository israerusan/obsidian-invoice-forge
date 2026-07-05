import { App, Modal, Notice, Setting, TFile } from "obsidian";
import type InvoiceForgePlugin from "../main";
import type { Client, Invoice, TimeEntry } from "../model/types";
import { filterEntries, toISODate } from "../invoice/InvoiceBuilder";
import { formatMoney } from "../invoice/money";

export class InvoiceModal extends Modal {
	private plugin: InvoiceForgePlugin;
	private entries: TimeEntry[] = [];
	private clientKey = ""; // client id, or "name:<raw>" for unconfigured clients
	private periodStart: string;
	private periodEnd: string;
	private lastInvoice: Invoice | null = null;
	private lastFile: TFile | null = null;

	constructor(app: App, plugin: InvoiceForgePlugin) {
		super(app);
		this.plugin = plugin;
		const end = new Date();
		const start = new Date();
		start.setDate(start.getDate() - (plugin.settings.defaultPeriodDays || 30));
		this.periodStart = toISODate(start);
		this.periodEnd = toISODate(end);
	}

	onOpen(): void {
		this.titleEl.setText("Create invoice");
		this.contentEl.createEl("p", { text: "Scanning vault for #billable entries…", cls: "if-muted" });
		// Modal.onOpen is synchronous (void); run the async vault scan detached and
		// re-render when it resolves rather than returning a promise from the override.
		void this.loadEntries();
	}

	private async loadEntries(): Promise<void> {
		this.entries = await this.plugin.scanner.scan(this.plugin.settings.clients);
		this.render();
	}

	private clientOptions(): { key: string; label: string }[] {
		const opts: { key: string; label: string }[] = [];
		for (const c of this.plugin.settings.clients) opts.push({ key: c.id, label: c.name });
		// Surface raw client names found in entries that aren't configured clients.
		const known = new Set(this.plugin.settings.clients.map((c) => c.name.toLowerCase()));
		const seen = new Set<string>();
		for (const e of this.entries) {
			if (e.clientId) continue;
			const lower = e.clientName.toLowerCase();
			if (known.has(lower) || seen.has(lower)) continue;
			seen.add(lower);
			opts.push({ key: `name:${e.clientName}`, label: `${e.clientName} (unconfigured)` });
		}
		return opts;
	}

	private resolveClient(): { client: Client | null; clientName: string } {
		if (this.clientKey.startsWith("name:")) {
			return { client: null, clientName: this.clientKey.slice(5) };
		}
		const client = this.plugin.getClient(this.clientKey);
		return { client, clientName: client?.name ?? "" };
	}

	private render(): void {
		const { contentEl } = this;
		contentEl.empty();

		const options = this.clientOptions();
		if (options.length === 0) {
			contentEl.createEl("p", {
				text: "No #billable entries found. Add a line like:",
				cls: "if-muted",
			});
			contentEl.createEl("code", { text: "- #billable #client/acme 09:00-11:30 Built the thing" });
			return;
		}
		if (!this.clientKey) this.clientKey = options[0].key;

		new Setting(contentEl)
			.setName("Client")
			.setDesc("Configured clients use their default rate, currency, and address.")
			.addDropdown((dd) => {
				for (const o of options) dd.addOption(o.key, o.label);
				dd.setValue(this.clientKey).onChange((v) => {
					this.clientKey = v;
					this.renderPreview();
				});
			});

		new Setting(contentEl).setName("Period start").addText((t) =>
			t.setPlaceholder("YYYY-MM-DD").setValue(this.periodStart).onChange((v) => {
				this.periodStart = v.trim();
				this.renderPreview();
			})
		);
		new Setting(contentEl).setName("Period end").addText((t) =>
			t.setPlaceholder("YYYY-MM-DD").setValue(this.periodEnd).onChange((v) => {
				this.periodEnd = v.trim();
				this.renderPreview();
			})
		);

		this.previewEl = contentEl.createDiv({ cls: "if-preview" });
		this.renderPreview();

		const actions = new Setting(contentEl);
		actions.addButton((b) =>
			b
				.setButtonText("Create invoice")
				.setCta()
				.onClick(() => void this.create())
		);
		if (this.plugin.settings.isPro) {
			actions.addButton((b) =>
				b.setButtonText("Export PDF / print").onClick(() => {
					if (!this.lastInvoice) {
						new Notice("Create the invoice first, then export.");
						return;
					}
					this.plugin.exportInvoiceHtml(this.lastInvoice);
				})
			);
		} else {
			actions.descEl.setText("PDF / print export, tax, and reminders are Pro features.");
		}
	}

	private previewEl!: HTMLElement;

	private renderPreview(): void {
		if (!this.previewEl) return;
		this.previewEl.empty();
		const { client, clientName } = this.resolveClient();
		const matched = filterEntries(this.entries, client, clientName, this.periodStart, this.periodEnd);

		if (matched.length === 0) {
			this.previewEl.createEl("p", { text: "No entries match this client and date range.", cls: "if-muted" });
			return;
		}
		const totalHours = matched.reduce((s, e) => s + e.hours, 0);
		const baseRate = (client && client.defaultRate) ?? this.plugin.settings.business.defaultRate;
		const currency = this.plugin.settings.isPro
			? (client && client.currency) || this.plugin.settings.business.currency
			: this.plugin.settings.business.currency;
		const subtotal = matched.reduce((s, e) => s + e.hours * (e.rate ?? baseRate), 0);

		this.previewEl.createEl("p", {
			text: `${matched.length} entries · ${round2(totalHours)}h · subtotal ${formatMoney(round2(subtotal), currency)}`,
		});
	}

	private async create(): Promise<void> {
		const { client, clientName } = this.resolveClient();
		try {
			const { file, invoice } = await this.plugin.createInvoice(client, clientName, this.periodStart, this.periodEnd);
			this.lastInvoice = invoice;
			this.lastFile = file;
			new Notice(`Created ${invoice.number} — ${formatMoney(invoice.total, invoice.currency)}`);
			if (this.plugin.settings.openAfterCreate) {
				await this.app.workspace.getLeaf(true).openFile(file);
			}
			if (!this.plugin.settings.isPro) this.close();
		} catch (err) {
			new Notice(err instanceof Error ? err.message : "Could not create invoice.");
		}
	}
}

function round2(n: number): number {
	return Math.round((n + Number.EPSILON) * 100) / 100;
}
