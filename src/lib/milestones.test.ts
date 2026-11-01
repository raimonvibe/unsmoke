import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CDC_BENEFITS_OVER_TIME,
  NHS_WALES_TIMELINE,
  WHO_CESSATION,
} from "./health-sources";
import {
  getMilestoneCategoryIcon,
  getMilestonesForQuitData,
  getMilestoneSourceShortName,
  getYearBandLabel,
  groupMilestonesByPhase,
  groupYearMilestonesByBand,
  MILESTONE_PHASE_ORDER,
  MILESTONES,
  RECOVERY_WINDOWS,
  usesSmokedTobacco,
  YEAR_BAND_LABELS,
} from "./milestones";
import type { MilestoneCategory } from "./types";
import {
  assertAscendingDurations,
  assertUniqueIds,
} from "../test/assertions";
import {
  EXPECTED_FIRST_THREE_WEEKS_COUNT,
  EXPECTED_MILESTONE_COUNT,
  EXPECTED_PHASE_COUNTS,
  EXPECTED_VAPING_ONLY_COUNT,
  EXPECTED_YEAR_BAND_COUNTS,
  FINAL_MILESTONE_ID,
  FIRST_MILESTONE_ID,
  FIRST_WHO_MILESTONE_ID,
} from "../test/milestone-catalog";

const ALL_CATEGORIES: MilestoneCategory[] = [
  "heart",
  "blood",
  "lungs",
  "cancer",
  "brain",
  "senses",
  "body",
];

describe("milestone catalog", () => {
  it("defines the expected number of official milestones", () => {
    assert.equal(MILESTONES.length, EXPECTED_MILESTONE_COUNT);
  });

  it("uses unique ids and ascending durations", () => {
    assertUniqueIds(MILESTONES, "MILESTONES");
    assertAscendingDurations(MILESTONES);
  });

  it("requires benefit text, published timeframe, phase, and category on every entry", () => {
    for (const m of MILESTONES) {
      assert.ok(m.benefit.length > 0, `${m.id}: empty benefit`);
      assert.ok(
        m.publishedTimeframe && m.publishedTimeframe.length > 0,
        `${m.id}: missing publishedTimeframe`
      );
      assert.ok(MILESTONE_PHASE_ORDER.includes(m.phase), `${m.id}: invalid phase`);
      assert.ok(ALL_CATEGORIES.includes(m.category), `${m.id}: invalid category`);
      assert.ok(
        m.appliesTo === "nicotine" || m.appliesTo === "smoke",
        `${m.id}: invalid appliesTo`
      );
    }
  });

  it("starts with heart-rate and ends with the 30-year milestone", () => {
    assert.equal(MILESTONES[0].id, FIRST_MILESTONE_ID);
    assert.equal(MILESTONES[MILESTONES.length - 1].id, FINAL_MILESTONE_ID);
  });

  it("includes both CDC and WHO early recovery milestones", () => {
    const whoEarly = MILESTONES.find((m) => m.id === FIRST_WHO_MILESTONE_ID);
    assert.ok(whoEarly);
    assert.equal(whoEarly?.sourceId, WHO_CESSATION.id);
    assert.ok(
      MILESTONES.some((m) => m.sourceId === CDC_BENEFITS_OVER_TIME.id && m.phase === "hours")
    );
  });
});

describe("milestone phases", () => {
  it("assigns every milestone to a known phase with expected counts", () => {
    const groups = groupMilestonesByPhase();
    let total = 0;

    for (const phase of MILESTONE_PHASE_ORDER) {
      const items = groups.get(phase) ?? [];
      assert.equal(
        items.length,
        EXPECTED_PHASE_COUNTS[phase],
        `phase "${phase}" count`
      );
      total += items.length;
      for (const m of items) {
        assert.equal(m.phase, phase);
      }
    }

    assert.equal(total, EXPECTED_MILESTONE_COUNT);
  });

  it("preserves catalog order within each phase group", () => {
    const groups = groupMilestonesByPhase();
    const catalogIndex = new Map(MILESTONES.map((m, i) => [m.id, i]));

    for (const phase of MILESTONE_PHASE_ORDER) {
      const items = groups.get(phase) ?? [];
      for (let i = 1; i < items.length; i++) {
        const prev = catalogIndex.get(items[i - 1].id)!;
        const curr = catalogIndex.get(items[i].id)!;
        assert.ok(curr > prev, `${phase}: ${items[i].id} should follow ${items[i - 1].id}`);
      }
    }
  });
});

describe("year bands (long-term UI grouping)", () => {
  const yearMilestones = MILESTONES.filter((m) => m.phase === "years");

  it("partitions year milestones into four bands with expected counts", () => {
    const bands = groupYearMilestonesByBand(yearMilestones);
    let total = 0;

    for (const [label, count] of Object.entries(EXPECTED_YEAR_BAND_COUNTS)) {
      const items = bands.get(label) ?? [];
      assert.equal(items.length, count, `band "${label}"`);
      total += items.length;
    }

    assert.equal(total, yearMilestones.length);
    assert.equal(yearMilestones.length, EXPECTED_PHASE_COUNTS.years);
  });

  it("maps durations to bands using ascending max thresholds", () => {
    const YEAR = 365 * 24 * 60 * 60 * 1000;
    assert.equal(getYearBandLabel(1 * YEAR), "Years 1–3");
    assert.equal(getYearBandLabel(3 * YEAR), "Years 1–3");
    assert.equal(getYearBandLabel(5 * YEAR), "Years 3–10");
    assert.equal(getYearBandLabel(10 * YEAR), "Years 3–10");
    assert.equal(getYearBandLabel(12 * YEAR), "Years 10–20");
    assert.equal(getYearBandLabel(20 * YEAR), "Years 10–20");
    assert.equal(getYearBandLabel(25 * YEAR), "20+ years");
    assert.equal(getYearBandLabel(30 * YEAR), "20+ years");
  });

  it("defines year band labels in display order", () => {
    assert.equal(YEAR_BAND_LABELS.length, 4);
    assert.deepEqual(
      YEAR_BAND_LABELS.map((b) => b.label),
      ["Years 1–3", "Years 3–10", "Years 10–20", "20+ years"]
    );
  });
});

describe("milestone presentation helpers", () => {
  it("maps source ids to CDC or WHO short names", () => {
    assert.equal(getMilestoneSourceShortName(CDC_BENEFITS_OVER_TIME.id), "CDC");
    assert.equal(getMilestoneSourceShortName(WHO_CESSATION.id), "WHO");
    assert.equal(getMilestoneSourceShortName(NHS_WALES_TIMELINE.id), "NHS");
    assert.equal(getMilestoneSourceShortName("unknown"), "CDC");
  });

  it("returns a non-empty icon for each category", () => {
    for (const category of ALL_CATEGORIES) {
      assert.ok(getMilestoneCategoryIcon(category).length > 0, category);
    }
  });
});

describe("early-recovery density", () => {
  const DAY = 24 * 60 * 60 * 1000;

  it("packs the first 3 weeks with motivating milestones", () => {
    const early = MILESTONES.filter((m) => m.durationMs <= 21 * DAY);
    assert.equal(early.length, EXPECTED_FIRST_THREE_WEEKS_COUNT);
  });

  it("defines recovery windows from 3 weeks to the full 30-year timeline", () => {
    assert.deepEqual(
      RECOVERY_WINDOWS.map((w) => w.id),
      ["3w", "3mo", "1y", "5y", "10y", "20y", "30y"]
    );
    assert.equal(
      RECOVERY_WINDOWS.at(-1)!.durationMs,
      MILESTONES.at(-1)!.durationMs,
      "last window covers the last milestone"
    );
    assertAscendingDurations(RECOVERY_WINDOWS);
  });
});

describe("product-specific milestones", () => {
  const VAPE = {
    mlPerDay: 3,
    nicotineMgPerMl: 12,
    bottleMl: 10,
    costPerBottle: 5,
  };
  const CIGS = { perDay: 10, costPerUnit: 0.5 };

  it("shows only nicotine-related milestones to vaping-only quitters", () => {
    const list = getMilestonesForQuitData({ vaping: VAPE });
    assert.equal(usesSmokedTobacco({ vaping: VAPE }), false);
    assert.equal(list.length, EXPECTED_VAPING_ONLY_COUNT);
    assert.ok(list.every((m) => m.appliesTo === "nicotine"));
    assert.ok(!list.some((m) => m.id === "12h"), "no carbon monoxide milestone");
  });

  it("shows every milestone when cigarettes or rolling tobacco were used", () => {
    assert.equal(
      getMilestonesForQuitData({ cigarettes: CIGS, vaping: VAPE }).length,
      EXPECTED_MILESTONE_COUNT
    );
    assert.equal(
      getMilestonesForQuitData({
        tobacco: {
          variant: "medium",
          gramsPerDay: 5,
          packageGrams: 50,
          costPerPackage: 20,
        },
      }).length,
      EXPECTED_MILESTONE_COUNT
    );
  });

  it("treats data without product sections as smoking (legacy default)", () => {
    assert.equal(getMilestonesForQuitData({}).length, EXPECTED_MILESTONE_COUNT);
  });
});
