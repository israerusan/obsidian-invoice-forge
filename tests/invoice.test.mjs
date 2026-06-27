import assert from "assert";
import { buildInvoice, filterEntries, formatInvoiceNumber, addDays } from "./.testable.mjs";

const business = {
	name: "Me Inc",
	email: "me@example.com",
	address: "1 Main St",
	logoUrl: "",
	defaultRate: 80,
	currency: "USD",
	taxRate: 20,
	taxLabel: "VAT",
	notes: "Thanks",
};

const acme = { id: "acme", name: "Acme Corp", email: "ap@acme.com", address: "2 Acme Rd", defaultRate: 100, currency: "EUR", taxRate: 19 };

const entries = [
	{ clientId: "acme", clientName: "Acme Corp", date: "2026-06-05", hours: 2, rate: null, description: "A", sourcePath: "x", line: 0 },
	{ clientId: "acme", clientName: "Acme Corp", date: "2026-06-20", hours: 1.5, rate: 120, description: "B", sourcePath: "x", line: 1 },
	{ clientId: "acme", clientName: "Acme Corp", date: "2026-07-02", hours: 5, rate: null, description: "OUT OF RANGE", sourcePath: "x", line: 2 },
	{ clientId: "beta", clientName: "Beta", date: "2026-06-10", hours: 3, rate: null, description: "other client", sourcePath: "x", line: 3 },
];

// Filter: only Acme entries within June.
const filtered = filterEntries(entries, acme, "Acme Corp", "2026-06-01", "2026-06-30");
assert.equal(filtered.length, 2);
assert.deepEqual(filtered.map((e) => e.description), ["A", "B"]);

// Pro invoice: client rate 100 for A, override 120 for B, EUR currency, 19% tax.
const proInv = buildInvoice(filtered, acme, business, {
	number: "INV-1",
	issueDate: "2026-06-30",
	periodStart: "2026-06-01",
	periodEnd: "2026-06-30",
	dueInDays: 14,
	isPro: true,
});
assert.equal(proInv.currency, "EUR");
assert.equal(proInv.subtotal, 380); // 2*100 + 1.5*120
assert.equal(proInv.taxRate, 19);
assert.equal(proInv.taxAmount, 72.2);
assert.equal(proInv.total, 452.2);
assert.equal(proInv.dueDate, "2026-07-14");
assert.equal(proInv.lines.length, 2);

// Free invoice: tax suppressed, business currency forced.
const freeInv = buildInvoice(filtered, acme, business, {
	number: "INV-2",
	issueDate: "2026-06-30",
	periodStart: "2026-06-01",
	periodEnd: "2026-06-30",
	dueInDays: 14,
	isPro: false,
});
assert.equal(freeInv.currency, "USD");
assert.equal(freeInv.taxRate, 0);
assert.equal(freeInv.taxAmount, 0);
assert.equal(freeInv.total, 380);

// Numbering templates
const d = new Date("2026-06-26T00:00:00");
assert.equal(formatInvoiceNumber("INV-{YYYY}-{seq:4}", 7, d), "INV-2026-0007");
assert.equal(formatInvoiceNumber("{YY}{MM}{DD}-{seq}", 12, d), "260626-12");

// addDays
assert.equal(addDays("2026-06-30", 14), "2026-07-14");

console.log("invoice tests passed");
