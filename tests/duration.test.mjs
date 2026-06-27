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

console.log("duration tests passed");
