import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { deriveProductType, normalizeQuitData } from "./normalize-quit-data";

describe("normalizeQuitData", () => {
  it("migrates legacy cigarette data", () => {
    const result = normalizeQuitData({
      quitDate: "2024-01-01T00:00:00.000Z",
      productType: "cigarettes",
      perDay: 20,
      costPerUnit: 0.5,
    });
    assert.deepEqual(result, {
      quitDate: "2024-01-01T00:00:00.000Z",
      productType: "cigarettes",
      cigarettes: { perDay: 20, costPerUnit: 0.5 },
    });
  });

  it("rejects legacy vaping data (puff-based) so user re-onboards", () => {
    assert.equal(
      normalizeQuitData({
        quitDate: "2024-01-01T00:00:00.000Z",
        productType: "vaping",
        perDay: 200,
        costPerUnit: 5,
      }),
      null
    );
  });

  it("accepts tobacco with variant and package grams", () => {
    const result = normalizeQuitData({
      quitDate: "2024-06-01T12:00:00.000Z",
      tobacco: {
        variant: "heavy",
        gramsPerDay: 5,
        packageGrams: 50,
        costPerPackage: 12,
      },
    });
    assert.equal(result?.tobacco?.variant, "heavy");
    assert.equal(result?.productType, "tobacco");
  });

  it("accepts optional nicotine mg per gram from pack label", () => {
    const result = normalizeQuitData({
      quitDate: "2024-06-01T12:00:00.000Z",
      tobacco: {
        variant: "medium",
        gramsPerDay: 5,
        packageGrams: 50,
        costPerPackage: 12,
        nicotineMgPerGram: 14,
      },
    });
    assert.equal(result?.tobacco?.nicotineMgPerGram, 14);
  });

  it("rejects invalid pack label nicotine", () => {
    assert.equal(
      normalizeQuitData({
        quitDate: "2024-06-01T12:00:00.000Z",
        tobacco: {
          variant: "medium",
          gramsPerDay: 5,
          packageGrams: 50,
          costPerPackage: 12,
          nicotineMgPerGram: 0,
        },
      }),
      null
    );
  });

  it("accepts multiple product sections as mixed", () => {
    const result = normalizeQuitData({
      quitDate: "2024-01-01T00:00:00.000Z",
      cigarettes: { perDay: 10, costPerUnit: 0.5 },
      tobacco: {
        variant: "light",
        gramsPerDay: 3,
        packageGrams: 30,
        costPerPackage: 8,
      },
    });
    assert.equal(result?.productType, "mixed");
    assert.ok(result?.cigarettes);
    assert.ok(result?.tobacco);
  });

  it("requires both legacy sections when product type is both", () => {
    assert.equal(
      normalizeQuitData({
        quitDate: "2024-01-01T00:00:00.000Z",
        productType: "both",
        cigarettes: { perDay: 10, costPerUnit: 0.5 },
      }),
      null
    );
  });

  it("rejects data with no valid product sections", () => {
    assert.equal(
      normalizeQuitData({
        quitDate: "2024-01-01T00:00:00.000Z",
      }),
      null
    );
  });
});

describe("deriveProductType", () => {
  it("returns single or mixed product type", () => {
    assert.equal(
      deriveProductType({ cigarettes: { perDay: 1, costPerUnit: 1 } }),
      "cigarettes"
    );
    assert.equal(
      deriveProductType({
        tobacco: {
          variant: "medium",
          gramsPerDay: 5,
          packageGrams: 50,
          costPerPackage: 10,
        },
      }),
      "tobacco"
    );
    assert.equal(
      deriveProductType({
        cigarettes: { perDay: 1, costPerUnit: 1 },
        vaping: {
          mlPerDay: 2,
          nicotineMgPerMl: 20,
          bottleMl: 10,
          costPerBottle: 15,
        },
      }),
      "mixed"
    );
  });
});
