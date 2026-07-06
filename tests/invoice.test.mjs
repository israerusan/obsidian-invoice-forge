import assert from "assert";
import {
	buildInvoice,
	filterEntries,
	formatInvoiceNumber,
	addDays,
	summarizeEntries,
	resolveRates,
	round2,
	isValidISODate,
} from "./.testable.mjs";

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

// isValidISODate — real calendar dates only
assert.ok(isValidISODate("2026-06-30"));
assert.ok(!isValidISODate("2026-99-40"), "impossible month/day rejected");
assert.ok(!isValidISODate("2026-02-30"), "Feb 30 rejected");
assert.ok(!isValidISODate("2026-6-3"), "non-zero-padded rejected");
assert.ok(!isValidISODate("not-a-date"));

// --- round2 is sign-aware and finite-safe ---
assert.equal(round2(1.005), 1.01);
assert.equal(round2(-1.005), -1.01, "negative half rounds symmetrically");
assert.equal(round2(NaN), 0, "NaN collapses to 0, never $NaN");
assert.equal(round2(Infinity), 0);

// --- Preview parity: summarizeEntries must equal what buildInvoice produces ---
// Sub-hour entries at a non-integer rate is exactly where round-once vs
// round-per-line used to diverge by a penny.
const pennyEntries = [
	{ clientId: null, clientName: "X", date: "2026-06-01", hours: 0.17, rate: null, description: "a", sourcePath: "p", line: 0 },
	{ clientId: null, clientName: "X", date: "2026-06-02", hours: 0.17, rate: null, description: "b", sourcePath: "p", line: 1 },
];
const pennyBiz = { ...business, defaultRate: 92.5, taxRate: 0 };
const totals = summarizeEntries(pennyEntries, 92.5, 0);
const pennyInv = buildInvoice(pennyEntries, null, pennyBiz, {
	number: "INV-P", issueDate: "2026-06-30", periodStart: "2026-06-01", periodEnd: "2026-06-30", dueInDays: 14, isPro: false,
});
assert.equal(totals.subtotal, pennyInv.subtotal, "preview subtotal equals invoice subtotal");
assert.equal(totals.subtotal, 31.46, "per-line rounding: 15.73 + 15.73");

// --- A NaN client rate must NOT produce a NaN invoice ---
const nanClient = { id: "n", name: "N", email: "", address: "", defaultRate: NaN, currency: null, taxRate: null };
const nanInv = buildInvoice(
	[{ clientId: "n", clientName: "N", date: "2026-06-01", hours: 2, rate: null, description: "x", sourcePath: "p", line: 0 }],
	nanClient,
	business,
	{ number: "INV-N", issueDate: "2026-06-30", periodStart: "2026-06-01", periodEnd: "2026-06-30", dueInDays: 14, isPro: false }
);
assert.ok(Number.isFinite(nanInv.total), "a NaN rate must not reach the invoice total");

// --- resolveRates gating ---
assert.equal(resolveRates(acme, business, false).currency, "USD", "free forces business currency");
assert.equal(resolveRates(acme, business, false).taxRate, 0, "free forces zero tax");
assert.equal(resolveRates(acme, business, true).currency, "EUR", "pro honors client currency");

console.log("invoice tests passed");
