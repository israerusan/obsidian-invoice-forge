import type { BusinessProfile, Client, Invoice, InvoiceLine, TimeEntry } from "../model/types";
import { round2 } from "./money";

export interface BuildOptions {
	number: string;
	issueDate: string; // ISO
	periodStart: string; // ISO
	periodEnd: string; // ISO
	dueInDays: number;
	isPro: boolean;
}

// Keep entries for a given client within an inclusive ISO date range.
export function filterEntries(
	entries: TimeEntry[],
	client: Client | null,
	clientName: string,
	periodStart: string,
	periodEnd: string
): TimeEntry[] {
	const targetName = clientName.toLowerCase();
	return entries
		.filter((e) => {
			if (client) {
				if (e.clientId === client.id) return true;
				return e.clientName.toLowerCase() === client.name.toLowerCase();
			}
			return e.clientName.toLowerCase() === targetName;
		})
		.filter((e) => e.date >= periodStart && e.date <= periodEnd)
		.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

export function buildInvoice(
	entries: TimeEntry[],
	client: Client | null,
	business: BusinessProfile,
	opts: BuildOptions
): Invoice {
	const baseRate = (client && client.defaultRate) ?? business.defaultRate;
	const currency = opts.isPro ? (client && client.currency) || business.currency : business.currency;

	const lines: InvoiceLine[] = entries.map((e) => {
		const rate = e.rate ?? baseRate;
		const amount = round2(e.hours * rate);
		return { date: e.date, description: e.description || "Work", hours: e.hours, rate, amount };
	});

	const subtotal = round2(lines.reduce((sum, l) => sum + l.amount, 0));
	const taxRate = opts.isPro ? (client && client.taxRate) ?? business.taxRate : 0;
	const taxAmount = round2((subtotal * taxRate) / 100);
	const total = round2(subtotal + taxAmount);

	return {
		number: opts.number,
		clientId: client ? client.id : null,
		clientName: client ? client.name : entries[0]?.clientName ?? "Unassigned",
		clientEmail: client ? client.email : "",
		clientAddress: client ? client.address : "",
		currency,
		issueDate: opts.issueDate,
		dueDate: addDays(opts.issueDate, opts.dueInDays),
		periodStart: opts.periodStart,
		periodEnd: opts.periodEnd,
		lines,
		subtotal,
		taxRate,
		taxLabel: business.taxLabel || "Tax",
		taxAmount,
		total,
		notes: business.notes,
		status: "unpaid",
	};
}

export function addDays(iso: string, days: number): string {
	const d = new Date(iso + "T00:00:00");
	d.setDate(d.getDate() + days);
	return toISODate(d);
}

export function toISODate(d: Date): string {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
}
