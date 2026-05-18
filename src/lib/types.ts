/** @deprecated Legacy summary; new data uses optional product sections */
export type ProductType = "cigarettes" | "vaping" | "both" | "tobacco" | "mixed";

export type TobaccoVariant = "light" | "medium" | "heavy";

export interface CigaretteUsage {
  perDay: number;
  costPerUnit: number;
}

export interface VapingUsage {
  mlPerDay: number;
  nicotineMgPerMl: number;
  bottleMl: number;
  costPerBottle: number;
}

/** Rolling / pouch tobacco — usage in grams, not cigarettes or puffs. */
export interface TobaccoUsage {
  variant: TobaccoVariant;
  /** Grams of tobacco used per day */
  gramsPerDay: number;
  /** Package size in grams (e.g. 50) */
  packageGrams: number;
  costPerPackage: number;
  /**
   * Nicotine in mg per gram of tobacco, from the pack label when available.
   * If omitted, a rough estimate from blend strength (light / medium / heavy) is used.
   */
  nicotineMgPerGram?: number;
}

export interface QuitData {
  quitDate: string;
  productType?: ProductType;
  cigarettes?: CigaretteUsage;
  vaping?: VapingUsage;
  tobacco?: TobaccoUsage;
}

export interface Milestone {
  id: string;
  label: string;
  benefit: string;
  durationMs: number;
  /** Key into HEALTH_SOURCES — educational citation only */
  sourceId: string;
  /** How the source describes the timeframe (shown for transparency) */
  publishedTimeframe?: string;
}

export interface TimeSinceQuit {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

/** @deprecated Legacy flat shape — migration only */
export interface LegacyQuitData {
  quitDate: string;
  productType: ProductType;
  perDay: number;
  costPerUnit: number;
}
