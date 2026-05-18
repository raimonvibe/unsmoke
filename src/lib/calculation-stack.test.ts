import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getAchievedMilestones,
  getElapsedFractionalDays,
  scaleByElapsedDays,
} from "./calculations";
import { MILESTONES } from "./milestones";
import { getStatsPageData } from "./stats-page";
import { getDailyCost, getTotalMoneySaved } from "./usage";
import { at, MS } from "../test/helpers";
import { CIGARETTES, quitData, QUIT, VAPING } from "../test/fixtures";

/**
 * Integration tests across the calculation stack:
 *   quitDate + now → elapsed → usage scaling / milestones → stats page
 */
describe("calculation stack integration", () => {
  const now = at(QUIT, 45 * MS.day);

  it("feeds the same elapsed fractional days into money and milestone unlocks", () => {
    const data = quitData({ cigarettes: CIGARETTES, vaping: VAPING });
    const quitDate = new Date(data.quitDate);
    const fractionalDays = getElapsedFractionalDays(quitDate, now);
    const dailyCost = getDailyCost(data);

    assert.equal(getTotalMoneySaved(data, quitDate, now), dailyCost * fractionalDays);
    assert.equal(
      scaleByElapsedDays(dailyCost, quitDate, now),
      getTotalMoneySaved(data, quitDate, now)
    );

    const achieved = getAchievedMilestones(quitDate, now);
    const lastUnlocked = achieved[achieved.length - 1];
    assert.ok(lastUnlocked.durationMs <= fractionalDays * MS.day);
    if (achieved.length < MILESTONES.length) {
      const next = MILESTONES[achieved.length];
      assert.ok(next.durationMs > fractionalDays * MS.day);
    }
  });

  it("composes stats page from the same primitives as the dashboard", () => {
    const data = quitData({ cigarettes: CIGARETTES });
    const page = getStatsPageData(data, [], now);
    const quitDate = new Date(data.quitDate);

    assert.equal(
      page.smokeFreeDays,
      Math.floor(getElapsedFractionalDays(quitDate, now))
    );
    assert.equal(page.moneySaved, getTotalMoneySaved(data, quitDate, now));
    assert.equal(page.dailyCost, getDailyCost(data));
    assert.deepEqual(page.milestonesAchieved, getAchievedMilestones(quitDate, now));
  });
});
