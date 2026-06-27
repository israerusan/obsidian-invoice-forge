import { App, Modal, Notice, Setting } from "obsidian";
import type InvoiceForgePlugin from "../main";
import type { Client } from "../model/types";
import { slugify } from "../settings";

// Add or edit a single client. onSave is called with the resulting client.
export class ClientEditModal extends Modal {
	private plugin: InvoiceForgePlugin;
	private working: Client;
	private isNew: boolean;
	private onSave: () => void;

	constructor(app: App, plugin: InvoiceForgePlugin, client: Client | null, onSave: () => void) {
		super(app);
		this.plugin = plugin;
		this.isNew = client === null;
		this.onSave = onSave;
		this.working = client
			? { ...client }
			: { id: "", name: "", email: "", address: "", defaultRate: null, currency: null, taxRate: null };
	}

	onOpen(): void {
		this.titleEl.setText(this.isNew ? "Add client" : "Edit client");
		const { contentEl } = this;
		contentEl.empty();

		new Setting(contentEl).setName("Name").addText((t) =>
			t.setValue(this.working.name).onChange((v) => (this.working.name = v))
		);
		new Setting(contentEl)
			.setName("Tag slug")
			.setDesc("Used as #client/<slug> in your notes. Leave blank to auto-generate from the name.")
			.addText((t) => t.setPlaceholder("acme").setValue(this.working.id).onChange((v) => (this.working.id = v.trim())));
		new Setting(contentEl).setName("Email").addText((t) =>
			t.setValue(this.working.email).onChange((v) => (this.working.email = v))
		);
		new Setting(contentEl).setName("Address").addTextArea((t) =>
			t.setValue(this.working.address).onChange((v) => (this.working.address = v))
		);
		new Setting(contentEl)
			.setName("Default hourly rate")
			.setDesc("Blank uses the business default rate.")
			.addText((t) =>
				t
					.setPlaceholder(String(this.plugin.settings.business.defaultRate))
					.setValue(this.working.defaultRate?.toString() ?? "")
					.onChange((v) => (this.working.defaultRate = v.trim() ? Number(v) : null))
			);
		new Setting(contentEl)
			.setName("Currency")
			.setDesc("ISO code (USD, EUR, GBP…). Blank uses the business default.")
			.addText((t) =>
				t
					.setPlaceholder(this.plugin.settings.business.currency)
					.setValue(this.working.currency ?? "")
					.onChange((v) => (this.working.currency = v.trim() ? v.trim().toUpperCase() : null))
			);

		const taxSetting = new Setting(contentEl)
			.setName("Tax rate %")
			.setDesc(this.plugin.settings.isPro ? "Blank uses the business tax rate." : "Per-client tax is a Pro feature.");
		if (this.plugin.settings.isPro) {
			taxSetting.addText((t) =>
				t.setValue(this.working.taxRate?.toString() ?? "").onChange((v) => (this.working.taxRate = v.trim() ? Number(v) : null))
			);
		} else {
			taxSetting.settingEl.addClass("if-locked");
		}

		new Setting(contentEl).addButton((b) =>
			b
				.setButtonText("Save")
				.setCta()
				.onClick(() => this.save())
		);
	}

	private save(): void {
		if (!this.working.name.trim()) {
			new Notice("Client needs a name.");
			return;
		}
		if (!this.working.id) this.working.id = slugify(this.working.name);
		else this.working.id = slugify(this.working.id);

		const clients = this.plugin.settings.clients;
		const idx = clients.findIndex((c) => c.id === this.working.id);
		if (this.isNew && idx !== -1) {
			new Notice(`A client with slug "${this.working.id}" already exists.`);
			return;
		}
		if (idx !== -1) clients[idx] = this.working;
		else clients.push(this.working);

		void this.plugin.saveSettings().then(() => {
			this.onSave();
			this.close();
		});
	}
}
