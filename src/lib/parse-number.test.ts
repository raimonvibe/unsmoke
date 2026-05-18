import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isAllowedDecimalInput,
  parseFormNumber,
  parseLocalizedNumber,
  parseOptionalFormNumber,
} from "./parse-number";

describe("parseLocalizedNumber", () => {
  it("parses comma and period decimals", () => {
    assert.equal(parseLocalizedNumber("12,5"), 12.5);
    assert.equal(parseLocalizedNumber("12.5"), 12.5);
    assert.equal(parseLocalizedNumber("15"), 15);
    assert.equal(parseLocalizedNumber("12,"), 12);
  });

  it("parses European thousands + decimal", () => {
    assert.equal(parseLocalizedNumber("1.234,56"), 1234.56);
  });

  it("returns null for invalid input", () => {
    assert.equal(parseLocalizedNumber(""), null);
    assert.equal(parseLocalizedNumber("abc"), null);
  });
});

describe("isAllowedDecimalInput", () => {
  it("allows comma or period while typing", () => {
    assert.equal(isAllowedDecimalInput("12,5"), true);
    assert.equal(isAllowedDecimalInput("12.5"), true);
    assert.equal(isAllowedDecimalInput("abc"), false);
  });
});

describe("parseFormNumber", () => {
  it("uses fallback when empty", () => {
    assert.equal(parseFormNumber("", 5), 5);
    assert.equal(parseFormNumber("12,5", 0), 12.5);
  });
});

describe("parseOptionalFormNumber", () => {
  it("returns undefined when blank", () => {
    assert.equal(parseOptionalFormNumber(""), undefined);
    assert.equal(parseOptionalFormNumber("14"), 14);
    assert.equal(parseOptionalFormNumber("14,5"), 14.5);
  });
});
