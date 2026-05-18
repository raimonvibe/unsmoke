import { CDC_BENEFITS_OVER_TIME } from "./health-sources";
import type { Milestone } from "./types";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const YEAR = 365 * DAY;

/**
 * Recovery milestones aligned with CDC’s published “Health benefits of quitting
 * smoking over time” table. Representative time points are chosen within ranges
 * CDC gives (e.g. “several days”, “1–12 months”) so the in-app countdown stays useful.
 *
 * @see https://www.cdc.gov/tobacco/about/benefits-of-quitting.html
 */
export const MILESTONES: Milestone[] = [
  {
    id: "20min",
    label: "20 minutes",
    benefit: "Heart rate drops",
    durationMs: 20 * MINUTE,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "Minutes (CDC)",
  },
  {
    id: "24h",
    label: "24 hours",
    benefit: "Nicotine level in the blood drops to zero",
    durationMs: 24 * HOUR,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "24 hours (CDC)",
  },
  {
    id: "3d",
    label: "A few days",
    benefit:
      "Carbon monoxide level in the blood drops toward that of someone who does not smoke",
    durationMs: 3 * DAY,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "Several days (CDC)",
  },
  {
    id: "3m",
    label: "3 months",
    benefit: "Coughing and shortness of breath decrease",
    durationMs: 90 * DAY,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "1 to 12 months (CDC)",
  },
  {
    id: "1y",
    label: "1 year",
    benefit: "Risk of heart attack drops sharply",
    durationMs: 1 * YEAR,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "1 to 2 years (CDC)",
  },
  {
    id: "3y",
    label: "3 years",
    benefit: "Added risk of coronary heart disease drops by half",
    durationMs: 3 * YEAR,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "3 to 6 years (CDC)",
  },
  {
    id: "5y",
    label: "5 years",
    benefit:
      "Added risk of mouth, throat, and voice box cancers drops by half; risk of stroke decreases",
    durationMs: 5 * YEAR,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "5 to 10 years (CDC)",
  },
  {
    id: "10y",
    label: "10 years",
    benefit:
      "Added risk of lung cancer drops by half; risk of bladder, esophagus, and kidney cancers decreases",
    durationMs: 10 * YEAR,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "10 years (CDC)",
  },
  {
    id: "15y",
    label: "15 years",
    benefit:
      "Risk of coronary heart disease drops to close to that of someone who does not smoke",
    durationMs: 15 * YEAR,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "15 years (CDC)",
  },
  {
    id: "20y",
    label: "20 years",
    benefit:
      "Risk of mouth, throat, and voice box cancers drops close to that of someone who does not smoke; pancreatic cancer risk also falls",
    durationMs: 20 * YEAR,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "20 years (CDC)",
  },
];

export const MILESTONE_SOURCE = CDC_BENEFITS_OVER_TIME;
