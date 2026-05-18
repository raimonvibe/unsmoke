import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatGrams,
  formatMl,
  formatNicotineMg,
  formatUnitAmount,
  formatWholeUnits,
} from "./format-display";

describe("formatUnitAmount", () => {
  it("shows zero with unit", () => {
    assert.equal(formatUnitAmount(0, "ml"), "0 ml");
  });

  it("uses one decimal below threshold", () => {
    assert.equal(formatUnitAmount(4.25, "g"), "4.3 g");
  });

  it("rounds to whole number when within 0.05", () => {
    assert.equal(formatUnitAmount(42.02, "ml"), "42 ml");
    assert.equal(formatUnitAmount(42.48, "ml"), "42.5 ml");
  });
});

describe("formatNicotineMg", () => {
  it("formats small, large, and gram-scale amounts", () => {
    assert.equal(formatNicotineMg(0), "0 mg");
    assert.equal(formatNicotineMg(8.5), "8.5 mg");
    assert.equal(formatNicotineMg(850), "850 mg");
    assert.equal(formatNicotineMg(1500), "1.5 g");
  });
});

describe("formatWholeUnits", () => {
  it("floors and never shows negatives", () => {
    assert.equal(formatWholeUnits(0.9), "0");
    assert.equal(formatWholeUnits(-3), "0");
    assert.equal(formatWholeUnits(12), "12");
  });
});

describe("re-exports", () => {
  it("formatMl and formatGrams delegate to formatUnitAmount", () => {
    assert.equal(formatMl(1.25), "1.3 ml");
    assert.equal(formatGrams(42.5), "42.5 g");
    assert.equal(formatGrams(50), "50 g");
  });
});
