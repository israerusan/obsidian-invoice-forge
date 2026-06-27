export interface Client {
	id: string; // slug used in #client/<id>
	name: string;
	email: string;
	address: string;
	defaultRate: number | null; // per hour; null falls back to business default
	currency: string | null; // ISO code; null falls back to business default
	taxRate: number | null; // percent; null falls back to business default (Pro)
}

export interface BusinessProfile {
	name: string;
	email: string;
	address: string;
	logoUrl: string; // Pro: shown on PDF/print invoices
	defaultRate: number;
	currency: string;
	taxRate: number; // percent (Pro)
	taxLabel: string; // e.g. "VAT", "GST", "Sales tax"
	notes: string; // footer/payment terms shown on invoices
}

export interface TimeEntry {
	clientId: string | null; // resolved slug, or null when only a raw name is known
	clientName: string; // display name (raw token or resolved client name)
	date: string; // ISO YYYY-MM-DD
	hours: number;
	rate: number | null; // explicit per-entry override, else null
	description: string;
	sourcePath: string; // note the entry came from
	line: number; // 0-based line number in the source note
}

export interface InvoiceLine {
	date: string;
	description: string;
	hours: number;
	rate: number;
	amount: number;
}

export type PaymentStatus = "unpaid" | "paid" | "overdue";

export interface Invoice {
	number: string;
	clientId: string | null;
	clientName: string;
	clientEmail: string;
	clientAddress: string;
	currency: string;
	issueDate: string; // ISO
	dueDate: string; // ISO
	periodStart: string; // ISO
	periodEnd: string; // ISO
	lines: InvoiceLine[];
	subtotal: number;
	taxRate: number; // percent
	taxLabel: string;
	taxAmount: number;
	total: number;
	notes: string;
	status: PaymentStatus;
}
