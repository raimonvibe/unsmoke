import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getCigarettesAvoided } from "./calculations";
import { normalizeQuitData } from "./normalize-quit-data";
import {
  defaultQuitFormState,
  quitFormStateFromData,
  quitFormStateToData,
  type QuitFormState,
} from "./quit-data-form";
import { getStatsPageData } from "./stats-page";
import {
  getConsumptionStats,
  getDailyCost,
  getTotalMoneySaved,
} from "./usage";
import { getBottlesAvoided, getMlAvoided, getNicotineMgAvoided } from "./vaping";
import {
  getGramsAvoided,
  getNicotineMgAvoided as getTobaccoNicotineMgAvoided,
  getPackagesAvoided,
} from "./tobacco";
import type { QuitData } from "./types";
import { at, localDate, MS } from "../test/helpers";

/**
 * End-to-end tests for the onboarding form → stored QuitData → dashboard numbers.
 *
 * Every expected value below is worked out by hand from the form inputs, so a
 * regression in parsing, clamping, unit conversion or time scaling fails here.
 */

const DAY = MS.day;
const QUIT_LOCAL = localDate(2024, 0, 1, 8, 0);

/** Floating-point safe equality for money / ml / mg values. */
function assertClose(actual: number, expected: number, label: string): void {
  assert.ok(
    Math.abs(actual - expected) < 1e-9,
    `${label}: expected ${expected}, got ${actual}`
  );
}

/** Form state with every product off — tests switch on only what they need. */
function form(overrides: Partial<QuitFormState>): QuitFormState {
  return {
    ...defaultQuitFormState(QUIT_LOCAL),
    quitDate: "2024-01-01",
    quitTime: "08:00",
    usesCigarettes: false,
    usesVaping: false,
    usesTobacco: false,
    ...overrides,
  };
}

function submit(overrides: Partial<QuitFormState>): QuitData {
  const data = quitFormStateToData(form(overrides));
  assert.ok(data, "form should produce quit data");
  return data;
}

function statValue(data: QuitData, now: Date, label: string): string | undefined {
  return getConsumptionStats(data, new Date(data.quitDate), now).find(
    (s) => s.label === label
  )?.value;
}

describe("form → results: realistic user profiles (hand-calculated)", () => {
  interface Profile {
    name: string;
    input: Partial<QuitFormState>;
    elapsedDays: number;
    dailyCost: number;
    moneySaved: number;
    /** Dashboard tiles: label → displayed value */
    tiles: Record<string, string>;
  }

  const PROFILES: Profile[] = [
    {
      name: "pack-a-day smoker, EU comma decimal (20 × €0,50)",
      input: { usesCigarettes: true, cigarettesPerDay: "20", costPerCigarette: "0,50" },
      elapsedDays: 30,
      dailyCost: 10, // 20 × 0.50
      moneySaved: 300, // 10 × 30
      tiles: { "Cigarettes avoided": "600" }, // 20 × 30
    },
    {
      name: "light smoker after one week (5 × 0.60)",
      input: { usesCigarettes: true, cigarettesPerDay: "5", costPerCigarette: "0.60" },
      elapsedDays: 7,
      dailyCost: 3,
      moneySaved: 21,
      tiles: { "Cigarettes avoided": "35" },
    },
    {
      name: "vaper (2 ml/day, 20 mg/ml, 10 ml bottle at 15)",
      input: {
        usesVaping: true,
        mlPerDay: "2",
        nicotineMgPerMl: "20",
        bottleMl: "10",
        costPerBottle: "15",
      },
      elapsedDays: 30,
      dailyCost: 3, // 15 / 10 = 1.50 per ml × 2 ml
      moneySaved: 90,
      tiles: {
        "E-liquid avoided": "60 ml", // 2 × 30
        "Nicotine (vape)": "1.2 g", // 2 × 20 = 40 mg/day × 30 = 1200 mg
        "Bottles avoided": "6", // floor(60 / 10)
      },
    },
    {
      name: "rolling tobacco, medium blend, no pack label (5 g/day, 50 g at 12)",
      input: {
        usesTobacco: true,
        tobaccoVariant: "medium",
        gramsPerDay: "5",
        packageGrams: "50",
        costPerPackage: "12",
        packNicotineMgPerGram: "",
      },
      elapsedDays: 30,
      dailyCost: 1.2, // 12 / 50 = 0.24 per g × 5 g
      moneySaved: 36,
      tiles: {
        "Tobacco avoided": "150 g",
        "Nicotine (tobacco, est.)": "1.8 g", // 12 mg/g blend default × 5 g × 30
        "Packages avoided": "3",
      },
    },
    {
      name: "rolling tobacco, heavy blend with pack label 14 mg/g (label wins over 16 mg/g default)",
      input: {
        usesTobacco: true,
        tobaccoVariant: "heavy",
        gramsPerDay: "5",
        packageGrams: "50",
        costPerPackage: "12",
        packNicotineMgPerGram: "14",
      },
      elapsedDays: 30,
      dailyCost: 1.2,
      moneySaved: 36,
      tiles: {
        "Nicotine (tobacco, pack)": "2.1 g", // 14 × 5 × 30 = 2100 mg
      },
    },
    {
      name: "dual user: cigarettes + vape + rolling tobacco",
      input: {
        usesCigarettes: true,
        cigarettesPerDay: "20",
        costPerCigarette: "0.50",
        usesVaping: true,
        mlPerDay: "2",
        nicotineMgPerMl: "20",
        bottleMl: "10",
        costPerBottle: "15",
        usesTobacco: true,
        tobaccoVariant: "medium",
        gramsPerDay: "5",
        packageGrams: "50",
        costPerPackage: "12",
      },
      elapsedDays: 30,
      dailyCost: 14.2, // 10 + 3 + 1.2
      moneySaved: 426,
      tiles: {
        "Cigarettes avoided": "600",
        "E-liquid avoided": "60 ml",
        "Tobacco avoided": "150 g",
      },
    },
  ];

  for (const profile of PROFILES) {
    it(profile.name, () => {
      const data = submit(profile.input);
      const quitDate = new Date(data.quitDate);
      const now = at(quitDate, profile.elapsedDays * DAY);

      assertClose(getDailyCost(data), profile.dailyCost, "daily cost");
      assertClose(
        getTotalMoneySaved(data, quitDate, now),
        profile.moneySaved,
        "money saved"
      );
      for (const [label, expected] of Object.entries(profile.tiles)) {
        assert.equal(statValue(data, now, label), expected, `tile "${label}"`);
      }
    });
  }
});

describe("form → QuitData: parsing and safety limits", () => {
  it("stores the quit moment as the local date and time the user picked", () => {
    const data = submit({ usesCigarettes: true, quitDate: "2024-03-15", quitTime: "21:30" });
    assert.equal(data.quitDate, localDate(2024, 2, 15, 21, 30).toISOString());
  });

  it("accepts comma and dot decimals for prices", () => {
    const comma = submit({ usesCigarettes: true, costPerCigarette: "0,35" });
    const dot = submit({ usesCigarettes: true, costPerCigarette: "0.35" });
    assert.equal(comma.cigarettes?.costPerUnit, 0.35);
    assert.equal(dot.cigarettes?.costPerUnit, 0.35);
    assert.equal(
      submit({ usesTobacco: true, costPerPackage: "1.234,50" }).tobacco?.costPerPackage,
      1234.5
    );
  });

  it("rounds cigarettes per day to whole cigarettes", () => {
    assert.equal(submit({ usesCigarettes: true, cigarettesPerDay: "12.6" }).cigarettes?.perDay, 13);
    assert.equal(submit({ usesCigarettes: true, cigarettesPerDay: "12,4" }).cigarettes?.perDay, 12);
  });

  it("enforces minimum usage so the dashboard never shows zero-use quits", () => {
    const data = submit({
      usesCigarettes: true,
      cigarettesPerDay: "0",
      usesVaping: true,
      mlPerDay: "0",
      nicotineMgPerMl: "0",
      bottleMl: "0",
      usesTobacco: true,
      gramsPerDay: "0",
      packageGrams: "0",
    });
    assert.equal(data.cigarettes?.perDay, 1);
    assert.equal(data.vaping?.mlPerDay, 0.1);
    assert.equal(data.vaping?.nicotineMgPerMl, 0.1);
    assert.equal(data.vaping?.bottleMl, 1);
    assert.equal(data.tobacco?.gramsPerDay, 0.1);
    assert.equal(data.tobacco?.packageGrams, 1);
  });

  it("falls back safely on blank or invalid fields", () => {
    const data = submit({
      usesCigarettes: true,
      cigarettesPerDay: "",
      costPerCigarette: "abc",
      usesVaping: true,
      costPerBottle: "",
    });
    assert.equal(data.cigarettes?.perDay, 1);
    assert.equal(data.cigarettes?.costPerUnit, 0);
    assert.equal(data.vaping?.costPerBottle, 0);
  });

  it("never stores negative prices", () => {
    const data = submit({
      usesCigarettes: true,
      costPerCigarette: "-2",
      usesVaping: true,
      costPerBottle: "-5",
      usesTobacco: true,
      costPerPackage: "-1",
    });
    assert.equal(data.cigarettes?.costPerUnit, 0);
    assert.equal(data.vaping?.costPerBottle, 0);
    assert.equal(data.tobacco?.costPerPackage, 0);
    assert.equal(getDailyCost(data), 0);
  });

  it("only stores a pack-label nicotine value when one was entered", () => {
    assert.equal(
      submit({ usesTobacco: true, packNicotineMgPerGram: "" }).tobacco?.nicotineMgPerGram,
      undefined
    );
    assert.equal(
      submit({ usesTobacco: true, packNicotineMgPerGram: "0" }).tobacco?.nicotineMgPerGram,
      undefined
    );
    assert.equal(
      submit({ usesTobacco: true, packNicotineMgPerGram: "14,5" }).tobacco?.nicotineMgPerGram,
      14.5
    );
  });

  it("ignores fields of products that are not ticked", () => {
    const data = submit({
      usesCigarettes: true,
      usesVaping: false,
      mlPerDay: "99",
      usesTobacco: false,
      gramsPerDay: "99",
    });
    assert.equal(data.vaping, undefined);
    assert.equal(data.tobacco, undefined);
    assert.equal(data.productType, "cigarettes");
  });

  it("refuses to submit when no product is selected", () => {
    assert.equal(quitFormStateToData(form({})), null);
  });

  it("derives the product type from the ticked products", () => {
    assert.equal(submit({ usesVaping: true }).productType, "vaping");
    assert.equal(submit({ usesTobacco: true }).productType, "tobacco");
    assert.equal(submit({ usesCigarettes: true, usesVaping: true }).productType, "mixed");
  });
});

describe("form → results: time scaling", () => {
  const smoker = () =>
    submit({ usesCigarettes: true, cigarettesPerDay: "20", costPerCigarette: "0.50" });

  it("counts partial days: 12 hours = half a day of savings", () => {
    const data = smoker();
    const quitDate = new Date(data.quitDate);
    const now = at(quitDate, 12 * MS.hour);
    assertClose(getTotalMoneySaved(data, quitDate, now), 5, "money after 12 h");
    assert.equal(getCigarettesAvoided(quitDate, 20, now), 10);
  });

  it("only counts whole cigarettes, bottles and packages", () => {
    const data = submit({
      usesCigarettes: true,
      cigarettesPerDay: "20",
      usesVaping: true,
      mlPerDay: "2",
      bottleMl: "10",
      usesTobacco: true,
      gramsPerDay: "5",
      packageGrams: "50",
    });
    const quitDate = new Date(data.quitDate);
    const now = at(quitDate, 59 * MS.minute); // 20 × 59/1440 ≈ 0.82 cigarettes
    assert.equal(getCigarettesAvoided(quitDate, 20, now), 0);
    const later = at(quitDate, 4.9 * DAY); // 9.8 ml → 0 bottles; 24.5 g → 0 packages
    assert.equal(getBottlesAvoided(quitDate, data.vaping!, later), 0);
    assert.equal(getPackagesAvoided(quitDate, data.tobacco!, later), 0);
    const fiveDays = at(quitDate, 5 * DAY); // exactly 10 ml / 1 bottle
    assert.equal(getBottlesAvoided(quitDate, data.vaping!, fiveDays), 1);
  });

  it("shows nothing saved when the quit date is in the future", () => {
    const data = smoker();
    const quitDate = new Date(data.quitDate);
    const before = at(quitDate, -3 * DAY);
    assert.equal(getTotalMoneySaved(data, quitDate, before), 0);
    assert.equal(getCigarettesAvoided(quitDate, 20, before), 0);
  });

  it("never decreases as time passes", () => {
    const data = submit({ usesCigarettes: true, usesVaping: true, usesTobacco: true });
    const quitDate = new Date(data.quitDate);
    let prevMoney = -1;
    let prevMl = -1;
    let prevMg = -1;
    for (const hours of [0, 1, 6, 24, 72, 24 * 30, 24 * 365]) {
      const now = at(quitDate, hours * MS.hour);
      const money = getTotalMoneySaved(data, quitDate, now);
      const ml = getMlAvoided(quitDate, data.vaping!, now);
      const mg = getTobaccoNicotineMgAvoided(quitDate, data.tobacco!, now);
      assert.ok(money >= prevMoney && ml >= prevMl && mg >= prevMg, `at ${hours} h`);
      prevMoney = money;
      prevMl = ml;
      prevMg = mg;
    }
  });

  it("scales linearly with what the user entered", () => {
    const base = submit({ usesCigarettes: true, cigarettesPerDay: "10", costPerCigarette: "0.40" });
    const double = submit({ usesCigarettes: true, cigarettesPerDay: "20", costPerCigarette: "0.40" });
    const quitDate = new Date(base.quitDate);
    const now = at(quitDate, 45 * DAY);
    assertClose(
      getTotalMoneySaved(double, quitDate, now),
      2 * getTotalMoneySaved(base, quitDate, now),
      "double usage → double savings"
    );
  });
});

describe("form → storage → dashboard round trip", () => {
  const ALL_PRODUCTS: Partial<QuitFormState> = {
    usesCigarettes: true,
    cigarettesPerDay: "15",
    costPerCigarette: "0.42",
    usesVaping: true,
    mlPerDay: "3.5",
    nicotineMgPerMl: "12",
    bottleMl: "10",
    costPerBottle: "6.5",
    usesTobacco: true,
    tobaccoVariant: "light",
    gramsPerDay: "4",
    packageGrams: "30",
    costPerPackage: "9.95",
    packNicotineMgPerGram: "9",
  };

  it("survives saving to localStorage (JSON) and loading back", () => {
    const data = submit(ALL_PRODUCTS);
    const loaded = normalizeQuitData(JSON.parse(JSON.stringify(data)));
    assert.ok(loaded);
    assert.equal(loaded.quitDate, data.quitDate);
    assert.deepEqual(loaded.cigarettes, data.cigarettes);
    assert.deepEqual(loaded.vaping, data.vaping);
    assert.deepEqual(loaded.tobacco, data.tobacco);

    const quitDate = new Date(data.quitDate);
    const now = at(quitDate, 100 * DAY);
    assert.equal(
      getTotalMoneySaved(loaded, quitDate, now),
      getTotalMoneySaved(data, quitDate, now)
    );
    assert.deepEqual(
      getConsumptionStats(loaded, quitDate, now),
      getConsumptionStats(data, quitDate, now)
    );
  });

  it("re-opening the edit form and saving unchanged gives identical data", () => {
    const data = submit(ALL_PRODUCTS);
    assert.deepEqual(quitFormStateToData(quitFormStateFromData(data)), data);
  });

  it("dashboard and stats page show the same money and usage", () => {
    const data = submit(ALL_PRODUCTS);
    const quitDate = new Date(data.quitDate);
    const now = at(quitDate, 100 * DAY);
    const page = getStatsPageData(data, [], now);
    assert.equal(page.moneySaved, getTotalMoneySaved(data, quitDate, now));
    assert.equal(page.dailyCost, getDailyCost(data));
    assert.deepEqual(page.consumptionStats, getConsumptionStats(data, quitDate, now));
    assert.equal(page.smokeFreeDays, 100);
  });

  it("matches a hand calculation for the mixed profile after 100 days", () => {
    const data = submit(ALL_PRODUCTS);
    const quitDate = new Date(data.quitDate);
    const now = at(quitDate, 100 * DAY);
    // cigarettes 15 × 0.42 = 6.30; vape 3.5 × (6.5 / 10) = 2.275; tobacco 4 × (9.95 / 30) = 1.32666…
    const daily = 6.3 + 2.275 + (4 * 9.95) / 30;
    assertClose(getDailyCost(data), daily, "daily cost");
    assertClose(getTotalMoneySaved(data, quitDate, now), daily * 100, "money after 100 days");
    assertClose(getMlAvoided(quitDate, data.vaping!, now), 350, "ml");
    assertClose(getNicotineMgAvoided(quitDate, data.vaping!, now), 4200, "vape nicotine mg");
    assertClose(getGramsAvoided(quitDate, data.tobacco!, now), 400, "tobacco g");
    assertClose(
      getTobaccoNicotineMgAvoided(quitDate, data.tobacco!, now),
      3600, // label 9 mg/g overrides light-blend default 8 mg/g
      "tobacco nicotine mg"
    );
    assert.equal(getCigarettesAvoided(quitDate, 15, now), 1500);
    assert.equal(getBottlesAvoided(quitDate, data.vaping!, now), 35);
    assert.equal(getPackagesAvoided(quitDate, data.tobacco!, now), 13); // floor(400 / 30)
  });
});
