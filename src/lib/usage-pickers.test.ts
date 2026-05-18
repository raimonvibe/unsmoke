import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatPickerNumber,
  isAllowedDecimalInput,
  parseLocalizedNumber,
  presetSelectValue,
  roundToStep,
} from "./usage-pickers";

describe("usage pickers", () => {
  it("rounds to step precision", () => {
    assert.equal(roundToStep(0.57, 0.05), 0.55);
    assert.equal(roundToStep(12.4, 1), 12);
  });

  it("formats integers without decimals", () => {
    assert.equal(formatPickerNumber(20, 1), "20");
    assert.equal(formatPickerNumber(0.5, 0.5), "0.5");
  });

  it("parses comma decimals from European keyboards", () => {
    assert.equal(parseLocalizedNumber("12,5"), 12.5);
    assert.equal(parseLocalizedNumber("15"), 15);
    assert.equal(parseLocalizedNumber("12.5"), 12.5);
    assert.equal(parseLocalizedNumber("12,"), 12);
  });

  it("allows comma or period while typing", () => {
    assert.equal(isAllowedDecimalInput("12,5"), true);
    assert.equal(isAllowedDecimalInput("12.5"), true);
    assert.equal(isAllowedDecimalInput("abc"), false);
  });

  it("selects custom when value is not a preset", () => {
    assert.equal(
      presetSelectValue("12", [{ value: "10", label: "10" }]),
      "__custom__"
    );
    assert.equal(
      presetSelectValue("", [{ value: "", label: "Empty" }]),
      ""
    );
  });
});
