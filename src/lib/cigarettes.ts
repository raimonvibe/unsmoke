import { getCigarettesAvoided } from "./calculations";
import type { CigaretteUsage } from "./types";

export function getCigaretteCostPerDay(usage: CigaretteUsage): number {
  return usage.perDay * usage.costPerUnit;
}

export { getCigarettesAvoided };
