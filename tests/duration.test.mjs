import assert from "assert";
import { parseDuration, parseTimeRange } from "./.testable.mjs";

// Duration tokens
assert.equal(parseDuration("2.5h"), 2.5);
assert.equal(parseDuration("2h"), 2);
assert.equal(parseDuration("45m"), 0.75);
assert.equal(parseDuration("90m"), 1.5);
assert.equal(parseDuration("1h30m"), 1.5);
assert.equal(parseDuration("1h 30m"), 1.5);
assert.equal(parseDuration("3"), 3); // bare number = hours
assert.equal(parseDuration("0"), null);
assert.equal(parseDuration("hello"), null);
assert.equal(parseDuration(""), null);

// Time ranges
assert.equal(parseTimeRange("09:00-11:30"), 2.5);
assert.equal(parseTimeRange("09:00 - 11:30"), 2.5);
assert.equal(parseTimeRange("23:00-01:00"), 2); // crosses midnight
assert.equal(parseTimeRange("11:00-11:00"), null);
assert.equal(parseTimeRange("09:99-10:00"), null);
assert.equal(parseDuration("09:00-11:30"), 2.5); // parseDuration delegates to range

// Out-of-range hours in a time range are rejected (not silently coerced).
assert.equal(parseTimeRange("25:00-26:00"), null, "hours > 23 rejected");
assert.equal(parseTimeRange("24:00-24:30"), null);

// A malformed minutes component is rejected rather than normalized.
assert.equal(parseDuration("1h90m"), null, "1h90m is a typo, not 2.5h");
// Hours are returned at full precision (not pre-rounded) so money math stays exact.
assert.equal(parseDuration("2h59m"), 2 + 59 / 60, "2h59m keeps full precision, not 2.98");
assert.equal(parseDuration("1h1m"), 1 + 1 / 60, "1h1m is 61/60h, not 1.02h");
assert.equal(parseDuration("1m"), 1 / 60, "a bare minute is not rounded up to 0.02h");

// A field with trailing junk must NOT parse (anchored HM_RE).
assert.equal(parseDuration("2h typo"), null, "'2h typo' is not a valid duration");
assert.equal(parseDuration("2h "), 2, "trailing space is tolerated");
assert.equal(parseDuration("x2h"), null);

console.log("duration tests passed");
