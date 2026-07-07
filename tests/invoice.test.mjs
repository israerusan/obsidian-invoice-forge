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
	renderInvoiceMarkdown,
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

// Cross-client guard: a second client that shares a display name but has a
// DIFFERENT slug (its own #client/<slug>) must NOT be billed onto this client.
// The name fallback applies only to unassigned (clientId === null) entries.
const twins = [
	{ clientId: "acme", clientName: "Acme Corp", date: "2026-06-05", hours: 2, rate: null, description: "mine", sourcePath: "x", line: 0 },
	{ clientId: "acme-uk", clientName: "Acme Corp", date: "2026-06-06", hours: 9, rate: null, description: "THEIRS", sourcePath: "x", line: 1 },
	{ clientId: null, clientName: "Acme Corp", date: "2026-06-07", hours: 1, rate: null, description: "unassigned-by-name", sourcePath: "x", line: 2 },
];
const mine = filterEntries(twins, acme, "Acme Corp", "2026-06-01", "2026-06-30");
assert.deepEqual(
	mine.map((e) => e.description),
	["mine", "unassigned-by-name"],
	"a same-name/different-slug client's work must not cross-bill"
);

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

// --- Zero-decimal currency (JPY): line amounts must sum to the subtotal/total
// at the currency's scale, so the printed line items add up to the printed total. ---
const jpyEntries = [
	{ clientId: null, clientName: "JP", date: "2026-06-01", hours: 0.5, rate: 201, description: "a", sourcePath: "p", line: 0 },
	{ clientId: null, clientName: "JP", date: "2026-06-02", hours: 0.5, rate: 201, description: "b", sourcePath: "p", line: 1 },
];
const jpy = summarizeEntries(jpyEntries, 201, 0, "JPY");
assert.equal(jpy.lines[0].amount, 101, "0.5h * ¥201 rounds to whole yen (¥101)");
assert.equal(jpy.subtotal, 202, "subtotal is the sum of the rounded line amounts (101+101)");
assert.equal(jpy.lines[0].amount + jpy.lines[1].amount, jpy.subtotal, "line items add up to the subtotal");
assert.equal(jpy.total, 202);

// --- A >2-decimal rate is rounded to the currency scale so rate*hours == amount. ---
const precise = summarizeEntries(
	[{ clientId: null, clientName: "X", date: "2026-06-01", hours: 2, rate: 40.255, description: "a", sourcePath: "p", line: 0 }],
	40.255,
	0,
	"USD"
);
assert.equal(precise.lines[0].rate, 40.26, "rate rounded to 2 decimals");
assert.equal(precise.lines[0].amount, 80.52, "amount computed from the rounded rate (40.26*2)");

// --- Frontmatter escaping: a client name with backslashes/quotes must not
// corrupt the YAML block (which would silently break Dataview status + reminders). ---
const nasty = buildInvoice(
	[{ clientId: null, clientName: 'A\\B "Co"', date: "2026-06-01", hours: 1, rate: null, description: "a\\|b", sourcePath: "p", line: 0 }],
	{ id: "x", name: 'A\\B "Co"', email: "", address: "", defaultRate: 50, currency: "USD", taxRate: 0 },
	business,
	{ number: 'INV-"1"', issueDate: "2026-06-01", periodStart: "2026-06-01", periodEnd: "2026-06-30", dueInDays: 14, isPro: false }
);
const md = renderInvoiceMarkdown(nasty, business);
const fm = md.slice(md.indexOf("---") + 3, md.indexOf("---", 3));
// Every double-quoted scalar must have balanced, properly escaped quotes: after
// removing escaped \" and \\, no bare " should remain inside a value (a bare "
// or a stray \ would corrupt the whole YAML block).
for (const key of ["invoice", "client", "currency"]) {
	const line = fm.split("\n").find((l) => l.startsWith(`${key}:`));
	assert.ok(line, `frontmatter has ${key}`);
	const val = line.slice(line.indexOf(":") + 1).trim();
	assert.ok(val.startsWith('"') && val.endsWith('"'), `${key} is a quoted scalar`);
	const inner = val.slice(1, -1).replace(/\\\\/g, "").replace(/\\"/g, "");
	assert.ok(!inner.includes('"') && !inner.includes("\\"), `${key} has no unescaped quote/backslash`);
}
// A backslash in a table cell must be escaped BEFORE the pipe, so an authored
// `\|` becomes `\\\|` (escaped backslash + escaped pipe) rather than `\\|`
// (escaped backslash + a live column separator).
const row = md.split("\n").find((l) => l.startsWith("| 2026-06-01 |"));
assert.ok(row.includes("a\\\\\\|b"), "backslash escaped before pipe in line-item cell");

console.log("invoice tests passed");
