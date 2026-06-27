import { App, PluginSettingTab, Setting } from "obsidian";
import type InvoiceForgePlugin from "../main";
import { DEFAULT_SETTINGS } from "../settings";
import { ClientEditModal } from "./ClientEditModal";

export class InvoiceForgeSettingTab extends PluginSettingTab {
	plugin: InvoiceForgePlugin;

	constructor(app: App, plugin: InvoiceForgePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		// ---- License ----
		new Setting(containerEl)
			.setName("License key")
			.setDesc("Enter your Pro license key. Verified offline — no account or server required.")
			.addText((text) =>
				text
					.setPlaceholder("payload.signature")
					.setValue(this.plugin.settings.licenseKey)
					.onChange((value) => {
						this.plugin.settings.licenseKey = value;
						void this.plugin.refreshLicense().then(() => {
							this.plugin.reminders.start();
							this.display();
						});
					})
			);

		const status = containerEl.createDiv({ cls: "if-license-status" });
		if (this.plugin.settings.isPro) {
			status.createEl("p", {
				text: `Pro active${this.plugin.settings.licenseEmail ? ` (${this.plugin.settings.licenseEmail})` : ""}.`,
			});
		} else {
			status.createEl("p", {
				text: "Free tier active. Upgrade to unlock PDF/print export, tax & multi-currency, billing reminders, and payment tracking.",
			});
			const link = status.createEl("a", { text: "Get Invoice Forge Pro", href: this.plugin.settings.purchaseUrl });
			link.setAttr("target", "_blank");
		}

		new Setting(containerEl)
			.setName("Purchase page URL")
			.setDesc("Link shown for Pro upgrades.")
			.addText((text) =>
				text
					.setPlaceholder(DEFAULT_SETTINGS.purchaseUrl)
					.setValue(this.plugin.settings.purchaseUrl)
					.onChange((value) => {
						this.plugin.settings.purchaseUrl = value.trim() || DEFAULT_SETTINGS.purchaseUrl;
						void this.plugin.saveSettings();
					})
			);

		// ---- Business profile ----
		new Setting(containerEl).setName("Your business").setHeading();
		const biz = this.plugin.settings.business;

		this.textRow(containerEl, "Business name", biz.name, (v) => (biz.name = v));
		this.textRow(containerEl, "Business email", biz.email, (v) => (biz.email = v));
		new Setting(containerEl).setName("Business address").addTextArea((t) =>
			t.setValue(biz.address).onChange((v) => {
				biz.address = v;
				void this.plugin.saveSettings();
			})
		);
		new Setting(containerEl)
			.setName("Default hourly rate")
			.addText((t) =>
				t.setValue(String(biz.defaultRate)).onChange((v) => {
					biz.defaultRate = Number(v) || 0;
					void this.plugin.saveSettings();
				})
			);
		new Setting(containerEl)
			.setName("Default currency")
			.setDesc("ISO code, e.g. USD, EUR, GBP.")
			.addText((t) =>
				t.setValue(biz.currency).onChange((v) => {
					biz.currency = v.trim().toUpperCase() || "USD";
					void this.plugin.saveSettings();
				})
			);
		new Setting(containerEl)
			.setName("Invoice footer / payment terms")
			.addTextArea((t) =>
				t.setValue(biz.notes).onChange((v) => {
					biz.notes = v;
					void this.plugin.saveSettings();
				})
			);

		// ---- Invoice options ----
		new Setting(containerEl).setName("Invoices").setHeading();
		new Setting(containerEl)
			.setName("Invoice folder")
			.setDesc("Folder where generated invoice notes are saved.")
			.addText((t) =>
				t.setValue(this.plugin.settings.invoiceFolder).onChange((v) => {
					this.plugin.settings.invoiceFolder = v.trim() || "Invoices";
					void this.plugin.saveSettings();
				})
			);
		new Setting(containerEl)
			.setName("Number template")
			.setDesc("Tokens: {YYYY} {YY} {MM} {DD} {seq} {seq:4}")
			.addText((t) =>
				t.setValue(this.plugin.settings.numberTemplate).onChange((v) => {
					this.plugin.settings.numberTemplate = v.trim() || DEFAULT_SETTINGS.numberTemplate;
					void this.plugin.saveSettings();
				})
			);
		new Setting(containerEl)
			.setName("Next invoice number")
			.setDesc("The sequence used for the next generated invoice.")
			.addText((t) =>
				t.setValue(String(this.plugin.settings.nextSeq)).onChange((v) => {
					const n = parseInt(v, 10);
					if (!Number.isNaN(n) && n > 0) {
						this.plugin.settings.nextSeq = n;
						void this.plugin.saveSettings();
					}
				})
			);
		new Setting(containerEl)
			.setName("Payment terms (days)")
			.setDesc("Due date = issue date + this many days.")
			.addText((t) =>
				t.setValue(String(this.plugin.settings.dueInDays)).onChange((v) => {
					const n = parseInt(v, 10);
					if (!Number.isNaN(n) && n >= 0) {
						this.plugin.settings.dueInDays = n;
						void this.plugin.saveSettings();
					}
				})
			);
		new Setting(containerEl).setName("Open invoice after creating").addToggle((t) =>
			t.setValue(this.plugin.settings.openAfterCreate).onChange((v) => {
				this.plugin.settings.openAfterCreate = v;
				void this.plugin.saveSettings();
			})
		);

		// ---- Pro: tax & branding ----
		new Setting(containerEl).setName("Tax & branding (Pro)").setHeading();
		this.proText(containerEl, "Tax label", biz.taxLabel, "e.g. VAT, GST, Sales tax", (v) => (biz.taxLabel = v));
		this.proText(containerEl, "Default tax rate %", String(biz.taxRate), "0 for none", (v) => (biz.taxRate = Number(v) || 0));
		this.proText(containerEl, "Logo URL or path", biz.logoUrl, "Shown on PDF/print invoices", (v) => (biz.logoUrl = v));

		// ---- Pro: reminders ----
		new Setting(containerEl).setName("Billing reminders (Pro)").setHeading();
		const reminderSetting = new Setting(containerEl)
			.setName("Enable due-date reminders")
			.setDesc("Notifies you of unpaid invoices that are due soon or overdue.");
		if (this.plugin.settings.isPro) {
			reminderSetting.addToggle((t) =>
				t.setValue(this.plugin.settings.reminderEnabled).onChange((v) => {
					this.plugin.settings.reminderEnabled = v;
					void this.plugin.saveSettings().then(() => this.plugin.reminders.start());
				})
			);
			new Setting(containerEl)
				.setName("Remind this many days before due")
				.addText((t) =>
					t.setValue(String(this.plugin.settings.reminderDaysBefore)).onChange((v) => {
						const n = parseInt(v, 10);
						if (!Number.isNaN(n) && n >= 0) {
							this.plugin.settings.reminderDaysBefore = n;
							void this.plugin.saveSettings();
						}
					})
				);
		} else {
			reminderSetting.settingEl.addClass("if-locked");
			reminderSetting.descEl.appendText(" (Pro)");
		}

		// ---- Clients ----
		new Setting(containerEl).setName("Clients").setHeading();
		new Setting(containerEl)
			.setName("Add client")
			.setDesc("Configured clients get default rate, currency, address, and #client/<slug> resolution.")
			.addButton((b) =>
				b
					.setButtonText("Add client")
					.setCta()
					.onClick(() => new ClientEditModal(this.app, this.plugin, null, () => this.display()).open())
			);

		const list = containerEl.createDiv();
		if (this.plugin.settings.clients.length === 0) {
			list.createEl("p", { text: "No clients yet.", cls: "if-muted" });
		}
		for (const client of this.plugin.settings.clients) {
			const row = new Setting(list)
				.setName(client.name)
				.setDesc(`#client/${client.id}${client.defaultRate ? ` · ${client.defaultRate}/h` : ""}${client.currency ? ` · ${client.currency}` : ""}`);
			row.addButton((b) =>
				b.setButtonText("Edit").onClick(() => new ClientEditModal(this.app, this.plugin, client, () => this.display()).open())
			);
			row.addButton((b) =>
				b.setButtonText("Remove").setWarning().onClick(() => {
					this.plugin.settings.clients = this.plugin.settings.clients.filter((c) => c.id !== client.id);
					void this.plugin.saveSettings().then(() => this.display());
				})
			);
		}
	}

	private textRow(containerEl: HTMLElement, name: string, value: string, set: (v: string) => void): void {
		new Setting(containerEl).setName(name).addText((t) =>
			t.setValue(value).onChange((v) => {
				set(v);
				void this.plugin.saveSettings();
			})
		);
	}

	private proText(containerEl: HTMLElement, name: string, value: string, desc: string, set: (v: string) => void): void {
		const setting = new Setting(containerEl).setName(name).setDesc(desc);
		if (!this.plugin.settings.isPro) {
			setting.settingEl.addClass("if-locked");
			setting.descEl.appendText(" (Pro)");
			return;
		}
		setting.addText((t) =>
			t.setValue(value).onChange((v) => {
				set(v);
				void this.plugin.saveSettings();
			})
		);
	}
}
