import { Notice } from "obsidian";
import type InvoiceForgePlugin from "../main";
import { toISODate } from "../invoice/InvoiceBuilder";
import { classifyDue } from "../invoice/invoiceNotes";

// Pro: scans invoice notes' frontmatter for due/unpaid invoices and surfaces
// reminders on load and roughly twice a day while Obsidian stays open. The note
// reading and due-date classification are shared with the "mark paid" and
// outstanding-invoices commands (see invoiceNotes.ts + collectInvoiceNotes).
export class ReminderManager {
	private intervalId: number | null = null;

	constructor(private plugin: InvoiceForgePlugin) {}

	start(): void {
		this.stop();
		if (!this.plugin.settings.isPro || !this.plugin.settings.reminderEnabled) return;
		void this.check();
		// Re-check every 12 hours.
		this.intervalId = window.setInterval(() => void this.check(), 12 * 60 * 60 * 1000);
		this.plugin.registerInterval(this.intervalId);
	}

	stop(): void {
		if (this.intervalId !== null) {
			window.clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	async check(): Promise<void> {
		if (!this.plugin.settings.isPro || !this.plugin.settings.reminderEnabled) return;
		const today = toISODate(new Date());
		const soon = toISODate(addDays(new Date(), this.plugin.settings.reminderDaysBefore));

		const due: string[] = [];
		const overdue: string[] = [];
		for (const { meta } of this.plugin.collectInvoiceNotes()) {
			// A hand-typed "Paid"/"PAID" silences the reminder (normalized in readInvoiceMeta).
			if (meta.status === "paid") continue;
			const bucket = classifyDue(meta.due, today, soon);
			if (bucket === "none") continue;
			const label = `${meta.number} (${meta.client || "?"}) due ${meta.due}`;
			if (bucket === "overdue") overdue.push(label);
			else if (bucket === "due-soon") due.push(label);
		}

		if (overdue.length > 0) {
			new Notice(`⚠ ${overdue.length} overdue invoice(s):\n${overdue.join("\n")}`, 10000);
		}
		if (due.length > 0) {
			new Notice(`Invoices due soon:\n${due.join("\n")}`, 8000);
		}
	}
}

function addDays(d: Date, days: number): Date {
	const copy = new Date(d);
	copy.setDate(copy.getDate() + days);
	return copy;
}
