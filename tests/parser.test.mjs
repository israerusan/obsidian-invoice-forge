import assert from "assert";
import { parseBillableLine } from "./.testable.mjs";

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

console.log("parser tests passed");
