import { scaleByElapsedDays, scaleByElapsedDaysFloored } from "./calculations";
import { formatGrams } from "./format-display";
import type { TobaccoUsage, TobaccoVariant } from "./types";

/**
 * Fallback nicotine (mg/g) by blend when pack label is not provided.
 * Approximate industry-style ranges for display only — enter mg/g from your
 * pouch label when available (see Sources & disclaimer in the app).
 */
export const VARIANT_NICOTINE_MG_PER_GRAM: Record<TobaccoVariant, number> = {
  light: 8,
  medium: 12,
  heavy: 16,
};

/** @deprecated Use VARIANT_NICOTINE_MG_PER_GRAM */
export const NICOTINE_MG_PER_GRAM = VARIANT_NICOTINE_MG_PER_GRAM;

export const TOBACCO_VARIANT_LABELS: Record<TobaccoVariant, string> = {
  light: "Light",
  medium: "Medium",
  heavy: "Heavy",
};

export function usesPackLabelNicotine(usage: TobaccoUsage): boolean {
  return (
    typeof usage.nicotineMgPerGram === "number" && usage.nicotineMgPerGram > 0
  );
}

export function getTobaccoNicotineMgPerGram(usage: TobaccoUsage): number {
  if (usesPackLabelNicotine(usage)) {
    return usage.nicotineMgPerGram!;
  }
  return VARIANT_NICOTINE_MG_PER_GRAM[usage.variant];
}

export function getTobaccoNicotineSourceLabel(usage: TobaccoUsage): string {
  return usesPackLabelNicotine(usage)
    ? "Nicotine (tobacco, pack)"
    : "Nicotine (tobacco, est.)";
}

export function getTobaccoCostPerGram(usage: TobaccoUsage): number {
  if (usage.packageGrams <= 0) return 0;
  return usage.costPerPackage / usage.packageGrams;
}

export function getTobaccoCostPerDay(usage: TobaccoUsage): number {
  return usage.gramsPerDay * getTobaccoCostPerGram(usage);
}

export function getTobaccoNicotineMgPerDay(usage: TobaccoUsage): number {
  return usage.gramsPerDay * getTobaccoNicotineMgPerGram(usage);
}

export function getNicotineMgPerPackage(usage: TobaccoUsage): number {
  return usage.packageGrams * getTobaccoNicotineMgPerGram(usage);
}

export function getGramsAvoided(
  quitDate: Date,
  usage: TobaccoUsage,
  now: Date = new Date()
): number {
  return scaleByElapsedDays(usage.gramsPerDay, quitDate, now);
}

export function getNicotineMgAvoided(
  quitDate: Date,
  usage: TobaccoUsage,
  now: Date = new Date()
): number {
  return scaleByElapsedDays(getTobaccoNicotineMgPerDay(usage), quitDate, now);
}

export function getPackagesAvoided(
  quitDate: Date,
  usage: TobaccoUsage,
  now: Date = new Date()
): number {
  if (usage.packageGrams <= 0) return 0;
  return scaleByElapsedDaysFloored(
    usage.gramsPerDay / usage.packageGrams,
    quitDate,
    now
  );
}

export { formatGrams };
