import type { BusinessProfile, Client } from "./model/types";

export interface InvoiceForgeSettings {
	licenseKey: string;
	isPro: boolean;
	licenseEmail: string;
	purchaseUrl: string;

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
	purchaseUrl: "https://buymeacoffee.com/vaultspotlight",

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

export function slugify(name: string): string {
	return name
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 40) || "client";
}
