import type { MilestonePhase } from "@/lib/types";

/**
 * Expected milestone catalog shape — update when adding official milestones.
 * Keeps counts in one place so tests stay maintainable.
 */
export const EXPECTED_MILESTONE_COUNT = 56;

export const EXPECTED_PHASE_COUNTS: Record<MilestonePhase, number> = {
  hours: 6,
  weeks: 10,
  months: 11,
  year: 8,
  years: 21,
};

export const EXPECTED_YEAR_BAND_COUNTS: Record<string, number> = {
  "Years 1–3": 3,
  "Years 3–10": 9,
  "Years 10–20": 6,
  "20+ years": 3,
};

/** First milestone in the journey (smoke-free clock starts here). */
export const FIRST_MILESTONE_ID = "20min";

/** Representative early WHO milestone (carbon monoxide). */
export const FIRST_WHO_MILESTONE_ID = "12h";

/** Last milestone in the published long-term table. */
export const FINAL_MILESTONE_ID = "30y-ra";

/** Milestone count after exactly one smoke-free year. */
export const MILESTONES_AT_ONE_YEAR = 35;

/** Milestones shown to someone who only vaped (nicotine-related, no smoke). */
export const EXPECTED_VAPING_ONLY_COUNT = 11;

/** Milestones reached in the first 3 weeks (motivation-dense early phase). */
export const EXPECTED_FIRST_THREE_WEEKS_COUNT = 16;
