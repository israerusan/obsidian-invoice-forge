import { App, Modal, Notice, Platform, Setting, TFile } from "obsidian";
import type InvoiceForgePlugin from "../main";
import type { Client, Invoice, TimeEntry } from "../model/types";
import { filterEntries, isValidISODate, resolveRates, summarizeEntries, toISODate } from "../invoice/InvoiceBuilder";
import { formatMoney, round2 } from "../invoice/money";
import { PRO_PRICE } from "../settings";

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

		const unparsed = this.plugin.scanner.lastUnparsed;
		if (unparsed.length > 0) {
			contentEl
				.createDiv({ cls: "if-warn" })
				.createEl("p", {
					text: `⚠ ${unparsed.length} #billable line(s) couldn't be read (missing or invalid time) and were skipped. Fix the time on those lines so the work is billed.`,
				});
		}

		const options = this.clientOptions();
		if (options.length === 0) {
			contentEl.createEl("p", {
				text: "No billable work found yet. Tag a line in any note with #billable and a time, then come back — for example:",
				cls: "if-muted",
			});
			contentEl.createEl("code", { text: "- #billable #client/acme 09:00-11:30 Built the thing" });
			contentEl.createEl("p", {
				text: "Tip: you don't need to set up a client first — a #client/<name> is billed at your default rate.",
				cls: "if-muted",
			});
			new Setting(contentEl).addButton((b) =>
				b
					.setButtonText("Insert an example line")
					.setCta()
					.onClick(() => {
						void this.plugin.insertExampleNote();
						this.close();
					})
			);
			return;
		}
		if (!this.clientKey) this.clientKey = options[0].key;

		if (!this.plugin.settings.business.name.trim()) {
			contentEl
				.createDiv({ cls: "if-muted" })
				.createEl("p", { text: "Tip: set your business name in Settings → Invoice Forge so it appears on the invoice." });
		}

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
		actions.addButton((b) => {
			this.createBtn = b;
			b.setButtonText("Create invoice")
				.setCta()
				.onClick(() => void this.create());
			return b;
		});
		if (this.plugin.settings.isPro && !Platform.isMobile) {
			actions.addButton((b) =>
				b.setButtonText("Export PDF / print").onClick(() => {
					if (!this.lastInvoice) {
						new Notice("Create the invoice first, then export.");
						return;
					}
					this.plugin.exportInvoiceHtml(this.lastInvoice);
				})
			);
		} else if (this.plugin.settings.isPro) {
			// Pro on mobile: the invoice note is still created; PDF export is desktop-only.
			actions.descEl.setText("PDF / print export is available on desktop.");
		} else {
			actions.descEl.setText(`PDF / print export, tax, and reminders are Pro features (${PRO_PRICE}). `);
			const link = actions.descEl.createEl("a", {
				text: "Unlock Invoice Forge Pro",
				href: this.plugin.settings.purchaseUrl,
			});
			link.setAttr("target", "_blank");
			link.setAttr("rel", "noopener");
		}
	}

	private previewEl!: HTMLElement;
	private createBtn?: import("obsidian").ButtonComponent;

	private renderPreview(): void {
		if (!this.previewEl) return;
		this.previewEl.empty();

		if (!isValidISODate(this.periodStart) || !isValidISODate(this.periodEnd)) {
			this.previewEl.createEl("p", { text: "Enter both dates as a valid date (YYYY-MM-DD).", cls: "if-muted" });
			return;
		}
		if (this.periodStart > this.periodEnd) {
			this.previewEl.createEl("p", { text: "Start date must be on or before the end date.", cls: "if-muted" });
			return;
		}

		const { client, clientName } = this.resolveClient();
		const matched = filterEntries(this.entries, client, clientName, this.periodStart, this.periodEnd);

		if (matched.length === 0) {
			// Distinguish "this client has no work at all" from "none in this period"
			// — the latter is a common confusion (client is visible but preview empty).
			const allForClient = filterEntries(this.entries, client, clientName, "0000-01-01", "9999-12-31");
			if (allForClient.length > 0) {
				const dates = allForClient.map((e) => e.date).sort();
				this.previewEl.createEl("p", {
					text: `No entries in this period. This client has ${allForClient.length} entr${allForClient.length === 1 ? "y" : "ies"} dated ${dates[0]} to ${dates[dates.length - 1]} — widen the period.`,
					cls: "if-muted",
				});
			} else {
				this.previewEl.createEl("p", { text: "No entries match this client and date range.", cls: "if-muted" });
			}
			return;
		}
		const totalHours = matched.reduce((s, e) => s + e.hours, 0);
		// Use the exact same arithmetic + gating as buildInvoice so the previewed
		// numbers match the created invoice to the penny.
		const { baseRate, taxRate, currency } = resolveRates(client, this.plugin.settings.business, this.plugin.settings.isPro);
		const totals = summarizeEntries(matched, baseRate, taxRate, currency);

		let text = `${matched.length} entries · ${round2(totalHours)}h · subtotal ${formatMoney(totals.subtotal, currency)}`;
		if (totals.taxAmount > 0) {
			text += ` · +${formatMoney(totals.taxAmount, currency)} tax · total ${formatMoney(totals.total, currency)}`;
		}
		this.previewEl.createEl("p", { text });
	}

	private async create(): Promise<void> {
		if (!isValidISODate(this.periodStart) || !isValidISODate(this.periodEnd)) {
			new Notice("Enter both dates as a valid date (YYYY-MM-DD).");
			return;
		}
		if (this.periodStart > this.periodEnd) {
			new Notice("Start date must be on or before the end date.");
			return;
		}
		// Guard against a double-click issuing two concurrent creations (which
		// could reuse a number or collect the same entries twice).
		this.createBtn?.setDisabled(true);
		const { client, clientName } = this.resolveClient();
		try {
			const { file, invoice } = await this.plugin.createInvoice(client, clientName, this.periodStart, this.periodEnd);
			this.lastInvoice = invoice;
			this.lastFile = file;
			new Notice(`Created ${invoice.number} — ${formatMoney(invoice.total, invoice.currency)}`);
			if (this.plugin.settings.openAfterCreate) {
				await this.app.workspace.getLeaf(true).openFile(file);
			}
			if (!this.plugin.settings.isPro) {
				this.close();
			} else {
				// The Pro modal stays open so the user can Export PDF. Re-scan so the
				// preview reflects the now-billed entries rather than a stale total,
				// and a second Create doesn't hit a confusing "no entries" error
				// against data that no longer matches the vault. lastInvoice persists
				// across the re-render, so the Export button keeps working.
				await this.loadEntries();
			}
		} catch (err) {
			new Notice(err instanceof Error ? err.message : "Could not create invoice.");
		} finally {
			this.createBtn?.setDisabled(false);
		}
	}
}
