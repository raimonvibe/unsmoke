import { formatNumber, getCigarettesAvoided, getMoneySaved } from "./calculations";
import { getCigaretteCostPerDay } from "./cigarettes";
import {
  formatGrams,
  getGramsAvoided,
  getNicotineMgAvoided as getTobaccoNicotineMgAvoided,
  getPackagesAvoided,
  getTobaccoCostPerDay,
  getTobaccoNicotineSourceLabel,
  usesPackLabelNicotine,
} from "./tobacco";
import {
  formatMl,
  getBottlesAvoided,
  getMlAvoided,
  getNicotineMgAvoided as getVapingNicotineMgAvoided,
  getVapingCostPerDay,
} from "./vaping";
import { formatNicotineMg, formatWholeUnits } from "./format-display";
import type { QuitData } from "./types";

export { formatNicotineMg } from "./format-display";

export function getDailyCost(quitData: QuitData): number {
  let total = 0;
  if (quitData.cigarettes) {
    total += getCigaretteCostPerDay(quitData.cigarettes);
  }
  if (quitData.vaping) {
    total += getVapingCostPerDay(quitData.vaping);
  }
  if (quitData.tobacco) {
    total += getTobaccoCostPerDay(quitData.tobacco);
  }
  return total;
}

export interface ConsumptionStat {
  label: string;
  value: string;
  icon: string;
  /** Shown under label when estimates apply */
  hint?: string;
}

export function getConsumptionStats(
  quitData: QuitData,
  quitDate: Date,
  now: Date = new Date()
): ConsumptionStat[] {
  const stats: ConsumptionStat[] = [];

  if (quitData.cigarettes) {
    const count = getCigarettesAvoided(
      quitDate,
      quitData.cigarettes.perDay,
      now
    );
    stats.push({
      label: "Cigarettes avoided",
      value: formatNumber(count),
      icon: "🚭",
    });
  }

  if (quitData.tobacco) {
    const t = quitData.tobacco;
    const grams = getGramsAvoided(quitDate, t, now);
    const packages = getPackagesAvoided(quitDate, t, now);

    stats.push({
      label: "Tobacco avoided",
      value: formatGrams(grams),
      icon: "🌿",
    });
    stats.push({
      label: getTobaccoNicotineSourceLabel(t),
      value: formatNicotineMg(getTobaccoNicotineMgAvoided(quitDate, t, now)),
      icon: "🧪",
      hint: tobaccoNicotineHint(t),
    });
    stats.push({
      label: "Packages avoided",
      value: formatWholeUnits(packages),
      icon: "📦",
    });
  }

  if (quitData.vaping) {
    const v = quitData.vaping;
    const ml = getMlAvoided(quitDate, v, now);
    const bottles = getBottlesAvoided(quitDate, v, now);

    stats.push({
      label: "E-liquid avoided",
      value: formatMl(ml),
      icon: "💧",
    });
    stats.push({
      label: "Nicotine (vape)",
      value: formatNicotineMg(getVapingNicotineMgAvoided(quitDate, v, now)),
      icon: "🧪",
      hint: "From strength on bottle",
    });
    stats.push({
      label: "Bottles avoided",
      value: formatWholeUnits(bottles),
      icon: "🧴",
    });
  }

  return stats;
}

function tobaccoNicotineHint(
  tobacco: NonNullable<QuitData["tobacco"]>
): string | undefined {
  return usesPackLabelNicotine(tobacco)
    ? "From pack label"
    : "Estimated from blend";
}

export function getTotalMoneySaved(
  quitData: QuitData,
  quitDate: Date,
  now: Date = new Date()
): number {
  return getMoneySaved(quitDate, getDailyCost(quitData), now);
}

export {
  getBottlesAvoided,
  getMlAvoided,
  getNicotineMgPerBottle,
  getVapingCostPerDay,
  getVapingCostPerMl,
  getVapingNicotineMgPerDay,
  formatMl,
} from "./vaping";

export {
  getGramsAvoided,
  getNicotineMgPerPackage,
  getPackagesAvoided as getTobaccoPackagesAvoided,
  getTobaccoCostPerGram,
  getTobaccoNicotineMgPerDay,
  usesPackLabelNicotine,
} from "./tobacco";

export const getNicotineMgAvoidedFromVaping = getVapingNicotineMgAvoided;
export const getNicotineMgAvoidedFromTobacco = getTobaccoNicotineMgAvoided;
