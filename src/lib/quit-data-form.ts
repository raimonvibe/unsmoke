import { toLocalDateString } from "./date";
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
