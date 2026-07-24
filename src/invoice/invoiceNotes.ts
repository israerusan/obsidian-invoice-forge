import { isValidISODate, toISODate } from "./InvoiceBuilder";

// Pure helpers for reading and classifying the invoice notes this plugin writes.
// The frontmatter it parses is untyped (hand-editable), so every field is coerced
// defensively — the same discipline the settings loader uses. Kept Obsidian-free
// so the receivables logic (reminders, "mark paid", the outstanding summary) is
// unit-tested without the vault API.

export interface InvoiceMeta {
	number: string; // invoice number (from the `invoice` frontmatter key)
	client: string;
	status: string; // normalized, lowercased; defaults to "unpaid" when absent
	due: string; // ISO date, or "" when missing/invalid
	issued: string; // ISO date, or ""
	total: number | null;
	currency: string; // ISO code; defaults to "USD"
}

// Frontmatter values are `any`; render only strings/numbers, never an object's
// "[object Object]" default stringification.
function fmString(value: unknown): string {
	if (typeof value === "string") return value;
	if (typeof value === "number") return String(value);
	return "";
}

// Coerce a frontmatter `due`/`issued` value to an ISO date string. Obsidian may
// surface an unquoted YYYY-MM-DD as a Date object; a quoted one stays a string.
export function normalizeDate(value: unknown): string {
	if (typeof value === "string") {
		const trimmed = value.trim();
		return isValidISODate(trimmed) ? trimmed : "";
	}
	if (value instanceof Date && !Number.isNaN(value.getTime())) return toISODate(value);
	return "";
}

// True when a status field marks the invoice settled. Case/space-insensitive so a
// hand-typed "Paid"/" PAID " still counts.
export function isPaidStatus(status: unknown): boolean {
	return typeof status === "string" && status.trim().toLowerCase() === "paid";
}

// Read a normalized invoice record from a note's frontmatter, or null when the
// note isn't one of ours (no `invoice` key). `fm` is the raw metadataCache
// frontmatter object (or undefined when the note has none).
export function readInvoiceMeta(fm: Record<string, unknown> | null | undefined): InvoiceMeta | null {
	if (!fm || fm.invoice === undefined) return null;
	const total = typeof fm.total === "number" && Number.isFinite(fm.total) ? fm.total : null;
	return {
		number: fmString(fm.invoice),
		client: fmString(fm.client),
		status: typeof fm.status === "string" && fm.status.trim() ? fm.status.trim().toLowerCase() : "unpaid",
		due: normalizeDate(fm.due),
		issued: normalizeDate(fm.issued),
		total,
		currency: typeof fm.currency === "string" && fm.currency.trim() ? fm.currency.trim().toUpperCase() : "USD",
	};
}

export type DueBucket = "overdue" | "due-soon" | "later" | "none";

// Bucket an invoice's due date relative to today and a "soon" horizon. Dates are
// compared lexically — safe because all three are validated ISO YYYY-MM-DD.
export function classifyDue(dueISO: string, todayISO: string, soonISO: string): DueBucket {
	if (!isValidISODate(dueISO)) return "none";
	if (dueISO < todayISO) return "overdue";
	if (dueISO <= soonISO) return "due-soon";
	return "later";
}

export interface OutstandingSummary {
	unpaidCount: number;
	overdue: InvoiceMeta[];
	dueSoon: InvoiceMeta[];
	byCurrency: { currency: string; total: number }[];
}

// Summarize the unpaid (non-"paid") invoices: how many, which are overdue / due
// soon, and the outstanding total per currency. Paid invoices are excluded. The
// per-currency totals sum only records that carry a numeric total.
export function summarizeOutstanding(metas: InvoiceMeta[], todayISO: string, soonISO: string): OutstandingSummary {
	const unpaid = metas.filter((m) => m.status !== "paid");
	const overdue: InvoiceMeta[] = [];
	const dueSoon: InvoiceMeta[] = [];
	const totals = new Map<string, number>();
	for (const m of unpaid) {
		const bucket = classifyDue(m.due, todayISO, soonISO);
		if (bucket === "overdue") overdue.push(m);
		else if (bucket === "due-soon") dueSoon.push(m);
		if (m.total !== null) totals.set(m.currency, (totals.get(m.currency) ?? 0) + m.total);
	}
	// Sort overdue oldest-first and due-soon soonest-first so the most urgent
	// invoices lead each list.
	overdue.sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : 0));
	dueSoon.sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : 0));
	const byCurrency = [...totals.entries()]
		.map(([currency, total]) => ({ currency, total }))
		.sort((a, b) => b.total - a.total);
	return { unpaidCount: unpaid.length, overdue, dueSoon, byCurrency };
}
