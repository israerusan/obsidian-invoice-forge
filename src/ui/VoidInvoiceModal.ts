import { App, Modal, Setting, TFile } from "obsidian";
import type InvoiceForgePlugin from "../main";
import type { InvoiceMeta } from "../invoice/invoiceNotes";

// Confirmation for "Void invoice". Voiding trashes the invoice note AND removes its
// billing markers from source lines (making that work billable again) — destructive
// and easy to trigger on the wrong invoice, so the blast radius (how many lines in
// how many notes) is shown up front and the action is behind an explicit button.
export class VoidInvoiceModal extends Modal {
	constructor(
		app: App,
		private plugin: InvoiceForgePlugin,
		private file: TFile,
		private meta: InvoiceMeta
	) {
		super(app);
	}

	onOpen(): void {
		const number = this.meta.number || this.file.basename;
		this.titleEl.setText(`Void ${number}?`);
		const { contentEl } = this;
		contentEl.createEl("p", { text: "Counting the source lines this invoice billed…", cls: "if-muted" });
		void this.renderConfirm(number);
	}

	private async renderConfirm(number: string): Promise<void> {
		let hits: { path: string; count: number }[] = [];
		try {
			hits = await this.plugin.scanner.findInvoiceMarkers(this.meta.number);
		} catch {
			// Fall through with an empty list; voiding will still trash the note.
		}
		const lineCount = hits.reduce((sum, h) => sum + h.count, 0);

		const { contentEl } = this;
		contentEl.empty();

		const notesLabel = `${hits.length} note${hits.length === 1 ? "" : "s"}`;
		const linesLabel = `${lineCount} billable line${lineCount === 1 ? "" : "s"}`;
		contentEl.createEl("p", {
			text:
				lineCount > 0
					? `This will move the invoice note to trash and remove the [invoice:: ${number}] marker from ${linesLabel} across ${notesLabel}, making that work billable again.`
					: `This will move the invoice note to trash. No source lines currently carry the [invoice:: ${number}] marker (they may have been edited or deleted), so nothing will be released.`,
		});

		if (hits.length > 0) {
			const list = contentEl.createEl("ul", { cls: "if-muted" });
			for (const h of hits.slice(0, 12)) {
				list.createEl("li", { text: `${h.path} — ${h.count} line${h.count === 1 ? "" : "s"}` });
			}
			if (hits.length > 12) list.createEl("li", { text: `…and ${hits.length - 12} more` });
		}

		contentEl.createEl("p", {
			text: "The invoice number is not reused — a corrected invoice you create next gets a new number.",
			cls: "if-muted",
		});

		new Setting(contentEl)
			.addButton((b) => b.setButtonText("Cancel").onClick(() => this.close()))
			.addButton((b) =>
				b
					.setButtonText("Void invoice")
					.setWarning()
					.onClick(() => {
						b.setDisabled(true);
						void this.plugin.voidInvoice(this.file).finally(() => this.close());
					})
			);
	}
}
