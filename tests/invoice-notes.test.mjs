import assert from "assert";
import {
	readInvoiceMeta,
	normalizeDate,
	isPaidStatus,
	classifyDue,
	summarizeOutstanding,
} from "./.testable.mjs";

// --- readInvoiceMeta: only invoice notes, defensively coerced ---
assert.equal(readInvoiceMeta(null), null, "no frontmatter -> null");
assert.equal(readInvoiceMeta(undefined), null, "undefined frontmatter -> null");
assert.equal(readInvoiceMeta({ title: "x" }), null, "non-invoice note (no invoice key) -> null");

const m = readInvoiceMeta({
	invoice: "INV-2026-0001",
	client: "Acme Corp",
	status: "unpaid",
	due: "2026-08-01",
	issued: "2026-07-18",
	total: 1234.5,
	currency: "usd",
});
assert.ok(m);
assert.equal(m.number, "INV-2026-0001");
assert.equal(m.client, "Acme Corp");
assert.equal(m.status, "unpaid");
assert.equal(m.due, "2026-08-01");
assert.equal(m.total, 1234.5);
assert.equal(m.currency, "USD", "currency upper-cased");

// Missing status defaults to unpaid; a numeric invoice number is stringified.
const m2 = readInvoiceMeta({ invoice: 42 });
assert.equal(m2.number, "42");
assert.equal(m2.status, "unpaid", "absent status defaults to unpaid");
assert.equal(m2.currency, "USD", "absent currency defaults to USD");
assert.equal(m2.due, "", "absent due -> empty");
assert.equal(m2.total, null, "absent total -> null");

// A hand-typed "Paid" is normalized to lowercase; a non-numeric total is dropped.
const m3 = readInvoiceMeta({ invoice: "X", status: "Paid", total: "lots" });
assert.equal(m3.status, "paid", "status lower-cased");
assert.equal(m3.total, null, "non-numeric total -> null");

// An impossible calendar date is rejected (treated as no due date).
assert.equal(readInvoiceMeta({ invoice: "X", due: "2026-02-30" }).due, "", "Feb 30 due rejected");

// --- normalizeDate: strings, Date objects, junk ---
assert.equal(normalizeDate("2026-07-01"), "2026-07-01");
assert.equal(normalizeDate("  2026-07-01  "), "2026-07-01", "trimmed");
assert.equal(normalizeDate("not a date"), "");
assert.equal(normalizeDate("2026-99-99"), "", "impossible date rejected");
assert.equal(normalizeDate(new Date(2026, 6, 1)), "2026-07-01", "Date object -> ISO (local)");
assert.equal(normalizeDate(12345), "", "number rejected");

// --- isPaidStatus ---
assert.ok(isPaidStatus("paid"));
assert.ok(isPaidStatus(" PAID "));
assert.ok(!isPaidStatus("unpaid"));
assert.ok(!isPaidStatus(undefined));

// --- classifyDue ---
const today = "2026-07-24";
const soon = "2026-07-27"; // today + 3
assert.equal(classifyDue("2026-07-20", today, soon), "overdue");
assert.equal(classifyDue("2026-07-24", today, soon), "due-soon", "due today is due-soon, not overdue");
assert.equal(classifyDue("2026-07-27", today, soon), "due-soon", "the soon horizon is inclusive");
assert.equal(classifyDue("2026-08-15", today, soon), "later");
assert.equal(classifyDue("", today, soon), "none", "no due date -> none");

// --- summarizeOutstanding ---
const metas = [
	readInvoiceMeta({ invoice: "A", status: "unpaid", due: "2026-07-10", total: 100, currency: "USD" }), // overdue
	readInvoiceMeta({ invoice: "B", status: "unpaid", due: "2026-07-26", total: 50, currency: "USD" }), // due soon
	readInvoiceMeta({ invoice: "C", status: "paid", due: "2026-07-01", total: 999, currency: "USD" }), // excluded
	readInvoiceMeta({ invoice: "D", status: "unpaid", due: "2026-09-01", total: 200, currency: "EUR" }), // later
	readInvoiceMeta({ invoice: "E", status: "unpaid", due: "", total: null, currency: "USD" }), // no due, no total
];
const sum = summarizeOutstanding(metas, today, soon);
assert.equal(sum.unpaidCount, 4, "paid invoice excluded from the unpaid count");
assert.equal(sum.overdue.length, 1);
assert.equal(sum.overdue[0].number, "A");
assert.equal(sum.dueSoon.length, 1);
assert.equal(sum.dueSoon[0].number, "B");
// Totals per currency exclude the paid invoice and the null-total one.
const usd = sum.byCurrency.find((c) => c.currency === "USD");
const eur = sum.byCurrency.find((c) => c.currency === "EUR");
assert.equal(usd.total, 150, "USD outstanding = 100 + 50 (paid 999 excluded)");
assert.equal(eur.total, 200);
// byCurrency is sorted by total descending.
assert.equal(sum.byCurrency[0].currency, "EUR", "largest outstanding currency first");

// All-paid -> nothing outstanding.
const allPaid = summarizeOutstanding(
	[readInvoiceMeta({ invoice: "P", status: "paid", total: 10, currency: "USD" })],
	today,
	soon
);
assert.equal(allPaid.unpaidCount, 0);
assert.equal(allPaid.byCurrency.length, 0);

console.log("invoice-notes tests passed");
