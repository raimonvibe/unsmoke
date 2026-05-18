/**
 * Public health references for education copy in the app.
 * This app is not affiliated with, endorsed by, or partnered with these organizations.
 */

export interface HealthSource {
  id: string;
  name: string;
  url: string;
  note: string;
}

/** Primary timeline: CDC “Health benefits of quitting smoking over time” (May 2024). */
export const CDC_BENEFITS_OVER_TIME: HealthSource = {
  id: "cdc-benefits-over-time",
  name: "U.S. CDC — Benefits of quitting smoking",
  url: "https://www.cdc.gov/tobacco/about/benefits-of-quitting.html",
  note: "Milestone timings and wording follow CDC’s published “over time” table (2024).",
};

export const CDC_SURGEON_GENERAL: HealthSource = {
  id: "cdc-sgr",
  name: "U.S. HHS — Smoking Cessation: A Report of the Surgeon General (2020)",
  url: "https://www.cdc.gov/tobacco/sgr/2020/index.htm",
  note: "Underlying evidence cited by CDC for cessation benefits.",
};

export const WHO_CESSATION: HealthSource = {
  id: "who-cessation",
  name: "WHO — Health benefits of smoking cessation",
  url: "https://www.who.int/news-room/questions-and-answers/item/tobacco-health-benefits-of-smoking-cessation",
  note: "General global guidance; timelines vary by individual.",
};

export const HEALTH_SOURCES: HealthSource[] = [
  CDC_BENEFITS_OVER_TIME,
  CDC_SURGEON_GENERAL,
  WHO_CESSATION,
];

export const LOCAL_DATA_NOTICE =
  "Your journey is saved only in this browser—not in the cloud. Clearing cookies, site data, or browsing data for this site will erase your progress. Private browsing may not keep it after you close the window.";

export const APP_DISCLAIMER =
  "Unsmoke is a personal tracking tool, not medical advice, and is not affiliated with CDC, WHO, or any health authority. Milestones summarize published public-health timelines for motivation only. Your results depend on your inputs and individual health. Consult a qualified professional for medical questions.";

export const SAVINGS_DISCLAIMER =
  "Money and usage figures are calculated from the numbers you enter. They are estimates for motivation, not financial or clinical records.";

export const NICOTINE_DISCLAIMER =
  "Nicotine amounts show estimated content not consumed (mg in cigarettes, liquid, or tobacco). Pack label values are most accurate; blend estimates are approximate.";

export function getHealthSource(id: string): HealthSource | undefined {
  return HEALTH_SOURCES.find((s) => s.id === id);
}
