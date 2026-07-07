import assert from "assert";
import { markLineBilled, unmarkLineBilled, lineMatchesEntry, parseBillableLine, contentLines } from "./.testable.mjs";

const ctx = { defaultDate: "2026-06-01", clientNames: { acme: "Acme Corp" } };

// Non-billable lines are ignored.
assert.equal(parseBillableLine("- just a normal note", ctx), null);
assert.equal(parseBillableLine("- #client/acme 2h no billable tag", ctx), null);

// Client tag + time range, slug resolves to configured name.
const a = parseBillableLine("- #billable #client/acme 09:00-11:30 Implemented auth flow", ctx);
assert.ok(a);
assert.equal(a.clientId, "acme");
assert.equal(a.clientName, "Acme Corp");
assert.equal(a.hours, 2.5);
assert.equal(a.date, "2026-06-01"); // falls back to context default
assert.equal(a.rate, null);
assert.equal(a.description, "Implemented auth flow");

// Inline fields: client name, explicit time, rate, date override.
const b = parseBillableLine("- #billable [client:: Beta LLC] [time:: 2.5h] [rate:: 90] [date:: 2026-06-25] Landing page", ctx);
assert.ok(b);
assert.equal(b.clientId, null);
assert.equal(b.clientName, "Beta LLC");
assert.equal(b.hours, 2.5);
assert.equal(b.rate, 90);
assert.equal(b.date, "2026-06-25");
assert.equal(b.description, "Landing page");

// Checkbox list item with duration token and inline ISO date.
const c = parseBillableLine("- [ ] #billable #client/acme 1h30m 2026-06-10 Reviewed PRs", ctx);
assert.ok(c);
assert.equal(c.hours, 1.5);
assert.equal(c.date, "2026-06-10");
assert.equal(c.description, "Reviewed PRs");

// Billable but no parseable duration → null.
assert.equal(parseBillableLine("- #billable #client/acme just talked", ctx), null);

// Unknown client slug keeps the raw slug as the name.
const d = parseBillableLine("- #billable #client/zeta 45m Quick fix", ctx);
assert.equal(d.clientName, "zeta");
assert.equal(d.hours, 0.75);

// Invoiced source lines are ignored so work cannot be billed twice.
assert.equal(parseBillableLine("- #billable #client/acme 1h Fix [invoice:: INV-2026-0001]", ctx), null);
assert.equal(
	markLineBilled("- #billable #client/acme 1h Fix", "INV-2026-0001"),
	"- #billable #client/acme 1h Fix [invoice:: INV-2026-0001]"
);
assert.equal(
	markLineBilled("- #billable #client/acme 1h Fix [invoice:: INV-2026-0001]", "INV-2026-0002"),
	"- #billable #client/acme 1h Fix [invoice:: INV-2026-0001]"
);

// --- Rollback: unmarkLineBilled reverses a mark exactly (round-trip) ---
const original = "- #billable #client/acme 1h Fix";
const marked = markLineBilled(original, "INV-2026-0001");
assert.equal(unmarkLineBilled(marked, "INV-2026-0001"), original, "unmark restores the original line");
// Unmark only removes the matching invoice number, not a different one.
assert.equal(unmarkLineBilled(marked, "INV-9999"), marked, "unmark leaves a different invoice's marker");

// --- A date embedded in prose must NOT hijack the entry date or the description ---
const prose = parseBillableLine("- #billable #client/acme 2h fixed bug 2026-01-15 regression", {
	defaultDate: "2026-06-01",
	clientNames: { acme: "Acme Corp" },
});
assert.ok(prose);
assert.equal(prose.date, "2026-06-01", "prose date does not override the note default");
assert.equal(prose.description, "fixed bug 2026-01-15 regression", "prose date stays in the description");
// A standalone date token IS still honored (existing behavior).
const standalone = parseBillableLine("- #billable #client/acme 1h30m 2026-06-10 Reviewed PRs", {
	defaultDate: "2026-06-01",
	clientNames: { acme: "Acme Corp" },
});
assert.equal(standalone.date, "2026-06-10");
assert.equal(standalone.description, "Reviewed PRs");

// A date immediately after the tags (before the description) is honored — the
// #billable tag must NOT be mistaken for a preceding prose word.
const leading = parseBillableLine("- #billable #client/acme 2026-06-25 Fixed login bug 2h", {
	defaultDate: "2026-06-01",
	clientNames: { acme: "Acme Corp" },
});
assert.equal(leading.date, "2026-06-25", "a leading standalone date after the tags is the entry date");
assert.equal(leading.hours, 2);
assert.equal(leading.description, "Fixed login bug");

// An invalid calendar date is ignored (falls back to the note default).
const badDate = parseBillableLine("- #billable #client/acme 2h Work [date:: 2026-99-40]", {
	defaultDate: "2026-06-01",
	clientNames: { acme: "Acme Corp" },
});
assert.equal(badDate.date, "2026-06-01", "an impossible date falls back to the default");
const badInline = parseBillableLine("- #billable #client/acme 2026-02-30 Work 1h", {
	defaultDate: "2026-06-01",
	clientNames: { acme: "Acme Corp" },
});
assert.equal(badInline.date, "2026-06-01", "Feb 30 is not consumed as a date");

// --- Drift guard: a line matches only if it's byte-identical to the scanned raw ---
const rawLine = "- #billable #client/acme 2.5h Auth";
assert.ok(lineMatchesEntry(rawLine, rawLine), "identical line matches");
assert.ok(lineMatchesEntry(rawLine + "   ", rawLine), "trailing whitespace is ignored");
assert.ok(!lineMatchesEntry("- #billable #client/acme 3h Auth", rawLine), "changed hours does not match");
assert.ok(!lineMatchesEntry("- #billable #client/beta 2.5h Auth", rawLine), "changed client does not match");
assert.ok(!lineMatchesEntry("- #billable #client/acme 2.5h Auth [rate:: 200]", rawLine), "added rate does not match");
assert.ok(!lineMatchesEntry(rawLine + " [invoice:: INV-1]", rawLine), "already-marked line does not match");

// --- contentLines: frontmatter + fenced-code exclusion, with true line indices ---
const texts = (c) => contentLines(c).map((l) => l.text);
const indices = (c) => contentLines(c).map((l) => l.index);

// Real frontmatter (opened AND closed) is excluded; body keeps original indices.
const fmDoc = "---\ndate: 2026-06-01\n---\n- #billable 1h A\n- plain";
assert.deepEqual(texts(fmDoc), ["- #billable 1h A", "- plain"]);
assert.deepEqual(indices(fmDoc), [3, 4], "line indices survive frontmatter stripping");

// A leading `---` with NO closing fence is NOT frontmatter — the billable line
// below must survive (regression: previously swallowed the rest of the file).
const unterminated = "---\n- #billable #client/acme 2h Fixed the parser";
assert.deepEqual(texts(unterminated), ["---", "- #billable #client/acme 2h Fixed the parser"]);

// A `#billable` line inside a ``` fence is excluded (documentation example).
const fenced = "before\n```\n- #billable 9h SHOULD NOT BILL\n```\n- #billable 1h real";
assert.deepEqual(texts(fenced), ["before", "- #billable 1h real"]);

// A `~~~` line inside a ``` block does NOT close it — the billable line between
// the two markers stays excluded (regression: single-bool toggle would leak it).
const mixedFence = "```\n~~~\n- #billable 9h STILL IN CODE\n```\n- #billable 1h out";
assert.deepEqual(texts(mixedFence), ["- #billable 1h out"]);

// A longer closing fence closes a shorter opener; a too-short run does not.
const lenFence = "````\n- #billable 9h IN CODE\n```\nstill code\n````\n- #billable 1h out";
assert.deepEqual(texts(lenFence), ["- #billable 1h out"]);

console.log("parser tests passed");
