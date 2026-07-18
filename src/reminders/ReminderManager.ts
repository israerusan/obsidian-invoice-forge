import { Notice } from "obsidian";
import type InvoiceForgePlugin from "../main";
import { isValidISODate, toISODate } from "../invoice/InvoiceBuilder";

// Pro: scans invoice notes' frontmatter for due/unpaid invoices and surfaces
// reminders on load and roughly twice a day while Obsidian stays open.
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

		// Use the SAME normalized/sanitized folder as invoice creation, so a folder
		// setting with a stray leading/trailing slash (or invalid char) can't make
		// the scan match nothing and silently drop every reminder. Compare case-
		// INSENSITIVELY: on Windows/macOS the folder on disk ("Invoices") can differ
		// in case from the setting ("invoices"), and an exact match would skip every
		// reminder in the folder.
		const prefix = (this.plugin.invoiceFolderPath() + "/").toLowerCase();
		const files = this.plugin.app.vault
			.getMarkdownFiles()
			.filter((f) => f.path.toLowerCase().startsWith(prefix));

		const due: string[] = [];
		const overdue: string[] = [];
		for (const file of files) {
			const fm = this.plugin.app.metadataCache.getFileCache(file)?.frontmatter;
			if (!fm || fm.invoice === undefined) continue;
			// Status is matched case-insensitively so a hand-typed "Paid"/"PAID" still
			// silences the reminder instead of nagging forever.
			const status = typeof fm.status === "string" ? fm.status.trim().toLowerCase() : "unpaid";
			if (status === "paid") continue;
			// A due date may be a string, or — when the user hand-writes unquoted
			// frontmatter (`due: 2026-07-18`) — a Date the YAML parser produced. Accept
			// both, then require a real ISO calendar date before comparing lexically,
			// so a malformed value can't masquerade as a due date.
			const dueDate = normalizeDue(fm.due);
			if (!isValidISODate(dueDate)) continue;
			const invoiceLabel = fmString(fm.invoice);
			const clientLabel = fmString(fm.client) || "?";
			const label = `${invoiceLabel} (${clientLabel}) due ${dueDate}`;
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

// Frontmatter values are untyped (any); only render strings/numbers, never an
// object's "[object Object]" default stringification, into reminder labels.
function fmString(value: unknown): string {
	if (typeof value === "string") return value;
	if (typeof value === "number") return String(value);
	return "";
}

// Coerce a frontmatter `due` value to an ISO date string. Obsidian may surface an
// unquoted YYYY-MM-DD as a Date object; a quoted one stays a string.
function normalizeDue(value: unknown): string {
	if (typeof value === "string") return value.trim();
	if (value instanceof Date && !Number.isNaN(value.getTime())) return toISODate(value);
	return "";
}

function addDays(d: Date, days: number): Date {
	const copy = new Date(d);
	copy.setDate(copy.getDate() + days);
	return copy;
}
