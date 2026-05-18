import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatCountdown,
  getAchievedMilestones,
  getCigarettesAvoided,
  getElapsedDays,
  getElapsedFractionalDays,
  getMilestoneProgress,
  getMoneySaved,
  getNextMilestone,
  getTimeSinceQuit,
  getTimeUntilMilestone,
  scaleByElapsedDays,
  scaleByElapsedDaysFloored,
} from "./calculations";
import { MILESTONES } from "./milestones";
import { at, MS } from "../test/helpers";
import { CIGARETTES, QUIT } from "../test/fixtures";

describe("elapsed time", () => {
  it("decomposes stopwatch duration into days through seconds", () => {
    const now = at(QUIT, 2 * MS.day + 3 * MS.hour + 4 * MS.minute + 5 * MS.second);
    assert.deepEqual(getTimeSinceQuit(QUIT, now), {
      days: 2,
      hours: 3,
      minutes: 4,
      seconds: 5,
      totalMs: 2 * MS.day + 3 * MS.hour + 4 * MS.minute + 5 * MS.second,
    });
  });

  it("clamps elapsed ms to zero before quit date", () => {
    assert.equal(getElapsedFractionalDays(QUIT, at(QUIT, -MS.hour)), 0);
    assert.deepEqual(getTimeSinceQuit(QUIT, at(QUIT, -MS.hour)), {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
    });
  });

  it("whole days match time-since-quit days field", () => {
    const now = at(QUIT, 25 * MS.hour);
    assert.equal(getElapsedDays(QUIT, now), 1);
    assert.equal(getElapsedDays(QUIT, now), getTimeSinceQuit(QUIT, now).days);
  });
});

describe("scaleByElapsedDays", () => {
  it("scales daily rates with fractional days", () => {
    assert.equal(scaleByElapsedDays(10, QUIT, at(QUIT, 12 * MS.hour)), 5);
    assert.equal(scaleByElapsedDays(10, QUIT, at(QUIT, MS.day)), 10);
  });

  it("floors whole-unit counts", () => {
    assert.equal(scaleByElapsedDaysFloored(20, QUIT, at(QUIT, MS.hour)), 0);
    assert.equal(scaleByElapsedDaysFloored(20, QUIT, at(QUIT, 12 * MS.hour)), 10);
  });
});

describe("cigarette savings", () => {
  const costPerDay = CIGARETTES.perDay * CIGARETTES.costPerUnit;

  it("money saved = cost per day × elapsed days", () => {
    assert.equal(getMoneySaved(QUIT, costPerDay, at(QUIT, 12 * MS.hour)), 5);
    assert.equal(getMoneySaved(QUIT, costPerDay, at(QUIT, MS.day)), 10);
  });

  it("cigarettes avoided uses floor", () => {
    assert.equal(getCigarettesAvoided(QUIT, CIGARETTES.perDay, at(QUIT, MS.hour)), 0);
    assert.equal(getCigarettesAvoided(QUIT, CIGARETTES.perDay, at(QUIT, MS.day)), 20);
  });
});

describe("milestones", () => {
  it("has 10 CDC-aligned milestones in ascending order", () => {
    assert.equal(MILESTONES.length, 10);
    for (let i = 1; i < MILESTONES.length; i++) {
      assert.ok(MILESTONES[i].durationMs > MILESTONES[i - 1].durationMs);
    }
  });

  it("unlocks at exact thresholds only", () => {
    assert.equal(getAchievedMilestones(QUIT, at(QUIT, 19 * MS.minute)).length, 0);
    assert.equal(getAchievedMilestones(QUIT, at(QUIT, 20 * MS.minute)).length, 1);
    assert.equal(getAchievedMilestones(QUIT, at(QUIT, 20 * 365 * MS.day)).length, 10);
  });

  it("finds next milestone or null when complete", () => {
    assert.equal(getNextMilestone(QUIT, QUIT)?.id, "20min");
    assert.equal(getNextMilestone(QUIT, at(QUIT, 20 * MS.minute))?.id, "24h");
    assert.equal(getNextMilestone(QUIT, at(QUIT, 20 * 365 * MS.day)), null);
  });

  it("countdown hits zero at milestone time", () => {
    const m = MILESTONES[0];
    assert.equal(getTimeUntilMilestone(QUIT, m, at(QUIT, m.durationMs)), 0);
    assert.equal(
      getTimeUntilMilestone(QUIT, m, at(QUIT, m.durationMs - MS.second)),
      1000
    );
  });

  it("milestone progress is percent completed", () => {
    assert.equal(getMilestoneProgress(QUIT, QUIT), 0);
    assert.equal(getMilestoneProgress(QUIT, at(QUIT, 20 * MS.minute)), 10);
    assert.equal(getMilestoneProgress(QUIT, at(QUIT, 20 * 365 * MS.day)), 100);
  });
});

describe("formatCountdown", () => {
  it("formats at appropriate granularity", () => {
    assert.equal(formatCountdown(45 * MS.second), "45s");
    assert.equal(formatCountdown(5 * MS.minute + 30 * MS.second), "5m 30s");
    assert.equal(formatCountdown(2 * MS.day + MS.hour), "2d 1h 0m");
  });

  it("never shows negative time", () => {
    assert.equal(formatCountdown(-1), "0s");
  });
});
