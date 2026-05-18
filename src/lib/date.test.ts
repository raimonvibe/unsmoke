import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { localDateTimeToIso, toLocalDateString } from "./date";
import { localDate } from "../test/helpers";

describe("toLocalDateString", () => {
  it("formats using local calendar date, not UTC", () => {
    const d = localDate(2024, 5, 18, 23, 30);
    assert.equal(toLocalDateString(d), "2024-06-18");
  });

  it("pads single-digit months and days", () => {
    assert.equal(toLocalDateString(localDate(2024, 0, 5)), "2024-01-05");
  });
});

describe("localDateTimeToIso", () => {
  it("stores quit moment as UTC ISO while preserving local wall time", () => {
    const iso = localDateTimeToIso("2024-06-01", "14:30");
    const parsed = new Date(iso);
    assert.equal(parsed.getHours(), 14);
    assert.equal(parsed.getMinutes(), 30);
    assert.equal(parsed.getDate(), 1);
    assert.equal(parsed.getMonth(), 5);
  });
});
