import { MILESTONES } from "./milestones";
import type { Milestone, TimeSinceQuit } from "./types";

export const MS_PER_DAY = 86_400_000;

export function getElapsedMs(quitDate: Date, now: Date = new Date()): number {
  return Math.max(0, now.getTime() - quitDate.getTime());
}

/** Elapsed time as fractional days (updates every second). */
export function getElapsedFractionalDays(
  quitDate: Date,
  now: Date = new Date()
): number {
  return getElapsedMs(quitDate, now) / MS_PER_DAY;
}

/** dailyRate × fractional days — money, ml, grams, nicotine mg. */
export function scaleByElapsedDays(
  dailyRate: number,
  quitDate: Date,
  now: Date = new Date()
): number {
  return getElapsedFractionalDays(quitDate, now) * dailyRate;
}

/** floor(dailyUnits × fractional days) — whole cigarettes, bottles, packages. */
export function scaleByElapsedDaysFloored(
  dailyUnits: number,
  quitDate: Date,
  now: Date = new Date()
): number {
  return Math.floor(scaleByElapsedDays(dailyUnits, quitDate, now));
}

export function getElapsedDays(quitDate: Date, now: Date = new Date()): number {
  return getTimeSinceQuit(quitDate, now).days;
}

export function getTimeSinceQuit(
  quitDate: Date,
  now: Date = new Date()
): TimeSinceQuit {
  const totalMs = getElapsedMs(quitDate, now);
  const totalSeconds = Math.floor(totalMs / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, totalMs };
}

export function getMoneySaved(
  quitDate: Date,
  costPerDay: number,
  now: Date = new Date()
): number {
  return scaleByElapsedDays(costPerDay, quitDate, now);
}

export function getCigarettesAvoided(
  quitDate: Date,
  perDay: number,
  now: Date = new Date()
): number {
  return scaleByElapsedDaysFloored(perDay, quitDate, now);
}

export function getAchievedMilestones(
  quitDate: Date,
  now: Date = new Date()
): Milestone[] {
  const elapsedMs = getElapsedMs(quitDate, now);
  return MILESTONES.filter((m) => elapsedMs >= m.durationMs);
}

export function getNextMilestone(
  quitDate: Date,
  now: Date = new Date()
): Milestone | null {
  const elapsedMs = getElapsedMs(quitDate, now);
  return MILESTONES.find((m) => elapsedMs < m.durationMs) ?? null;
}

export function getLatestAchievedMilestone(
  quitDate: Date,
  now: Date = new Date()
): Milestone | null {
  const achieved = getAchievedMilestones(quitDate, now);
  return achieved.length > 0 ? achieved[achieved.length - 1] : null;
}

export function getMilestoneProgress(
  quitDate: Date,
  now: Date = new Date()
): number {
  const achieved = getAchievedMilestones(quitDate, now).length;
  return Math.round((achieved / MILESTONES.length) * 100);
}

/** @deprecated Use getMilestoneProgress */
export const getHealthProgress = getMilestoneProgress;

export function getTimeUntilMilestone(
  quitDate: Date,
  milestone: Milestone,
  now: Date = new Date()
): number {
  const targetTime = quitDate.getTime() + milestone.durationMs;
  return Math.max(0, targetTime - now.getTime());
}

export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat().format(Math.floor(n));
}

/** @deprecated Use perDay × costPerUnit via cigarettes module */
export function getCostPerDay(perDay: number, costPerUnit: number): number {
  return perDay * costPerUnit;
}
