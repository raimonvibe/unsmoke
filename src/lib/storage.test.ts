import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
  installMockWindow,
  uninstallMockWindow,
} from "../test/mock-storage";
import {
  clearAllData,
  getCravingLog,
  getQuitData,
  logCraving,
  saveQuitData,
  STORAGE_KEYS,
} from "./storage";
import type { QuitData } from "./types";

const sampleCigaretteData: QuitData = {
  quitDate: "2024-06-01T12:00:00.000Z",
  productType: "cigarettes",
  cigarettes: { perDay: 20, costPerUnit: 0.5 },
};

const sampleVapingData: QuitData = {
  quitDate: "2024-06-01T12:00:00.000Z",
  productType: "vaping",
  vaping: {
    mlPerDay: 2,
    nicotineMgPerMl: 20,
    bottleMl: 10,
    costPerBottle: 15,
  },
};

const sampleTobaccoData: QuitData = {
  quitDate: "2024-06-01T12:00:00.000Z",
  productType: "tobacco",
  tobacco: {
    variant: "medium",
    gramsPerDay: 5,
    packageGrams: 50,
    costPerPackage: 12,
  },
};

describe("storage", () => {
  beforeEach(() => installMockWindow());
  afterEach(() => uninstallMockWindow());

  describe("quitData", () => {
    it("returns null when unset", () => {
      assert.equal(getQuitData(), null);
    });

    it("round-trips cigarette quit data", () => {
      saveQuitData(sampleCigaretteData);
      assert.deepEqual(getQuitData(), sampleCigaretteData);
    });

    it("round-trips vaping quit data with mg/ml fields", () => {
      saveQuitData(sampleVapingData);
      assert.deepEqual(getQuitData(), sampleVapingData);
    });

    it("round-trips tobacco quit data with variant and package grams", () => {
      saveQuitData(sampleTobaccoData);
      assert.deepEqual(getQuitData(), sampleTobaccoData);
    });

    it("round-trips tobacco with pack label nicotine mg/g", () => {
      const withLabel: QuitData = {
        ...sampleTobaccoData,
        tobacco: { ...sampleTobaccoData.tobacco!, nicotineMgPerGram: 14 },
      };
      saveQuitData(withLabel);
      assert.deepEqual(getQuitData(), withLabel);
    });

    it("migrates legacy cigarette JSON on read", () => {
      localStorage.setItem(
        STORAGE_KEYS.quitData,
        JSON.stringify({
          quitDate: "2024-06-01T12:00:00.000Z",
          productType: "cigarettes",
          perDay: 20,
          costPerUnit: 0.5,
        })
      );
      assert.deepEqual(getQuitData(), sampleCigaretteData);
    });

    it("returns null for legacy vaping JSON", () => {
      localStorage.setItem(
        STORAGE_KEYS.quitData,
        JSON.stringify({
          quitDate: "2024-06-01T12:00:00.000Z",
          productType: "vaping",
          perDay: 100,
          costPerUnit: 5,
        })
      );
      assert.equal(getQuitData(), null);
    });

    it("returns null for corrupt JSON", () => {
      localStorage.setItem(STORAGE_KEYS.quitData, "{not json");
      assert.equal(getQuitData(), null);
    });
  });

  describe("cravingLog", () => {
    it("starts empty", () => {
      assert.deepEqual(getCravingLog(), []);
    });

    it("appends ISO timestamps on each log", () => {
      const t0 = Date.now();
      const log = logCraving();
      assert.equal(log.length, 1);
      assert.ok(!Number.isNaN(Date.parse(log[0])));
      assert.ok(Date.parse(log[0]) >= t0);

      const log2 = logCraving();
      assert.equal(log2.length, 2);
      assert.deepEqual(getCravingLog(), log2);
    });

    it("returns empty array for non-array JSON", () => {
      localStorage.setItem(STORAGE_KEYS.cravingLog, '{"oops":1}');
      assert.deepEqual(getCravingLog(), []);
    });
  });

  describe("clearAllData", () => {
    it("removes quit data and craving log", () => {
      saveQuitData(sampleVapingData);
      logCraving();
      clearAllData();
      assert.equal(getQuitData(), null);
      assert.deepEqual(getCravingLog(), []);
    });
  });
});
