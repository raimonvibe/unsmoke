import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CDC_BENEFITS_OVER_TIME, WHO_CESSATION } from "./health-sources";
import {
  getMilestoneCategoryIcon,
  getMilestoneSourceShortName,
  getYearBandLabel,
  groupMilestonesByPhase,
  groupYearMilestonesByBand,
  MILESTONE_PHASE_ORDER,
  MILESTONES,
  YEAR_BAND_LABELS,
} from "./milestones";
import type { MilestoneCategory } from "./types";
import {
  assertStrictlyAscendingDurations,
  assertUniqueIds,
} from "../test/assertions";
import {
  EXPECTED_MILESTONE_COUNT,
  EXPECTED_PHASE_COUNTS,
  EXPECTED_YEAR_BAND_COUNTS,
  FINAL_MILESTONE_ID,
  FIRST_MILESTONE_ID,
  FIRST_WHO_MILESTONE_ID,
} from "../test/milestone-catalog";

const ALL_CATEGORIES: MilestoneCategory[] = ["heart", "blood", "lungs", "cancer"];

describe("milestone catalog", () => {
  it("defines the expected number of official milestones", () => {
    assert.equal(MILESTONES.length, EXPECTED_MILESTONE_COUNT);
  });

  it("uses unique ids and strictly ascending durations", () => {
    assertUniqueIds(MILESTONES, "MILESTONES");
    assertStrictlyAscendingDurations(MILESTONES);
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
    }
  });

  it("starts with heart-rate and ends with long-term cancer benefits", () => {
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

  it("partitions year milestones into three bands with expected counts", () => {
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
    assert.equal(getYearBandLabel(1 * YEAR), "First years");
    assert.equal(getYearBandLabel(3 * YEAR), "First years");
    assert.equal(getYearBandLabel(5 * YEAR), "Years 3–10");
    assert.equal(getYearBandLabel(10 * YEAR), "Years 3–10");
    assert.equal(getYearBandLabel(12 * YEAR), "10+ years");
    assert.equal(getYearBandLabel(20 * YEAR), "10+ years");
  });

  it("defines year band labels in display order", () => {
    assert.equal(YEAR_BAND_LABELS.length, 3);
    assert.deepEqual(
      YEAR_BAND_LABELS.map((b) => b.label),
      ["First years", "Years 3–10", "10+ years"]
    );
  });
});

describe("milestone presentation helpers", () => {
  it("maps source ids to CDC or WHO short names", () => {
    assert.equal(getMilestoneSourceShortName(CDC_BENEFITS_OVER_TIME.id), "CDC");
    assert.equal(getMilestoneSourceShortName(WHO_CESSATION.id), "WHO");
    assert.equal(getMilestoneSourceShortName("unknown"), "CDC");
  });

  it("returns a non-empty icon for each category", () => {
    for (const category of ALL_CATEGORIES) {
      assert.ok(getMilestoneCategoryIcon(category).length > 0, category);
    }
  });
});
