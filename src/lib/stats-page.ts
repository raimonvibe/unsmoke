import { getAchievedMilestones } from "./calculations";
import {
  getConsumptionStats,
  getDailyCost,
  getTotalMoneySaved,
} from "./usage";
import {
  type DailyCravingCount,
  getLast7DaysCravings,
  getSmokeFreeStreakDays,
} from "./stats";
import type { Milestone, QuitData } from "./types";

/** Values shown on the Stats / results screen — single source for UI + tests. */
export interface StatsPageData {
  totalCravingsLogged: number;
  smokeFreeDays: number;
  last7DaysCravings: DailyCravingCount[];
  cravingsInChartWindow: number;
  milestonesAchieved: Milestone[];
  moneySaved: number;
  dailyCost: number;
  consumptionStats: ReturnType<typeof getConsumptionStats>;
}

export function getStatsPageData(
  quitData: QuitData,
  cravingTimestamps: string[],
  now: Date = new Date()
): StatsPageData {
  const quitDate = new Date(quitData.quitDate);
  const last7DaysCravings = getLast7DaysCravings(cravingTimestamps, now);

  return {
    totalCravingsLogged: cravingTimestamps.length,
    smokeFreeDays: getSmokeFreeStreakDays(quitDate, now),
    last7DaysCravings,
    cravingsInChartWindow: last7DaysCravings.reduce((sum, d) => sum + d.count, 0),
    milestonesAchieved: getAchievedMilestones(quitDate, now),
    moneySaved: getTotalMoneySaved(quitData, quitDate, now),
    dailyCost: getDailyCost(quitData),
    consumptionStats: getConsumptionStats(quitData, quitDate, now),
  };
}
