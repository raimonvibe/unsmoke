import type { MilestonePhase } from "@/lib/types";

/**
 * Expected milestone catalog shape — update when adding official milestones.
 * Keeps counts in one place so tests stay maintainable.
 */
export const EXPECTED_MILESTONE_COUNT = 21;

export const EXPECTED_PHASE_COUNTS: Record<MilestonePhase, number> = {
  hours: 4,
  weeks: 2,
  months: 4,
  years: 11,
};

export const EXPECTED_YEAR_BAND_COUNTS: Record<string, number> = {
  "First years": 3,
  "Years 3–10": 5,
  "10+ years": 3,
};

/** First milestone in the journey (smoke-free clock starts here). */
export const FIRST_MILESTONE_ID = "20min";

/** Representative early WHO milestone (carbon monoxide). */
export const FIRST_WHO_MILESTONE_ID = "12h";

/** Last milestone in the published long-term table. */
export const FINAL_MILESTONE_ID = "20y";

/** Milestone count after exactly one smoke-free year. */
export const MILESTONES_AT_ONE_YEAR = 11;
