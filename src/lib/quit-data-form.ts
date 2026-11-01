import { localDateTimeToIso, toLocalDateString } from "./date";
import { deriveProductType } from "./normalize-quit-data";
import { parseFormNumber, parseOptionalFormNumber } from "./parse-number";
import type { QuitData, TobaccoVariant } from "./types";

export interface QuitFormState {
  quitDate: string;
  quitTime: string;
  usesCigarettes: boolean;
  usesVaping: boolean;
  usesTobacco: boolean;
  cigarettesPerDay: string;
  costPerCigarette: string;
  mlPerDay: string;
  nicotineMgPerMl: string;
  bottleMl: string;
  costPerBottle: string;
  tobaccoVariant: TobaccoVariant;
  gramsPerDay: string;
  packageGrams: string;
  costPerPackage: string;
  packNicotineMgPerGram: string;
}

export function defaultQuitFormState(now = new Date()): QuitFormState {
  return {
    quitDate: toLocalDateString(now),
    quitTime: now.toTimeString().slice(0, 5),
    usesCigarettes: true,
    usesVaping: false,
    usesTobacco: false,
    cigarettesPerDay: "20",
    costPerCigarette: "0.50",
    mlPerDay: "2",
    nicotineMgPerMl: "20",
    bottleMl: "10",
    costPerBottle: "15",
    tobaccoVariant: "medium",
    gramsPerDay: "5",
    packageGrams: "50",
    costPerPackage: "12",
    packNicotineMgPerGram: "",
  };
}

export function quitFormStateFromData(data: QuitData): QuitFormState {
  const quit = new Date(data.quitDate);
  const base = defaultQuitFormState(quit);
  return {
    ...base,
    quitDate: toLocalDateString(quit),
    quitTime: quit.toTimeString().slice(0, 5),
    usesCigarettes: Boolean(data.cigarettes),
    usesVaping: Boolean(data.vaping),
    usesTobacco: Boolean(data.tobacco),
    cigarettesPerDay: data.cigarettes
      ? String(data.cigarettes.perDay)
      : base.cigarettesPerDay,
    costPerCigarette: data.cigarettes
      ? String(data.cigarettes.costPerUnit)
      : base.costPerCigarette,
    mlPerDay: data.vaping ? String(data.vaping.mlPerDay) : base.mlPerDay,
    nicotineMgPerMl: data.vaping
      ? String(data.vaping.nicotineMgPerMl)
      : base.nicotineMgPerMl,
    bottleMl: data.vaping ? String(data.vaping.bottleMl) : base.bottleMl,
    costPerBottle: data.vaping
      ? String(data.vaping.costPerBottle)
      : base.costPerBottle,
    tobaccoVariant: data.tobacco?.variant ?? base.tobaccoVariant,
    gramsPerDay: data.tobacco
      ? String(data.tobacco.gramsPerDay)
      : base.gramsPerDay,
    packageGrams: data.tobacco
      ? String(data.tobacco.packageGrams)
      : base.packageGrams,
    costPerPackage: data.tobacco
      ? String(data.tobacco.costPerPackage)
      : base.costPerPackage,
    packNicotineMgPerGram:
      data.tobacco?.nicotineMgPerGram != null
        ? String(data.tobacco.nicotineMgPerGram)
        : "",
  };
}

/**
 * Convert onboarding form fields into stored QuitData.
 * Applies the same parsing (comma or dot decimals), fallbacks and minimums the
 * form enforces. Returns null when no product is selected.
 */
export function quitFormStateToData(state: QuitFormState): QuitData | null {
  if (!state.usesCigarettes && !state.usesVaping && !state.usesTobacco) {
    return null;
  }

  const sections: Pick<QuitData, "cigarettes" | "vaping" | "tobacco"> = {};

  if (state.usesCigarettes) {
    sections.cigarettes = {
      perDay: Math.max(1, Math.round(parseFormNumber(state.cigarettesPerDay, 1))),
      costPerUnit: Math.max(0, parseFormNumber(state.costPerCigarette, 0)),
    };
  }

  if (state.usesVaping) {
    sections.vaping = {
      mlPerDay: Math.max(0.1, parseFormNumber(state.mlPerDay, 0.1)),
      nicotineMgPerMl: Math.max(0.1, parseFormNumber(state.nicotineMgPerMl, 0.1)),
      bottleMl: Math.max(1, parseFormNumber(state.bottleMl, 1)),
      costPerBottle: Math.max(0, parseFormNumber(state.costPerBottle, 0)),
    };
  }

  if (state.usesTobacco) {
    const labelMg = parseOptionalFormNumber(state.packNicotineMgPerGram);
    sections.tobacco = {
      variant: state.tobaccoVariant,
      gramsPerDay: Math.max(0.1, parseFormNumber(state.gramsPerDay, 0.1)),
      packageGrams: Math.max(1, parseFormNumber(state.packageGrams, 1)),
      costPerPackage: Math.max(0, parseFormNumber(state.costPerPackage, 0)),
      ...(labelMg != null && labelMg > 0 ? { nicotineMgPerGram: labelMg } : {}),
    };
  }

  return {
    quitDate: localDateTimeToIso(state.quitDate, state.quitTime),
    productType: deriveProductType(sections),
    ...sections,
  };
}
