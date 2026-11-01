/**
 * Public health references for education copy in the app.
 * This app is not affiliated with, endorsed by, or partnered with these organizations.
 */

export interface HealthSource {
  id: string;
  /** Badge text on milestone rows (e.g. "CDC", "NHS", "Study") */
  shortName: string;
  name: string;
  url: string;
  note: string;
}

/** Primary timeline: CDC “Health benefits of quitting smoking over time” (May 2024). */
export const CDC_BENEFITS_OVER_TIME: HealthSource = {
  id: "cdc-benefits-over-time",
  shortName: "CDC",
  name: "U.S. CDC — Benefits of quitting smoking",
  url: "https://www.cdc.gov/tobacco/about/benefits-of-quitting.html",
  note: "Milestone timings and wording follow CDC’s published “over time” table (2024).",
};

export const CDC_SURGEON_GENERAL: HealthSource = {
  id: "cdc-sgr",
  shortName: "SG",
  name: "U.S. HHS — Smoking Cessation: A Report of the Surgeon General (2020)",
  url: "https://www.cdc.gov/tobacco/sgr/2020/index.htm",
  note: "Underlying evidence cited by CDC; concludes quitting can add as much as a decade to life expectancy.",
};

export const WHO_CESSATION: HealthSource = {
  id: "who-cessation",
  shortName: "WHO",
  name: "WHO — Health benefits of smoking cessation",
  url: "https://www.who.int/news-room/questions-and-answers/item/tobacco-health-benefits-of-smoking-cessation",
  note: "Early milestones (12 hours, 2–12 weeks, 1–9 months) use WHO’s published Q&A wording.",
};

/** NHS Wales smoke-free timeline (20 min → 15 years), the most granular official NHS table. */
export const NHS_WALES_TIMELINE: HealthSource = {
  id: "nhs-wales-timeline",
  shortName: "NHS",
  name: "NHS Wales 111 — Smoke free timeline",
  url: "https://111.wales.nhs.uk/LiveWell/QuitSmokingTimeline/",
  note: "Hour- and day-level milestones (8 hours, 24 hours, 48 hours, 72 hours, 3–9 months).",
};

export const NHS_BETTER_HEALTH: HealthSource = {
  id: "nhs-better-health",
  shortName: "NHS",
  name: "NHS Better Health — Benefits of quitting smoking",
  url: "https://www.nhs.uk/better-health/quit-smoking/why-quit-smoking/benefits-of-quitting-smoking/",
  note: "Mental health benefits can start in as little as 6 weeks.",
};

export const ACS_OVER_TIME: HealthSource = {
  id: "acs-over-time",
  shortName: "ACS",
  name: "American Cancer Society — Health benefits of quitting over time",
  url: "https://www.cancer.org/cancer/risk-prevention/tobacco/benefits-of-quitting-smoking-over-time.html",
  note: "Cilia (tiny hair-like structures that clear mucus) start to regain normal function within 1–12 months.",
};

export const ALA_BENEFITS: HealthSource = {
  id: "ala-benefits",
  shortName: "ALA",
  name: "American Lung Association — Benefits of quitting",
  url: "https://www.lung.org/quit-smoking/i-want-to-quit/benefits-of-quitting",
  note: "Heart attack risk starts to fall and lung function improves from 2 weeks to 3 months.",
};

export const WHO_SURGERY_2020: HealthSource = {
  id: "who-surgery-2020",
  shortName: "WHO",
  name: "WHO — Smoking greatly increases risk of complications after surgery (2020)",
  url: "https://www.who.int/news/item/20-01-2020-smoking-greatly-increases-risk-of-complications-after-surgery",
  note: "Quitting about 4 weeks or more before surgery lowers the risk of complications.",
};

export const SMOKEFREE_WITHDRAWAL: HealthSource = {
  id: "smokefree-withdrawal",
  shortName: "NCI",
  name: "Smokefree.gov (U.S. National Cancer Institute) — Understanding withdrawal",
  url: "https://smokefree.gov/challenges-when-quitting/withdrawal/understanding-withdrawal",
  note: "Withdrawal is strongest in the first few days; the worst symptoms last a few days to a couple of weeks.",
};

export const HUGHES_2007_WITHDRAWAL: HealthSource = {
  id: "hughes-2007",
  shortName: "Study",
  name: "Hughes 2007 — Effects of abstinence from tobacco: valid symptoms and time course (Nicotine & Tobacco Research)",
  url: "https://doi.org/10.1080/14622200701188919",
  note: "Review: most withdrawal symptoms peak in the first week and fade over 2–4 weeks.",
};

export const BENOWITZ_COTININE: HealthSource = {
  id: "benowitz-biomarkers",
  shortName: "Study",
  name: "Benowitz et al. 2020 — Biochemical verification of tobacco use and abstinence (SRNT update)",
  url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7882145/",
  note: "Nicotine half-life ≈ 2 hours; cotinine half-life ≈ 16 hours, typically below cut-off in about 3 days.",
};

export const FIRST_WEEK_STUDY: HealthSource = {
  id: "first-week-relapse",
  shortName: "Study",
  name: "The first 7 days of a quit attempt predicts relapse (validation study)",
  url: "https://researchconnect.buffalo.edu/en/publications/the-first-7-days-of-a-quit-attempt-predicts-relapse-validation-of/",
  note: "No lapse in the first week predicted abstinence at end of treatment and at 6 months.",
};

export const NIDA_RECEPTORS: HealthSource = {
  id: "nida-receptors",
  shortName: "NIDA",
  name: "NIDA Notes — Abstinent smokers' nicotinic receptors take more than a month to normalize (Cosgrove 2009)",
  url: "https://archives.drugabuse.gov/news-events/nida-notes/2009/10/abstinent-smokers-nicotinic-receptors-take-more-than-a-month-to-normalize",
  note: "Brain β2 nicotinic receptors stayed elevated for about 6 weeks and matched non-smokers after 6–12 weeks.",
};

export const TAYLOR_2014_BMJ: HealthSource = {
  id: "taylor-2014-bmj",
  shortName: "BMJ",
  name: "Taylor et al. 2014 — Change in mental health after smoking cessation (BMJ meta-analysis)",
  url: "https://pubmed.ncbi.nlm.nih.gov/24524926/",
  note: "Quitting was linked to lower anxiety, depression, and stress, with effects as large as antidepressant treatment.",
};

export const CHERUEL_2017_TASTE: HealthSource = {
  id: "cheruel-2017-taste",
  shortName: "Study",
  name: "Chéruel et al. 2017 — Taste sensitivity recovery after smoking cessation (Tobacco Induced Diseases)",
  url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5329949/",
  note: "Taste recovered on the tongue tip and edges after 2 weeks and across the back of the tongue by 9 weeks.",
};

export const ELIASSON_1997_INSULIN: HealthSource = {
  id: "eliasson-1997-insulin",
  shortName: "Study",
  name: "Eliasson et al. 1997 — Smoking cessation improves insulin sensitivity in healthy middle-aged men",
  url: "https://pubmed.ncbi.nlm.nih.gov/?term=Smoking+cessation+improves+insulin+sensitivity+in+healthy+middle-aged+men",
  note: "Insulin sensitivity improved within 8 weeks of quitting despite modest weight gain.",
};

export const GEPNER_2011_HDL: HealthSource = {
  id: "gepner-2011-hdl",
  shortName: "Study",
  name: "Gepner et al. 2011 — Effects of smoking and smoking cessation on lipids (American Heart Journal RCT)",
  url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3110741/",
  note: "One year after quitting, HDL (“good”) cholesterol rose versus continuing smokers, despite weight gain.",
};

export const PERIODONTAL_2005: HealthSource = {
  id: "periodontal-2005",
  shortName: "Study",
  name: "2005 prospective study — The effect of quitting smoking on chronic periodontitis (J Clin Periodontol)",
  url: "https://pubmed.ncbi.nlm.nih.gov/15998271/",
  note: "Quitters showed significantly better gum-pocket healing at 12 months than continuing smokers.",
};

export const LUNG_HEALTH_STUDY: HealthSource = {
  id: "lung-health-study",
  shortName: "Study",
  name: "Lung Health Study — Smoking and lung function after 11 years (Anthonisen et al.)",
  url: "https://pubmed.ncbi.nlm.nih.gov/?term=Smoking+and+lung+function+of+Lung+Health+Study+participants+after+11+years",
  note: "Sustained quitters gained lung function in year one, then lost it at less than half the smokers’ rate.",
};

export const RYO_TOBACCO_2009: HealthSource = {
  id: "ryo-2009",
  shortName: "Study",
  name: "New Zealand study 2009 — Hand-rolled vs factory-made cigarette smoke exposure (BMC Public Health)",
  url: "https://bmcpublichealth.biomedcentral.com/articles/10.1186/1471-2458-9-194",
  note: "Rolling tobacco gave the same carbon-monoxide rise and more inhaled smoke per cigarette, so smoking milestones apply equally.",
};

export const CHO_2024_MORTALITY: HealthSource = {
  id: "cho-2024-mortality",
  shortName: "Study",
  name: "Cho et al. 2024 — Smoking cessation and short- and longer-term mortality (NEJM Evidence, 4 national cohorts)",
  url: "https://pubmed.ncbi.nlm.nih.gov/?term=Smoking+cessation+and+short-+and+longer-term+mortality+NEJM+Evidence",
  note: "Quitting for under 3 years averted about 5 years of life lost; 10+ years averted about 10 years, giving survival close to never-smokers.",
};

export const DUNCAN_2019_CVD: HealthSource = {
  id: "duncan-2019-cvd",
  shortName: "Study",
  name: "Duncan et al. 2019 — Smoking cessation and subsequent cardiovascular disease risk (JAMA, Framingham)",
  url: "https://pubmed.ncbi.nlm.nih.gov/?term=Association+of+Smoking+Cessation+With+Subsequent+Risk+of+Cardiovascular+Disease+Duncan",
  note: "Former heavy smokers had 39% lower CVD risk within 5 years versus smoking; risk approached never-smokers after 10–15 years (up to 25+ in one cohort).",
};

export const TINDLE_2018_LUNG: HealthSource = {
  id: "tindle-2018-lung",
  shortName: "Study",
  name: "Tindle et al. 2018 — Lifetime smoking history and risk of lung cancer (JNCI, Framingham)",
  url: "https://pubmed.ncbi.nlm.nih.gov/29788259/",
  note: "Lung cancer risk was 39% lower within 5 years of quitting versus smoking, kept falling, but stayed above never-smokers at 25 years.",
};

export const PAN_2015_DIABETES: HealthSource = {
  id: "pan-2015-diabetes",
  shortName: "Study",
  name: "Pan et al. 2015 — Active, passive and quitting smoking and type 2 diabetes (Lancet Diabetes Endocrinol meta-analysis)",
  url: "https://pubmed.ncbi.nlm.nih.gov/26388413/",
  note: "Excess diabetes risk is higher in new quitters (weight gain) and falls to about 11% after 10+ years.",
};

export const DIETRICH_2015_TEETH: HealthSource = {
  id: "dietrich-2015-teeth",
  shortName: "Study",
  name: "Dietrich et al. 2015 — Smoking, smoking cessation, and risk of tooth loss (J Dent Res, EPIC-Potsdam)",
  url: "https://research.birmingham.ac.uk/en/publications/smoking-smoking-cessation-and-risk-of-tooth-loss-the-epic-potsdam/",
  note: "Tooth-loss risk approached that of never-smokers after roughly 10–20 years without smoking.",
};

export const KHAN_2006_AMD: HealthSource = {
  id: "khan-2006-amd",
  shortName: "Study",
  name: "Khan et al. 2006 — Smoking and age-related macular degeneration (British Journal of Ophthalmology)",
  url: "https://bjo.bmj.com/content/90/1/75",
  note: "People who had not smoked for over 20 years had macular-degeneration risk comparable to never-smokers.",
};

export const LIU_2019_RA: HealthSource = {
  id: "liu-2019-ra",
  shortName: "Study",
  name: "Liu et al. 2019 — Smoking cessation timing and rheumatoid arthritis risk (Arthritis Care & Research, Nurses’ Health Studies)",
  url: "https://pubmed.ncbi.nlm.nih.gov/?term=Impact+and+timing+of+smoking+cessation+on+reducing+risk+for+rheumatoid+arthritis",
  note: "Women who quit 30+ years earlier had 37% lower seropositive RA risk than recent quitters.",
};

export const HEALTH_SOURCES: HealthSource[] = [
  CDC_BENEFITS_OVER_TIME,
  CDC_SURGEON_GENERAL,
  WHO_CESSATION,
  NHS_WALES_TIMELINE,
  NHS_BETTER_HEALTH,
  ACS_OVER_TIME,
  ALA_BENEFITS,
  WHO_SURGERY_2020,
  SMOKEFREE_WITHDRAWAL,
  HUGHES_2007_WITHDRAWAL,
  BENOWITZ_COTININE,
  FIRST_WEEK_STUDY,
  NIDA_RECEPTORS,
  TAYLOR_2014_BMJ,
  CHERUEL_2017_TASTE,
  ELIASSON_1997_INSULIN,
  GEPNER_2011_HDL,
  PERIODONTAL_2005,
  LUNG_HEALTH_STUDY,
  RYO_TOBACCO_2009,
  CHO_2024_MORTALITY,
  DUNCAN_2019_CVD,
  TINDLE_2018_LUNG,
  PAN_2015_DIABETES,
  DIETRICH_2015_TEETH,
  KHAN_2006_AMD,
  LIU_2019_RA,
];

export const LOCAL_DATA_NOTICE =
  "Your journey is saved only in this browser—not in the cloud. Clearing cookies, site data, or browsing data for this site will erase your progress. Private browsing may not keep it after you close the window.";

export const APP_DISCLAIMER =
  "Unsmoke is a personal tracking tool, not medical advice, and is not affiliated with CDC, WHO, NHS, or any health authority. Milestones summarize published health-agency timelines and peer-reviewed studies for motivation only; they describe typical averages, not a reading of your body. Your results depend on your inputs and individual health. Consult a qualified professional for medical questions.";

export const SAVINGS_DISCLAIMER =
  "Money and usage figures are calculated from the numbers you enter. They are estimates for motivation, not financial or clinical records.";

export const NICOTINE_DISCLAIMER =
  "Nicotine amounts show estimated content not consumed (mg in cigarettes, liquid, or tobacco). Pack label values are most accurate; blend estimates are approximate.";

export function getHealthSource(id: string): HealthSource | undefined {
  return HEALTH_SOURCES.find((s) => s.id === id);
}
