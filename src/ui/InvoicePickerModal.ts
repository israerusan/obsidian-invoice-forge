import { App, FuzzySuggestModal, TFile } from "obsidian";
import type InvoiceForgePlugin from "../main";
import type { InvoiceMeta } from "../invoice/invoiceNotes";
import { formatMoney } from "../invoice/money";

export interface InvoiceChoice {
	file: TFile;
	meta: InvoiceMeta;
}

// A fuzzy picker over invoice notes — used by "Mark invoice as paid" when no
// invoice note is active. Overdue invoices are listed first so the most urgent
// receivable is easiest to settle.
export class InvoicePickerModal extends FuzzySuggestModal<InvoiceChoice> {
	constructor(
		app: App,
		_plugin: InvoiceForgePlugin,
		private choices: InvoiceChoice[],
		private onPick: (choice: InvoiceChoice) => void | Promise<void>
	) {
		super(app);
		this.setPlaceholder("Pick an invoice to mark paid…");
	}

	getItems(): InvoiceChoice[] {
		// Overdue (has a due date in the past) first, then by due date ascending, so
		// the oldest debt surfaces at the top; undated invoices sort last.
		return [...this.choices].sort((a, b) => {
			const da = a.meta.due || "9999-12-31";
			const db = b.meta.due || "9999-12-31";
			return da < db ? -1 : da > db ? 1 : 0;
		});
	}

	getItemText(choice: InvoiceChoice): string {
		const { meta } = choice;
		const bits = [meta.number || choice.file.basename];
		if (meta.client) bits.push(meta.client);
		if (meta.total !== null) bits.push(formatMoney(meta.total, meta.currency));
		if (meta.due) bits.push(`due ${meta.due}`);
		return bits.join(" · ");
	}

	onChooseItem(choice: InvoiceChoice): void {
		void this.onPick(choice);
	}
}
