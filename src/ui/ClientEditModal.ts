import { App, Modal, Notice, Setting } from "obsidian";
import type InvoiceForgePlugin from "../main";
import type { Client } from "../model/types";
import { slugify } from "../settings";

// Add or edit a single client. onSave is called with the resulting client.
export class ClientEditModal extends Modal {
	private plugin: InvoiceForgePlugin;
	private working: Client;
	private isNew: boolean;
	private readonly originalId: string | null;
	private onSave: () => void;

	constructor(app: App, plugin: InvoiceForgePlugin, client: Client | null, onSave: () => void) {
		super(app);
		this.plugin = plugin;
		this.isNew = client === null;
		this.originalId = client ? client.id : null;
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
					.onChange((v) => (this.working.defaultRate = parseNumberOrNull(v)))
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
				t.setValue(this.working.taxRate?.toString() ?? "").onChange((v) => (this.working.taxRate = parseNumberOrNull(v)))
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
		if (this.working.defaultRate !== null && this.working.defaultRate < 0) {
			new Notice("Default rate must be 0 or more.");
			return;
		}
		if (this.working.taxRate !== null && (this.working.taxRate < 0 || this.working.taxRate > 100)) {
			new Notice("Tax rate must be between 0 and 100.");
			return;
		}
		if (!this.working.id) this.working.id = slugify(this.working.name);
		else this.working.id = slugify(this.working.id);

		const clients = this.plugin.settings.clients;
		// Reject a slug that belongs to a DIFFERENT client — editing A's slug to
		// B's must not overwrite B (and leave A orphaned).
		if (clients.some((c) => c.id === this.working.id && c.id !== this.originalId)) {
			new Notice(`A client with slug "${this.working.id}" already exists.`);
			return;
		}
		// Replace the original record (matched by its id before the edit), or add.
		const idx = this.originalId ? clients.findIndex((c) => c.id === this.originalId) : -1;
		if (idx !== -1) clients[idx] = this.working;
		else clients.push(this.working);

		void this.plugin.saveSettings().then(() => {
			this.onSave();
			this.close();
		});
	}
}

// Blank -> null (fall back to business default). A non-numeric entry also -> null
// rather than NaN, which would otherwise pass `??` and render "$NaN" on an
// invoice sent to a client.
function parseNumberOrNull(value: string): number | null {
	const trimmed = value.trim();
	if (!trimmed) return null;
	const n = Number(trimmed);
	return Number.isFinite(n) ? n : null;
}
