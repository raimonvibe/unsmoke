import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatCurrency,
  getAchievedMilestones,
  getLatestAchievedMilestone,
  getMilestoneProgress,
  getMoneySaved,
  getNextMilestone,
} from "./calculations";
import { MILESTONES } from "./milestones";
import { getStatsPageData } from "./stats-page";
import {
  getBottlesAvoided,
  getConsumptionStats,
  getDailyCost,
  getMlAvoided,
  getTotalMoneySaved,
} from "./usage";
import { at, localDate, MS } from "../test/helpers";
import {
  CIGARETTES,
  quitData,
  QUIT,
  TOBACCO_MEDIUM,
  VAPING,
} from "../test/fixtures";

describe("stats page data matches underlying calculations", () => {
  const now = at(QUIT, 3 * MS.day + 5 * MS.hour);
  const cravings = [
    localDate(2024, 0, 1, 10).toISOString(),
    localDate(2024, 0, 3, 14).toISOString(),
    localDate(2024, 0, 3, 20).toISOString(),
  ];

  it("craving counts and streak use the same rules as the dashboard", () => {
    const data = quitData({ cigarettes: CIGARETTES });
    const page = getStatsPageData(data, cravings, now);

    assert.equal(page.totalCravingsLogged, 3);
    assert.equal(page.smokeFreeDays, 3);
    assert.equal(page.cravingsInChartWindow, 3);
    assert.equal(
      page.milestonesAchieved.length,
      getAchievedMilestones(QUIT, now).length
    );
  });

  it("chart window is at most total cravings logged", () => {
    const page = getStatsPageData(quitData({ vaping: VAPING }), cravings, now);
    assert.ok(page.cravingsInChartWindow <= page.totalCravingsLogged);
    assert.equal(page.last7DaysCravings.length, 7);
  });

  it("money saved equals daily cost × fractional days for mixed products", () => {
    const data = quitData({
      cigarettes: CIGARETTES,
      vaping: VAPING,
      tobacco: TOBACCO_MEDIUM,
    });
    const page = getStatsPageData(data, [], now);
    const expectedDaily = getDailyCost(data);

    assert.equal(page.dailyCost, expectedDaily);
    assert.equal(page.moneySaved, getTotalMoneySaved(data, QUIT, now));
    assert.equal(
      page.moneySaved,
      getMoneySaved(QUIT, expectedDaily, now)
    );
    assert.equal(
      formatCurrency(page.moneySaved),
      formatCurrency(getMoneySaved(QUIT, 10 + 3 + 1.2, now))
    );
  });

  it("consumption stats on stats page match dashboard formatter output", () => {
    const data = quitData({ cigarettes: CIGARETTES, vaping: VAPING });
    const page = getStatsPageData(data, [], now);
    const direct = getConsumptionStats(data, QUIT, now);

    assert.deepEqual(
      page.consumptionStats.map((s) => s.label),
      direct.map((s) => s.label)
    );
    assert.deepEqual(
      page.consumptionStats.map((s) => s.value),
      direct.map((s) => s.value)
    );
  });

  it("milestones on stats page match the shared unlock engine", () => {
    const data = quitData({ cigarettes: CIGARETTES });
    const page = getStatsPageData(data, [], now);
    const quitDate = new Date(data.quitDate);

    assert.ok(page.milestonesAchieved.length <= MILESTONES.length);
    assert.deepEqual(
      page.milestonesAchieved,
      getAchievedMilestones(quitDate, now)
    );
    assert.equal(
      getMilestoneProgress(quitDate, now),
      Math.round((page.milestonesAchieved.length / MILESTONES.length) * 100)
    );
    assert.equal(
      getLatestAchievedMilestone(quitDate, now)?.id,
      page.milestonesAchieved.at(-1)?.id ?? null
    );
    assert.equal(getNextMilestone(quitDate, now)?.id, "2w");
  });
});

describe("bottles and packages use floor of fractional units", () => {
  it("bottles avoided equals floor(ml avoided ÷ bottle size)", () => {
    const now = at(QUIT, 5 * MS.day);
    const ml = getMlAvoided(QUIT, VAPING, now);
    const bottles = getBottlesAvoided(QUIT, VAPING, now);
    assert.equal(bottles, Math.floor(ml / VAPING.bottleMl));
  });
});

describe("multi-product money saved at partial days", () => {
  it("sums each product line at 12 hours", () => {
    const data = quitData({
      cigarettes: { perDay: 20, costPerUnit: 0.5 },
      vaping: VAPING,
    });
    const now = at(QUIT, 12 * MS.hour);
    assert.equal(getTotalMoneySaved(data, QUIT, now), (10 + 3) * 0.5);
  });
});
