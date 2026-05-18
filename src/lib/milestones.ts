import {
  CDC_BENEFITS_OVER_TIME,
  WHO_CESSATION,
} from "./health-sources";
import type { Milestone, MilestonePhase } from "./types";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const YEAR = 365 * DAY;

/**
 * Recovery milestones from CDC “Health benefits of quitting smoking over time”
 * and WHO “Health benefits of smoking cessation”. Representative times are chosen
 * within each published range so progress feels steady from the first hour through
 * decades.
 *
 * @see https://www.cdc.gov/tobacco/about/benefits-of-quitting.html
 * @see https://www.who.int/news-room/questions-and-answers/item/tobacco-health-benefits-of-smoking-cessation
 */
export const MILESTONES: Milestone[] = [
  // —— First hours & days ——
  {
    id: "20min",
    label: "20 minutes",
    benefit: "Heart rate drops",
    durationMs: 20 * MINUTE,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "Minutes (CDC)",
    phase: "hours",
    category: "heart",
  },
  {
    id: "12h",
    label: "12 hours",
    benefit: "Carbon monoxide level in the blood drops to normal",
    durationMs: 12 * HOUR,
    sourceId: WHO_CESSATION.id,
    publishedTimeframe: "12 hours (WHO)",
    phase: "hours",
    category: "blood",
  },
  {
    id: "24h",
    label: "24 hours",
    benefit: "Nicotine level in the blood drops to zero",
    durationMs: 24 * HOUR,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "24 hours (CDC)",
    phase: "hours",
    category: "blood",
  },
  {
    id: "3d",
    label: "A few days",
    benefit:
      "Carbon monoxide level in the blood drops toward that of someone who does not smoke",
    durationMs: 3 * DAY,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "Several days (CDC)",
    phase: "hours",
    category: "blood",
  },
  // —— First weeks ——
  {
    id: "2w",
    label: "2 weeks",
    benefit: "Circulation improves and lung function increases",
    durationMs: 14 * DAY,
    sourceId: WHO_CESSATION.id,
    publishedTimeframe: "2 to 12 weeks (WHO)",
    phase: "weeks",
    category: "lungs",
  },
  {
    id: "6w",
    label: "6 weeks",
    benefit: "Lung function continues to improve as your body heals",
    durationMs: 42 * DAY,
    sourceId: WHO_CESSATION.id,
    publishedTimeframe: "2 to 12 weeks (WHO)",
    phase: "weeks",
    category: "lungs",
  },
  // —— First months ——
  {
    id: "2mo",
    label: "2 months",
    benefit: "Coughing and shortness of breath often begin to ease",
    durationMs: 60 * DAY,
    sourceId: WHO_CESSATION.id,
    publishedTimeframe: "1 to 9 months (WHO)",
    phase: "months",
    category: "lungs",
  },
  {
    id: "3mo",
    label: "3 months",
    benefit: "Coughing and shortness of breath decrease",
    durationMs: 90 * DAY,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "1 to 12 months (CDC)",
    phase: "months",
    category: "lungs",
  },
  {
    id: "6mo",
    label: "6 months",
    benefit: "Coughing and shortness of breath continue to decrease",
    durationMs: 180 * DAY,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "1 to 12 months (CDC)",
    phase: "months",
    category: "lungs",
  },
  {
    id: "9mo",
    label: "9 months",
    benefit: "Coughing and shortness of breath decrease further",
    durationMs: 270 * DAY,
    sourceId: WHO_CESSATION.id,
    publishedTimeframe: "1 to 9 months (WHO)",
    phase: "months",
    category: "lungs",
  },
  // —— Years ahead ——
  {
    id: "1y",
    label: "1 year",
    benefit: "Risk of heart attack drops sharply",
    durationMs: 1 * YEAR,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "1 to 2 years (CDC)",
    phase: "years",
    category: "heart",
  },
  {
    id: "2y",
    label: "2 years",
    benefit: "Risk of heart attack drops sharply",
    durationMs: 2 * YEAR,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "1 to 2 years (CDC)",
    phase: "years",
    category: "heart",
  },
  {
    id: "3y",
    label: "3 years",
    benefit: "Added risk of coronary heart disease drops by half",
    durationMs: 3 * YEAR,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "3 to 6 years (CDC)",
    phase: "years",
    category: "heart",
  },
  {
    id: "5y-stroke",
    label: "5 years",
    benefit: "Stroke risk is reduced toward that of a non-smoker",
    durationMs: 5 * YEAR,
    sourceId: WHO_CESSATION.id,
    publishedTimeframe: "5 to 15 years after quitting (WHO)",
    phase: "years",
    category: "heart",
  },
  {
    id: "6y-chd",
    label: "6 years",
    benefit: "Added risk of coronary heart disease drops by half",
    durationMs: 6 * YEAR,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "3 to 6 years (CDC)",
    phase: "years",
    category: "heart",
  },
  {
    id: "7y-cancer",
    label: "7 years",
    benefit:
      "Added risk of cancers of the mouth, throat, and voice box drops by half",
    durationMs: 7 * YEAR,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "5 to 10 years (CDC)",
    phase: "years",
    category: "cancer",
  },
  {
    id: "8y-stroke",
    label: "8 years",
    benefit: "Risk of stroke decreases",
    durationMs: 8 * YEAR,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "5 to 10 years (CDC)",
    phase: "years",
    category: "heart",
  },
  {
    id: "10y",
    label: "10 years",
    benefit:
      "Added risk of lung cancer drops by half; risk of bladder, esophagus, and kidney cancers decreases",
    durationMs: 10 * YEAR,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "10 years (CDC)",
    phase: "years",
    category: "cancer",
  },
  {
    id: "12y-lung",
    label: "12 years",
    benefit: "Added risk of lung cancer drops by half",
    durationMs: 12 * YEAR,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "10 to 15 years (CDC)",
    phase: "years",
    category: "cancer",
  },
  {
    id: "15y",
    label: "15 years",
    benefit:
      "Risk of coronary heart disease drops to close to that of someone who does not smoke",
    durationMs: 15 * YEAR,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "15 years (CDC)",
    phase: "years",
    category: "heart",
  },
  {
    id: "20y",
    label: "20 years",
    benefit:
      "Risk of cancers of the mouth, throat, and voice box drops close to that of someone who does not smoke; pancreatic cancer risk falls and added risk of cervical cancer drops by about half",
    durationMs: 20 * YEAR,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "20 years (CDC)",
    phase: "years",
    category: "cancer",
  },
];

export const MILESTONE_SOURCE = CDC_BENEFITS_OVER_TIME;

export const MILESTONE_PHASE_ORDER: MilestonePhase[] = [
  "hours",
  "weeks",
  "months",
  "years",
];

export const MILESTONE_PHASE_LABELS: Record<MilestonePhase, string> = {
  hours: "First hours & days",
  weeks: "First weeks",
  months: "First months",
  years: "Years ahead",
};

/** Sub-groups within the years phase for a friendlier long-term timeline */
export const YEAR_BAND_LABELS: { maxMs: number; label: string }[] = [
  { maxMs: 3 * YEAR, label: "First years" },
  { maxMs: 10 * YEAR, label: "Years 3–10" },
  { maxMs: Infinity, label: "10+ years" },
];

const CATEGORY_ICONS: Record<Milestone["category"], string> = {
  heart: "❤️",
  blood: "🩸",
  lungs: "🫁",
  cancer: "🎗️",
};

export function getMilestoneCategoryIcon(category: Milestone["category"]): string {
  return CATEGORY_ICONS[category];
}

export function getMilestoneSourceShortName(sourceId: string): "CDC" | "WHO" {
  return sourceId === WHO_CESSATION.id ? "WHO" : "CDC";
}

export function groupMilestonesByPhase(): Map<MilestonePhase, Milestone[]> {
  const groups = new Map<MilestonePhase, Milestone[]>();
  for (const phase of MILESTONE_PHASE_ORDER) {
    groups.set(
      phase,
      MILESTONES.filter((m) => m.phase === phase)
    );
  }
  return groups;
}

export function getYearBandLabel(durationMs: number): string {
  for (const band of YEAR_BAND_LABELS) {
    if (durationMs <= band.maxMs) return band.label;
  }
  return YEAR_BAND_LABELS[YEAR_BAND_LABELS.length - 1].label;
}

export function groupYearMilestonesByBand(
  milestones: Milestone[]
): Map<string, Milestone[]> {
  const groups = new Map<string, Milestone[]>();
  for (const m of milestones) {
    const label = getYearBandLabel(m.durationMs);
    const list = groups.get(label) ?? [];
    list.push(m);
    groups.set(label, list);
  }
  return groups;
}
