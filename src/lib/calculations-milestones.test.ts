import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatCountdown,
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
    nextId: "12h",
    progress: 5,
    latestId: "20min",
  },
  {
    label: "24 hours",
    offsetMs: 24 * MS.hour,
    achievedCount: 3,
    nextId: "3d",
    progress: 14,
    latestId: "24h",
  },
  {
    label: "3 months",
    offsetMs: 90 * DAY,
    achievedCount: 8,
    nextId: "6mo",
    progress: 38,
    latestId: "3mo",
  },
  {
    label: "1 year",
    offsetMs: 1 * YEAR,
    achievedCount: 11,
    nextId: "2y",
    progress: 52,
    latestId: "1y",
  },
  {
    label: "5 years",
    offsetMs: 5 * YEAR,
    achievedCount: 14,
    nextId: "6y-chd",
    progress: 67,
    latestId: "5y-stroke",
  },
  {
    label: "20 years (complete)",
    offsetMs: 20 * YEAR,
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
    const now = at(QUIT, 20 * YEAR);
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
  });
});

describe("milestone progress formula", () => {
  it("uses round(achieved ÷ total × 100) for every achieved count", () => {
    for (let achieved = 0; achieved <= EXPECTED_MILESTONE_COUNT; achieved++) {
      const offset =
        achieved === 0
          ? 0
          : MILESTONES[achieved - 1].durationMs;
      const progress = getMilestoneProgress(QUIT, at(QUIT, offset));
      assertPercentProgress(achieved, EXPECTED_MILESTONE_COUNT, progress);
    }
  });
});
