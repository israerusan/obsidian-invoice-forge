import type { BusinessProfile, Client } from "./model/types";

// The public one-time Pro price. Kept in one place so every buyer-facing surface
// (settings upsell, modal, README) can quote the same number.
export const PRO_PRICE = "$15 one-time";

// A crash-recovery record written just before an invoice's source entries are
// marked billed, and cleared once the invoice note exists. If the process dies
// in between, onload replays it: create the missing note and mark any entries
// that weren't marked — so we never end up with billed markers and no invoice.
export interface PendingInvoice {
	number: string;
	path: string;
	markdown: string;
	entries: { sourcePath: string; line: number; raw: string }[];
}

export interface InvoiceForgeSettings {
	licenseKey: string;
	isPro: boolean;
	licenseEmail: string;
	purchaseUrl: string;
	pendingInvoice: PendingInvoice | null;

	business: BusinessProfile;
	clients: Client[];

	invoiceFolder: string; // folder for generated invoice notes
	numberTemplate: string; // e.g. INV-{YYYY}-{seq:4}
	nextSeq: number; // next invoice sequence
	dueInDays: number;
	openAfterCreate: boolean;

	// Pro
	reminderEnabled: boolean;
	reminderDaysBefore: number; // notify this many days before due date
	defaultPeriodDays: number; // default look-back window for the invoice modal
}

export const DEFAULT_BUSINESS: BusinessProfile = {
	name: "",
	email: "",
	address: "",
	logoUrl: "",
	defaultRate: 75,
	currency: "USD",
	taxRate: 0,
	taxLabel: "Tax",
	notes: "Payment due within 14 days. Thank you for your business.",
};

export const DEFAULT_SETTINGS: InvoiceForgeSettings = {
	licenseKey: "",
	isPro: false,
	licenseEmail: "",
	purchaseUrl: "https://buymeacoffee.com/vaultspotlight/e/554726",
	pendingInvoice: null,

	business: DEFAULT_BUSINESS,
	clients: [],

	invoiceFolder: "Invoices",
	numberTemplate: "INV-{YYYY}-{seq:4}",
	nextSeq: 1,
	dueInDays: 14,
	openAfterCreate: true,

	reminderEnabled: false,
	reminderDaysBefore: 3,
	defaultPeriodDays: 30,
};

// Unicode-aware so it stays consistent with the entry parser's #client/<slug>
// regex (which accepts any letter/number). Stripping non-ASCII here — as a plain
// [^a-z0-9] would — turned "Café" into id "caf" while #client/café parsed as
// "café", so the configured client's rate/currency silently never matched its
// tagged work. Keeping Unicode letters/digits keeps the two in lockstep.
export function slugify(name: string): string {
	return name
		.toLowerCase()
		.trim()
		.replace(/[^\p{L}\p{N}]+/gu, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 40) || "client";
}
