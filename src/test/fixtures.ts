import type { CigaretteUsage, QuitData, TobaccoUsage, VapingUsage } from "@/lib/types";
import { localDate } from "./helpers";

export const QUIT = localDate(2024, 0, 1);

export const CIGARETTES: CigaretteUsage = {
  perDay: 20,
  costPerUnit: 0.5,
};

export const VAPING: VapingUsage = {
  mlPerDay: 2,
  nicotineMgPerMl: 20,
  bottleMl: 10,
  costPerBottle: 15,
};

export const TOBACCO_MEDIUM: TobaccoUsage = {
  variant: "medium",
  gramsPerDay: 5,
  packageGrams: 50,
  costPerPackage: 12,
};

export const TOBACCO_LABELED: TobaccoUsage = {
  ...TOBACCO_MEDIUM,
  nicotineMgPerGram: 14,
};

export function quitData(partial: Partial<QuitData> & { quitDate?: string }): QuitData {
  return {
    quitDate: partial.quitDate ?? QUIT.toISOString(),
    ...partial,
  };
}
