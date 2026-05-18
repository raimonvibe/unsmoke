import { scaleByElapsedDays, scaleByElapsedDaysFloored } from "./calculations";
import { formatMl } from "./format-display";
import type { VapingUsage } from "./types";

export function getVapingCostPerMl(usage: VapingUsage): number {
  if (usage.bottleMl <= 0) return 0;
  return usage.costPerBottle / usage.bottleMl;
}

export function getVapingCostPerDay(usage: VapingUsage): number {
  return usage.mlPerDay * getVapingCostPerMl(usage);
}

export function getVapingNicotineMgPerDay(usage: VapingUsage): number {
  return usage.mlPerDay * usage.nicotineMgPerMl;
}

export function getNicotineMgPerBottle(usage: VapingUsage): number {
  return usage.bottleMl * usage.nicotineMgPerMl;
}

export function getMlAvoided(
  quitDate: Date,
  usage: VapingUsage,
  now: Date = new Date()
): number {
  return scaleByElapsedDays(usage.mlPerDay, quitDate, now);
}

export function getNicotineMgAvoided(
  quitDate: Date,
  usage: VapingUsage,
  now: Date = new Date()
): number {
  return scaleByElapsedDays(getVapingNicotineMgPerDay(usage), quitDate, now);
}

export function getBottlesAvoided(
  quitDate: Date,
  usage: VapingUsage,
  now: Date = new Date()
): number {
  if (usage.bottleMl <= 0) return 0;
  return scaleByElapsedDaysFloored(
    usage.mlPerDay / usage.bottleMl,
    quitDate,
    now
  );
}

export { formatMl };
