import { Notice } from "obsidian";
import type InvoiceForgePlugin from "../main";
import { toISODate } from "../invoice/InvoiceBuilder";

// Pro: scans invoice notes' frontmatter for due/unpaid invoices and surfaces
// reminders on load and once a day while Obsidian stays open.
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

		const folder = this.plugin.settings.invoiceFolder;
		const files = this.plugin.app.vault
			.getMarkdownFiles()
			.filter((f) => !folder || f.path.startsWith(folder + "/"));

		const due: string[] = [];
		const overdue: string[] = [];
		for (const file of files) {
			const fm = this.plugin.app.metadataCache.getFileCache(file)?.frontmatter as
				| Record<string, unknown>
				| undefined;
			if (!fm || fm.invoice === undefined) continue;
			const status = String(fm.status ?? "unpaid");
			if (status === "paid") continue;
			const dueDate = typeof fm.due === "string" ? fm.due : "";
			if (!dueDate) continue;
			const label = `${fm.invoice} (${fm.client ?? "?"}) due ${dueDate}`;
			if (dueDate < today) overdue.push(label);
			else if (dueDate <= soon) due.push(label);
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
