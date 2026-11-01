import {
  ACS_OVER_TIME,
  ALA_BENEFITS,
  BENOWITZ_COTININE,
  CDC_BENEFITS_OVER_TIME,
  CHERUEL_2017_TASTE,
  CHO_2024_MORTALITY,
  DIETRICH_2015_TEETH,
  DUNCAN_2019_CVD,
  ELIASSON_1997_INSULIN,
  FIRST_WEEK_STUDY,
  GEPNER_2011_HDL,
  getHealthSource,
  HUGHES_2007_WITHDRAWAL,
  KHAN_2006_AMD,
  LIU_2019_RA,
  LUNG_HEALTH_STUDY,
  NHS_BETTER_HEALTH,
  NHS_WALES_TIMELINE,
  NIDA_RECEPTORS,
  PAN_2015_DIABETES,
  PERIODONTAL_2005,
  SMOKEFREE_WITHDRAWAL,
  TINDLE_2018_LUNG,
  WHO_CESSATION,
  WHO_SURGERY_2020,
} from "./health-sources";
import type { Milestone, MilestonePhase, QuitData } from "./types";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const YEAR = 365 * DAY;

/**
 * Recovery milestones from health agencies (CDC, WHO, NHS, ACS, ALA, NCI, NIDA)
 * and peer-reviewed studies. Each entry uses a representative time inside the
 * published range (shown as `publishedTimeframe`) so progress bars can fill.
 * Entries are sorted by duration; several can share one time when sources
 * name the same point (e.g. 1 year).
 *
 * `appliesTo: "smoke"` entries depend on burnt tobacco (carbon monoxide, tar)
 * and are hidden for people who only vaped.
 *
 * @see https://www.cdc.gov/tobacco/about/benefits-of-quitting.html
 * @see https://www.who.int/news-room/questions-and-answers/item/tobacco-health-benefits-of-smoking-cessation
 * @see https://111.wales.nhs.uk/LiveWell/QuitSmokingTimeline/
 */
export const MILESTONES: Milestone[] = [
  // —— First 24 hours ——
  {
    id: "20min",
    label: "20 minutes",
    benefit: "Heart rate and blood pressure drop as nicotine’s stimulant effect wears off",
    durationMs: 20 * MINUTE,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "Minutes (CDC); 20 minutes (NHS)",
    phase: "hours",
    category: "heart",
    appliesTo: "nicotine",
  },
  {
    id: "2h",
    label: "2 hours",
    benefit:
      "Nicotine in your blood has roughly halved. Early cravings are normal now and each one passes within minutes",
    durationMs: 2 * HOUR,
    sourceId: BENOWITZ_COTININE.id,
    publishedTimeframe: "Nicotine half-life ≈ 2 hours (study)",
    phase: "hours",
    category: "blood",
    appliesTo: "nicotine",
  },
  {
    id: "8h",
    label: "8 hours",
    benefit:
      "Carbon monoxide in your blood has halved, so more oxygen reaches your organs",
    durationMs: 8 * HOUR,
    sourceId: NHS_WALES_TIMELINE.id,
    publishedTimeframe: "8 hours (NHS)",
    phase: "hours",
    category: "blood",
    appliesTo: "smoke",
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
    appliesTo: "smoke",
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
    appliesTo: "nicotine",
  },
  {
    id: "24h-lungs",
    label: "24 hours",
    benefit: "Your lungs start to clear out mucus and smoke debris",
    durationMs: 24 * HOUR,
    sourceId: NHS_WALES_TIMELINE.id,
    publishedTimeframe: "24 hours (NHS)",
    phase: "hours",
    category: "lungs",
    appliesTo: "smoke",
  },
  // —— First 3 weeks ——
  {
    id: "48h",
    label: "48 hours",
    benefit:
      "Taste and smell start to improve as damaged nerve endings begin to regrow",
    durationMs: 48 * HOUR,
    sourceId: NHS_WALES_TIMELINE.id,
    publishedTimeframe: "48 hours (NHS)",
    phase: "weeks",
    category: "senses",
    appliesTo: "smoke",
  },
  {
    id: "72h",
    label: "3 days",
    benefit: "Breathing feels easier and energy levels rise",
    durationMs: 72 * HOUR,
    sourceId: NHS_WALES_TIMELINE.id,
    publishedTimeframe: "72 hours (NHS)",
    phase: "weeks",
    category: "lungs",
    appliesTo: "smoke",
  },
  {
    id: "3d-cotinine",
    label: "3 days",
    benefit:
      "Cotinine, the main breakdown product of nicotine, has largely cleared from your body",
    durationMs: 72 * HOUR,
    sourceId: BENOWITZ_COTININE.id,
    publishedTimeframe: "Cotinine half-life ≈ 16 hours; ~3 days to clear (study)",
    phase: "weeks",
    category: "blood",
    appliesTo: "nicotine",
  },
  {
    id: "3d-peak",
    label: "3 days",
    benefit:
      "Withdrawal is usually at its strongest around now. From here it starts to ease",
    durationMs: 72 * HOUR,
    sourceId: SMOKEFREE_WITHDRAWAL.id,
    publishedTimeframe: "First few days (NCI)",
    phase: "weeks",
    category: "brain",
    appliesTo: "nicotine",
  },
  {
    id: "4d",
    label: "4 days",
    benefit:
      "Carbon monoxide level in the blood drops toward that of someone who does not smoke",
    durationMs: 4 * DAY,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "Several days (CDC)",
    phase: "weeks",
    category: "blood",
    appliesTo: "smoke",
  },
  {
    id: "1w",
    label: "1 week",
    benefit:
      "You made it through the highest-risk week. Getting through week one without a lapse strongly predicts still being quit at 6 months",
    durationMs: 7 * DAY,
    sourceId: FIRST_WEEK_STUDY.id,
    publishedTimeframe: "First 7 days (study)",
    phase: "weeks",
    category: "brain",
    appliesTo: "nicotine",
  },
  {
    id: "2w-withdrawal",
    label: "2 weeks",
    benefit:
      "The worst withdrawal symptoms are usually behind you. They typically last a few days to a couple of weeks",
    durationMs: 14 * DAY,
    sourceId: SMOKEFREE_WITHDRAWAL.id,
    publishedTimeframe: "A few days to a couple of weeks (NCI)",
    phase: "weeks",
    category: "brain",
    appliesTo: "nicotine",
  },
  {
    id: "2w-taste",
    label: "2 weeks",
    benefit:
      "Taste sensitivity on the tip and edges of your tongue has measurably recovered",
    durationMs: 14 * DAY,
    sourceId: CHERUEL_2017_TASTE.id,
    publishedTimeframe: "2 weeks (study)",
    phase: "weeks",
    category: "senses",
    appliesTo: "smoke",
  },
  {
    id: "2w",
    label: "2 weeks",
    benefit: "Circulation improves and lung function increases",
    durationMs: 14 * DAY,
    sourceId: WHO_CESSATION.id,
    publishedTimeframe: "2 to 12 weeks (WHO)",
    phase: "weeks",
    category: "lungs",
    appliesTo: "smoke",
  },
  {
    id: "3w",
    label: "3 weeks",
    benefit:
      "Most withdrawal symptoms (irritability, restlessness, poor concentration, sleep trouble) have usually faded",
    durationMs: 21 * DAY,
    sourceId: HUGHES_2007_WITHDRAWAL.id,
    publishedTimeframe: "2 to 4 weeks (study)",
    phase: "weeks",
    category: "brain",
    appliesTo: "nicotine",
  },
  // —— First 3 months ——
  {
    id: "4w-surgery",
    label: "4 weeks",
    benefit:
      "Wound healing has improved: quitting for 4+ weeks lowers the risk of complications after surgery",
    durationMs: 28 * DAY,
    sourceId: WHO_SURGERY_2020.id,
    publishedTimeframe: "4 weeks or more (WHO)",
    phase: "months",
    category: "body",
    appliesTo: "smoke",
  },
  {
    id: "1mo-cilia",
    label: "1 month",
    benefit:
      "Cilia, the tiny hairs that sweep mucus out of your lungs, start to work normally again, lowering infection risk",
    durationMs: 30 * DAY,
    sourceId: ACS_OVER_TIME.id,
    publishedTimeframe: "1 to 12 months (ACS)",
    phase: "months",
    category: "lungs",
    appliesTo: "smoke",
  },
  {
    id: "1mo-heart",
    label: "1 month",
    benefit: "Heart attack risk starts to fall",
    durationMs: 30 * DAY,
    sourceId: ALA_BENEFITS.id,
    publishedTimeframe: "2 weeks to 3 months (ALA)",
    phase: "months",
    category: "heart",
    appliesTo: "smoke",
  },
  {
    id: "6w",
    label: "6 weeks",
    benefit: "Lung function continues to improve as your body heals",
    durationMs: 42 * DAY,
    sourceId: WHO_CESSATION.id,
    publishedTimeframe: "2 to 12 weeks (WHO)",
    phase: "months",
    category: "lungs",
    appliesTo: "smoke",
  },
  {
    id: "6w-mood",
    label: "6 weeks",
    benefit:
      "Anxiety, depression, and stress tend to be lower than while smoking — an effect as large as antidepressant treatment",
    durationMs: 42 * DAY,
    sourceId: NHS_BETTER_HEALTH.id,
    publishedTimeframe: "As little as 6 weeks (NHS; BMJ meta-analysis)",
    phase: "months",
    category: "brain",
    appliesTo: "smoke",
  },
  {
    id: "6w-receptors",
    label: "6 weeks",
    benefit:
      "The extra nicotine receptors your brain grew start returning to normal levels, so cravings lose their pull",
    durationMs: 42 * DAY,
    sourceId: NIDA_RECEPTORS.id,
    publishedTimeframe: "Elevated up to ~6 weeks (NIDA)",
    phase: "months",
    category: "brain",
    appliesTo: "nicotine",
  },
  {
    id: "8w-insulin",
    label: "8 weeks",
    benefit:
      "Insulin sensitivity improves, helping your body manage blood sugar",
    durationMs: 56 * DAY,
    sourceId: ELIASSON_1997_INSULIN.id,
    publishedTimeframe: "8 weeks (study)",
    phase: "months",
    category: "body",
    appliesTo: "nicotine",
  },
  {
    id: "2mo",
    label: "2 months",
    benefit: "Coughing and shortness of breath often begin to ease",
    durationMs: 60 * DAY,
    sourceId: WHO_CESSATION.id,
    publishedTimeframe: "1 to 9 months (WHO)",
    phase: "months",
    category: "lungs",
    appliesTo: "smoke",
  },
  {
    id: "9w-taste",
    label: "9 weeks",
    benefit:
      "Taste sensitivity at the back of your tongue has returned to the range of people who don’t smoke",
    durationMs: 63 * DAY,
    sourceId: CHERUEL_2017_TASTE.id,
    publishedTimeframe: "9 weeks (study)",
    phase: "months",
    category: "senses",
    appliesTo: "smoke",
  },
  {
    id: "12w-receptors",
    label: "12 weeks",
    benefit:
      "Brain nicotine receptors typically match those of people who don’t smoke",
    durationMs: 84 * DAY,
    sourceId: NIDA_RECEPTORS.id,
    publishedTimeframe: "6 to 12 weeks (NIDA)",
    phase: "months",
    category: "brain",
    appliesTo: "nicotine",
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
    appliesTo: "smoke",
  },
  // —— Rest of year one ——
  {
    id: "4mo",
    label: "4 months",
    benefit:
      "Less coughing, sinus congestion, and tiredness; you are less likely to get a chest infection",
    durationMs: 120 * DAY,
    sourceId: NHS_WALES_TIMELINE.id,
    publishedTimeframe: "3 to 9 months (NHS)",
    phase: "year",
    category: "lungs",
    appliesTo: "smoke",
  },
  {
    id: "6mo",
    label: "6 months",
    benefit: "Coughing and shortness of breath continue to decrease",
    durationMs: 180 * DAY,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "1 to 12 months (CDC)",
    phase: "year",
    category: "lungs",
    appliesTo: "smoke",
  },
  {
    id: "9mo",
    label: "9 months",
    benefit: "Coughing and shortness of breath decrease further",
    durationMs: 270 * DAY,
    sourceId: WHO_CESSATION.id,
    publishedTimeframe: "1 to 9 months (WHO)",
    phase: "year",
    category: "lungs",
    appliesTo: "smoke",
  },
  {
    id: "9mo-lungs",
    label: "9 months",
    benefit: "Lung function has improved by up to 10%",
    durationMs: 270 * DAY,
    sourceId: NHS_WALES_TIMELINE.id,
    publishedTimeframe: "3 to 9 months (NHS)",
    phase: "year",
    category: "lungs",
    appliesTo: "smoke",
  },
  {
    id: "1y",
    label: "1 year",
    benefit: "Risk of heart attack drops sharply — about half that of a smoker",
    durationMs: 1 * YEAR,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "1 to 2 years (CDC); 1 year (NHS)",
    phase: "year",
    category: "heart",
    appliesTo: "smoke",
  },
  {
    id: "1y-hdl",
    label: "1 year",
    benefit: "HDL (“good”) cholesterol has risen compared with continuing to smoke",
    durationMs: 1 * YEAR,
    sourceId: GEPNER_2011_HDL.id,
    publishedTimeframe: "1 year (study)",
    phase: "year",
    category: "heart",
    appliesTo: "smoke",
  },
  {
    id: "1y-gums",
    label: "1 year",
    benefit: "Gums heal better: gum pockets shrink more than in people who keep smoking",
    durationMs: 1 * YEAR,
    sourceId: PERIODONTAL_2005.id,
    publishedTimeframe: "12 months (study)",
    phase: "year",
    category: "body",
    appliesTo: "smoke",
  },
  {
    id: "1y-lungs",
    label: "1 year",
    benefit:
      "Lung function has gained ground, and from now on it declines at less than half a smoker’s rate",
    durationMs: 1 * YEAR,
    sourceId: LUNG_HEALTH_STUDY.id,
    publishedTimeframe: "First year, then 11-year follow-up (study)",
    phase: "year",
    category: "lungs",
    appliesTo: "smoke",
  },
  // —— Years ahead ——
  {
    id: "2y",
    label: "2 years",
    benefit: "Risk of heart attack drops sharply",
    durationMs: 2 * YEAR,
    sourceId: CDC_BENEFITS_OVER_TIME.id,
    publishedTimeframe: "1 to 2 years (CDC)",
    phase: "years",
    category: "heart",
    appliesTo: "smoke",
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
    appliesTo: "smoke",
  },
  {
    id: "3y-lifespan",
    label: "3 years",
    benefit:
      "About half of the life-expectancy gain from quitting is already yours: quitting for under 3 years averts up to about 5 years of life lost",
    durationMs: 3 * YEAR,
    sourceId: CHO_2024_MORTALITY.id,
    publishedTimeframe: "Under 3 years (study)",
    phase: "years",
    category: "body",
    appliesTo: "smoke",
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
    appliesTo: "smoke",
  },
  {
    id: "5y-cvd",
    label: "5 years",
    benefit:
      "Risk of heart attack, stroke and heart failure combined is about 39% lower than if you had kept smoking",
    durationMs: 5 * YEAR,
    sourceId: DUNCAN_2019_CVD.id,
    publishedTimeframe: "Within 5 years (study)",
    phase: "years",
    category: "heart",
    appliesTo: "smoke",
  },
  {
    id: "5y-lung-cancer",
    label: "5 years",
    benefit:
      "Lung cancer risk is about 39% lower than if you had kept smoking, and keeps falling",
    durationMs: 5 * YEAR,
    sourceId: TINDLE_2018_LUNG.id,
    publishedTimeframe: "Within 5 years (study)",
    phase: "years",
    category: "cancer",
    appliesTo: "smoke",
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
    appliesTo: "smoke",
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
    appliesTo: "smoke",
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
    appliesTo: "smoke",
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
    appliesTo: "smoke",
  },
  {
    id: "10y-lifespan",
    label: "10 years",
    benefit:
      "Survival is now close to that of people who never smoked — up to about 10 years of life regained",
    durationMs: 10 * YEAR,
    sourceId: CHO_2024_MORTALITY.id,
    publishedTimeframe: "10+ years (study); up to a decade (SG)",
    phase: "years",
    category: "body",
    appliesTo: "smoke",
  },
  {
    id: "10y-diabetes",
    label: "10 years",
    benefit:
      "Extra type 2 diabetes risk has shrunk to about 11% above never-smokers",
    durationMs: 10 * YEAR,
    sourceId: PAN_2015_DIABETES.id,
    publishedTimeframe: "10+ years (study)",
    phase: "years",
    category: "body",
    appliesTo: "smoke",
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
    appliesTo: "smoke",
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
    appliesTo: "smoke",
  },
  {
    id: "15y-cvd",
    label: "15 years",
    benefit:
      "Overall cardiovascular disease risk approaches that of someone who never smoked",
    durationMs: 15 * YEAR,
    sourceId: DUNCAN_2019_CVD.id,
    publishedTimeframe: "10 to 15 years (study)",
    phase: "years",
    category: "heart",
    appliesTo: "smoke",
  },
  {
    id: "15y-teeth",
    label: "15 years",
    benefit:
      "Risk of losing teeth approaches that of someone who never smoked",
    durationMs: 15 * YEAR,
    sourceId: DIETRICH_2015_TEETH.id,
    publishedTimeframe: "10 to 20 years (study)",
    phase: "years",
    category: "body",
    appliesTo: "smoke",
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
    appliesTo: "smoke",
  },
  {
    id: "20y-eyes",
    label: "20 years",
    benefit:
      "Risk of age-related macular degeneration (a leading cause of vision loss) is comparable to never-smokers",
    durationMs: 20 * YEAR,
    sourceId: KHAN_2006_AMD.id,
    publishedTimeframe: "20+ years (study)",
    phase: "years",
    category: "senses",
    appliesTo: "smoke",
  },
  {
    id: "25y-cvd",
    label: "25 years",
    benefit:
      "Even after heavy smoking, cardiovascular disease risk has typically reached never-smoker levels",
    durationMs: 25 * YEAR,
    sourceId: DUNCAN_2019_CVD.id,
    publishedTimeframe: "Up to 25+ years for heavy smokers (study)",
    phase: "years",
    category: "heart",
    appliesTo: "smoke",
  },
  {
    id: "25y-lung-cancer",
    label: "25 years",
    benefit:
      "Lung cancer risk is far lower than if you had kept smoking, though still above never-smokers — keep up any recommended screening",
    durationMs: 25 * YEAR,
    sourceId: TINDLE_2018_LUNG.id,
    publishedTimeframe: "25 years (study)",
    phase: "years",
    category: "cancer",
    appliesTo: "smoke",
  },
  {
    id: "30y-ra",
    label: "30 years",
    benefit:
      "Risk of seropositive rheumatoid arthritis is about 37% lower than in recent quitters",
    durationMs: 30 * YEAR,
    sourceId: LIU_2019_RA.id,
    publishedTimeframe: "30+ years (study)",
    phase: "years",
    category: "body",
    appliesTo: "smoke",
  },
];

export const MILESTONE_SOURCE = CDC_BENEFITS_OVER_TIME;

export const MILESTONE_PHASE_ORDER: MilestonePhase[] = [
  "hours",
  "weeks",
  "months",
  "year",
  "years",
];

export const MILESTONE_PHASE_LABELS: Record<MilestonePhase, string> = {
  hours: "First 24 hours",
  weeks: "First 3 weeks",
  months: "First 3 months",
  year: "Rest of year one",
  years: "Years ahead",
};

/** Time windows shown as progress bars at the top of the health timeline */
export const RECOVERY_WINDOWS: { id: string; label: string; durationMs: number }[] = [
  { id: "3w", label: "First 3 weeks", durationMs: 21 * DAY },
  { id: "3mo", label: "First 3 months", durationMs: 90 * DAY },
  { id: "1y", label: "First year", durationMs: 1 * YEAR },
  { id: "5y", label: "First 5 years", durationMs: 5 * YEAR },
  { id: "10y", label: "First 10 years", durationMs: 10 * YEAR },
  { id: "20y", label: "First 20 years", durationMs: 20 * YEAR },
  { id: "30y", label: "30 years — full timeline", durationMs: 30 * YEAR },
];

/** Sub-groups within the years phase for a friendlier long-term timeline */
export const YEAR_BAND_LABELS: { maxMs: number; label: string }[] = [
  { maxMs: 3 * YEAR, label: "Years 1–3" },
  { maxMs: 10 * YEAR, label: "Years 3–10" },
  { maxMs: 20 * YEAR, label: "Years 10–20" },
  { maxMs: Infinity, label: "20+ years" },
];

const CATEGORY_ICONS: Record<Milestone["category"], string> = {
  heart: "❤️",
  blood: "🩸",
  lungs: "🫁",
  cancer: "🎗️",
  brain: "🧠",
  senses: "👅",
  body: "💪",
};

export function getMilestoneCategoryIcon(category: Milestone["category"]): string {
  return CATEGORY_ICONS[category];
}

export function getMilestoneSourceShortName(sourceId: string): string {
  return getHealthSource(sourceId)?.shortName ?? "CDC";
}

/**
 * True when the quitter used burnt tobacco (cigarettes or rolling tobacco).
 * Data without any product section is treated as smoking (legacy default).
 */
export function usesSmokedTobacco(
  quitData: Pick<QuitData, "cigarettes" | "vaping" | "tobacco">
): boolean {
  return Boolean(quitData.cigarettes || quitData.tobacco || !quitData.vaping);
}

/** Milestones relevant to what this person quit — vaping-only hides smoke-specific entries. */
export function getMilestonesForQuitData(
  quitData: Pick<QuitData, "cigarettes" | "vaping" | "tobacco">
): Milestone[] {
  return usesSmokedTobacco(quitData)
    ? MILESTONES
    : MILESTONES.filter((m) => m.appliesTo === "nicotine");
}

export function groupMilestonesByPhase(
  milestones: Milestone[] = MILESTONES
): Map<MilestonePhase, Milestone[]> {
  const groups = new Map<MilestonePhase, Milestone[]>();
  for (const phase of MILESTONE_PHASE_ORDER) {
    groups.set(
      phase,
      milestones.filter((m) => m.phase === phase)
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
