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

export interface EntryTotals {
	lines: InvoiceLine[];
	subtotal: number;
	taxAmount: number;
	total: number;
}

function finite(n: number, fallback: number): number {
	return Number.isFinite(n) ? n : fallback;
}

// The single source of truth for invoice arithmetic. Both buildInvoice and the
// modal's live preview call this so the previewed subtotal/total can never drift
// from the created invoice (each line is rounded, then summed, then taxed).
export function summarizeEntries(entries: TimeEntry[], baseRate: number, taxRate: number): EntryTotals {
	const safeBase = finite(baseRate, 0);
	const safeTaxRate = finite(taxRate, 0);
	const lines: InvoiceLine[] = entries.map((e) => {
		const rate = finite(e.rate ?? safeBase, safeBase);
		const amount = round2(e.hours * rate);
		return { date: e.date, description: e.description || "Work", hours: e.hours, rate, amount };
	});
	const subtotal = round2(lines.reduce((sum, l) => sum + l.amount, 0));
	const taxAmount = round2((subtotal * safeTaxRate) / 100);
	const total = round2(subtotal + taxAmount);
	return { lines, subtotal, taxAmount, total };
}

// Resolve the effective base rate / tax rate / currency for an invoice, honoring
// the free-vs-Pro gates. Shared so preview and build agree on gating too.
export function resolveRates(
	client: Client | null,
	business: BusinessProfile,
	isPro: boolean
): { baseRate: number; taxRate: number; currency: string } {
	return {
		baseRate: (client && client.defaultRate) ?? business.defaultRate,
		taxRate: isPro ? (client && client.taxRate) ?? business.taxRate : 0,
		currency: isPro ? (client && client.currency) || business.currency : business.currency,
	};
}

export function buildInvoice(
	entries: TimeEntry[],
	client: Client | null,
	business: BusinessProfile,
	opts: BuildOptions
): Invoice {
	const { baseRate, taxRate, currency } = resolveRates(client, business, opts.isPro);
	const { lines, subtotal, taxAmount, total } = summarizeEntries(entries, baseRate, taxRate);

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

// True only for a real calendar date in YYYY-MM-DD form. Rejects 2026-99-40,
// 2026-02-30, etc. (a plain regex would accept those).
export function isValidISODate(value: string): boolean {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
	const [y, m, d] = value.split("-").map(Number);
	if (m < 1 || m > 12 || d < 1 || d > 31) return false;
	const dt = new Date(y, m - 1, d);
	return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
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
