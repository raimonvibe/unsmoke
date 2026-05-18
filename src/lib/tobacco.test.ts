import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatGrams,
  getGramsAvoided,
  getNicotineMgAvoided,
  getNicotineMgPerPackage,
  getPackagesAvoided,
  getTobaccoNicotineMgPerGram,
  getTobaccoCostPerDay,
  getTobaccoCostPerGram,
  getTobaccoNicotineMgPerDay,
  getTobaccoNicotineSourceLabel,
  usesPackLabelNicotine,
  VARIANT_NICOTINE_MG_PER_GRAM,
} from "./tobacco";
import { at, MS } from "../test/helpers";
import { QUIT, TOBACCO_LABELED, TOBACCO_MEDIUM } from "../test/fixtures";

describe("tobacco daily rates", () => {
  it("cost per gram = package price ÷ package grams", () => {
    assert.equal(getTobaccoCostPerGram(TOBACCO_MEDIUM), 0.24);
  });

  it("daily cost = grams per day × cost per gram", () => {
    assert.equal(getTobaccoCostPerDay(TOBACCO_MEDIUM), 1.2);
  });

  it("uses pack label mg/g when provided", () => {
    assert.equal(getTobaccoNicotineMgPerGram(TOBACCO_LABELED), 14);
    assert.equal(getTobaccoNicotineMgPerDay(TOBACCO_LABELED), 70);
    assert.equal(getNicotineMgPerPackage(TOBACCO_LABELED), 700);
    assert.equal(usesPackLabelNicotine(TOBACCO_LABELED), true);
    assert.equal(
      getTobaccoNicotineSourceLabel(TOBACCO_LABELED),
      "Nicotine (tobacco, pack)"
    );
  });

  it("falls back to variant estimate without pack label", () => {
    assert.equal(
      getTobaccoNicotineMgPerGram(TOBACCO_MEDIUM),
      VARIANT_NICOTINE_MG_PER_GRAM.medium
    );
    assert.equal(getTobaccoNicotineMgPerDay(TOBACCO_MEDIUM), 60);
    assert.equal(usesPackLabelNicotine(TOBACCO_MEDIUM), false);
    assert.equal(
      getTobaccoNicotineSourceLabel(TOBACCO_MEDIUM),
      "Nicotine (tobacco, est.)"
    );
  });

  it("variant estimates differ by blend", () => {
    assert.equal(
      getTobaccoNicotineMgPerDay({ ...TOBACCO_MEDIUM, variant: "light" }),
      40
    );
    assert.equal(
      getTobaccoNicotineMgPerDay({ ...TOBACCO_MEDIUM, variant: "heavy" }),
      80
    );
  });
});

describe("tobacco avoided", () => {
  it("grams and nicotine scale with fractional days", () => {
    assert.equal(getGramsAvoided(QUIT, TOBACCO_MEDIUM, at(QUIT, 12 * MS.hour)), 2.5);
    assert.equal(
      getNicotineMgAvoided(QUIT, TOBACCO_MEDIUM, at(QUIT, 12 * MS.hour)),
      30
    );
    assert.equal(
      getNicotineMgAvoided(QUIT, TOBACCO_LABELED, at(QUIT, MS.day)),
      70
    );
  });

  it("packages avoided = floor(elapsed days × packages per day)", () => {
    // 5 g/day ÷ 50 g/package = 0.1 packages/day
    assert.equal(getPackagesAvoided(QUIT, TOBACCO_MEDIUM, at(QUIT, 9 * MS.day)), 0);
    assert.equal(getPackagesAvoided(QUIT, TOBACCO_MEDIUM, at(QUIT, 10 * MS.day)), 1);
  });
});

describe("formatGrams", () => {
  it("formats grams readably", () => {
    assert.equal(formatGrams(4.25), "4.3 g");
    assert.equal(formatGrams(42.5), "42.5 g");
    assert.equal(formatGrams(50), "50 g");
  });
});
