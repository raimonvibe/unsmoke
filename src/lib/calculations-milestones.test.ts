import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatCountdown,
  formatProgressPercent,
  getElapsedPercent,
  getAchievedMilestones,
  getLatestAchievedMilestone,
  getMilestoneProgress,
  getNextMilestone,
  getTimeUntilMilestone,
} from "./calculations";
import { MILESTONES } from "./milestones";
import { assertPercentProgress } from "../test/assertions";
import {
  EXPECTED_MILESTONE_COUNT,
  FINAL_MILESTONE_ID,
  FIRST_MILESTONE_ID,
  MILESTONES_AT_ONE_YEAR,
} from "../test/milestone-catalog";
import { at, MS } from "../test/helpers";
import { QUIT } from "../test/fixtures";

const DAY = MS.day;
const YEAR = 365 * DAY;

/**
 * Snapshot tests for the milestone unlock engine — mirrors how the dashboard
 * and stats page derive achieved / next / progress from quitDate + now.
 */
const JOURNEY_SNAPSHOTS = [
  {
    label: "quit moment",
    offsetMs: 0,
    achievedCount: 0,
    nextId: FIRST_MILESTONE_ID,
    progress: 0,
    latestId: null as string | null,
  },
  {
    label: "20 minutes",
    offsetMs: 20 * MS.minute,
    achievedCount: 1,
    nextId: "2h",
    progress: 2,
    latestId: "20min",
  },
  {
    label: "24 hours",
    offsetMs: 24 * MS.hour,
    achievedCount: 6,
    nextId: "48h",
    progress: 11,
    latestId: "24h-lungs",
  },
  {
    label: "3 months",
    offsetMs: 90 * DAY,
    achievedCount: 27,
    nextId: "4mo",
    progress: 48,
    latestId: "3mo",
  },
  {
    label: "1 year",
    offsetMs: 1 * YEAR,
    achievedCount: MILESTONES_AT_ONE_YEAR,
    nextId: "2y",
    progress: 63,
    latestId: "1y-lungs",
  },
  {
    label: "5 years",
    offsetMs: 5 * YEAR,
    achievedCount: 41,
    nextId: "6y-chd",
    progress: 73,
    latestId: "5y-lung-cancer",
  },
  {
    label: "20 years",
    offsetMs: 20 * YEAR,
    achievedCount: 53,
    nextId: "25y-cvd",
    progress: 95,
    latestId: "20y-eyes",
  },
  {
    label: "30 years (complete)",
    offsetMs: 30 * YEAR,
    achievedCount: EXPECTED_MILESTONE_COUNT,
    nextId: null,
    progress: 100,
    latestId: FINAL_MILESTONE_ID,
  },
] as const;

describe("milestone unlock engine", () => {
  it("unlocks each milestone only at or after its duration threshold", () => {
    for (const milestone of MILESTONES) {
      const before = at(QUIT, milestone.durationMs - 1);
      const atThreshold = at(QUIT, milestone.durationMs);

      assert.equal(
        getAchievedMilestones(QUIT, before).some((m) => m.id === milestone.id),
        false,
        `${milestone.id} should not unlock 1ms before threshold`
      );
      assert.ok(
        getAchievedMilestones(QUIT, atThreshold).some((m) => m.id === milestone.id),
        `${milestone.id} should unlock at threshold`
      );
    }
  });

  it("returns achieved milestones in catalog order", () => {
    const now = at(QUIT, 2 * YEAR);
    const achieved = getAchievedMilestones(QUIT, now);
    const catalogIndex = new Map(MILESTONES.map((m, i) => [m.id, i]));

    for (let i = 1; i < achieved.length; i++) {
      const prev = catalogIndex.get(achieved[i - 1].id)!;
      const curr = catalogIndex.get(achieved[i].id)!;
      assert.ok(curr > prev);
    }
  });

  it("matches journey snapshots for achieved count, next, latest, and progress", () => {
    for (const snapshot of JOURNEY_SNAPSHOTS) {
      const now = at(QUIT, snapshot.offsetMs);
      const achieved = getAchievedMilestones(QUIT, now);
      const next = getNextMilestone(QUIT, now);
      const latest = getLatestAchievedMilestone(QUIT, now);
      const progress = getMilestoneProgress(QUIT, now);

      assert.equal(
        achieved.length,
        snapshot.achievedCount,
        `${snapshot.label}: achieved count`
      );
      assert.equal(next?.id ?? null, snapshot.nextId, `${snapshot.label}: next`);
      assert.equal(
        latest?.id ?? null,
        snapshot.latestId,
        `${snapshot.label}: latest`
      );
      assertPercentProgress(
        achieved.length,
        EXPECTED_MILESTONE_COUNT,
        progress
      );
      assert.equal(progress, snapshot.progress, `${snapshot.label}: progress %`);
    }
  });

  it("returns null for latest and next when no milestones apply", () => {
    const beforeQuit = at(QUIT, -MS.hour);
    assert.equal(getLatestAchievedMilestone(QUIT, beforeQuit), null);
    assert.equal(getNextMilestone(QUIT, beforeQuit)?.id, FIRST_MILESTONE_ID);
  });

  it("returns null for next when all milestones are achieved", () => {
    const now = at(QUIT, 30 * YEAR);
    assert.equal(getNextMilestone(QUIT, now), null);
    assert.equal(getAchievedMilestones(QUIT, now).length, EXPECTED_MILESTONE_COUNT);
  });

  it("never reports more achieved milestones than exist in the catalog", () => {
    const now = at(QUIT, 100 * YEAR);
    assert.ok(getAchievedMilestones(QUIT, now).length <= MILESTONES.length);
  });
});

describe("milestone countdown", () => {
  it("reaches zero exactly when the milestone is due", () => {
    const first = MILESTONES[0];
    assert.equal(
      getTimeUntilMilestone(QUIT, first, at(QUIT, first.durationMs)),
      0
    );
    assert.equal(
      getTimeUntilMilestone(QUIT, first, at(QUIT, first.durationMs - MS.second)),
      1000
    );
  });

  it("counts down to the next milestone from the quit date", () => {
    const next = getNextMilestone(QUIT, QUIT)!;
    const remaining = getTimeUntilMilestone(QUIT, next, QUIT);
    assert.equal(remaining, next.durationMs);
  });

  it("formats countdown without negative values", () => {
    assert.equal(formatCountdown(-1), "0s");
    assert.equal(formatCountdown(45 * MS.second), "45s");
    assert.equal(formatCountdown(5 * MS.minute + 30 * MS.second), "5m 30s");
    assert.equal(formatCountdown(2 * DAY + MS.hour), "2d 1h 0m");
    assert.equal(formatCountdown(364 * DAY), "364d 0h 0m");
    assert.equal(formatCountdown(9 * YEAR + 4 * DAY), "9y 4d");
  });
});

describe("milestone progress formula", () => {
  it("uses round(achieved ÷ total × 100) at every unlock threshold", () => {
    const offsets = [0, ...new Set(MILESTONES.map((m) => m.durationMs))];
    for (const offset of offsets) {
      const achieved = MILESTONES.filter((m) => m.durationMs <= offset).length;
      const progress = getMilestoneProgress(QUIT, at(QUIT, offset));
      assertPercentProgress(achieved, EXPECTED_MILESTONE_COUNT, progress);
    }
  });
});

describe("per-milestone progress bars", () => {
  it("fills from 0% at quit to 100% at the milestone time and clamps", () => {
    const target = 14 * DAY;
    assert.equal(getElapsedPercent(QUIT, target, at(QUIT, -DAY)), 0);
    assert.equal(getElapsedPercent(QUIT, target, at(QUIT, 7 * DAY)), 50);
    assert.equal(getElapsedPercent(QUIT, target, at(QUIT, target)), 100);
    assert.equal(getElapsedPercent(QUIT, target, at(QUIT, 30 * DAY)), 100);
  });

  it("formats small percentages with one decimal and never rounds up to 100%", () => {
    assert.equal(formatProgressPercent(0), "0%");
    assert.equal(formatProgressPercent(0.27), "0.2%");
    assert.equal(formatProgressPercent(9.99), "9.9%");
    assert.equal(formatProgressPercent(42.7), "42%");
    assert.equal(formatProgressPercent(99.9), "99%");
    assert.equal(formatProgressPercent(100), "100%");
  });

  it("computes progress against a filtered (vaping-only) milestone list", () => {
    const vapingList = MILESTONES.filter((m) => m.appliesTo === "nicotine");
    const now = at(QUIT, 7 * DAY);
    const achieved = getAchievedMilestones(QUIT, now, vapingList);
    assert.ok(achieved.every((m) => m.appliesTo === "nicotine"));
    assert.equal(getNextMilestone(QUIT, now, vapingList)?.id, "2w-withdrawal");
    assert.equal(
      getMilestoneProgress(QUIT, now, vapingList),
      Math.round((achieved.length / vapingList.length) * 100)
    );
    assert.equal(getMilestoneProgress(QUIT, now, []), 0);
  });
});
