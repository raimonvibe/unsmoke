export interface UsagePreset {
  value: string;
  label: string;
}

export const CIGARETTES_PER_DAY_PRESETS: UsagePreset[] = [
  { value: "5", label: "5 per day — very light" },
  { value: "10", label: "10 per day — light" },
  { value: "15", label: "15 per day" },
  { value: "20", label: "20 per day — about a pack" },
  { value: "25", label: "25 per day" },
  { value: "30", label: "30 per day — heavy" },
  { value: "40", label: "40+ per day" },
];

export const COST_PER_CIGARETTE_PRESETS: UsagePreset[] = [
  { value: "0.25", label: "$0.25 each" },
  { value: "0.35", label: "$0.35 each" },
  { value: "0.50", label: "$0.50 each" },
  { value: "0.75", label: "$0.75 each" },
  { value: "1.00", label: "$1.00 each" },
];

export const ML_PER_DAY_PRESETS: UsagePreset[] = [
  { value: "1", label: "1 ml per day — light" },
  { value: "2", label: "2 ml per day" },
  { value: "3", label: "3 ml per day" },
  { value: "5", label: "5 ml per day" },
  { value: "10", label: "10 ml per day" },
  { value: "15", label: "15 ml per day — heavy" },
];

export const NICOTINE_MG_PER_ML_PRESETS: UsagePreset[] = [
  { value: "3", label: "3 mg/ml — very low" },
  { value: "6", label: "6 mg/ml" },
  { value: "10", label: "10 mg/ml" },
  { value: "12", label: "12 mg/ml" },
  { value: "18", label: "18 mg/ml" },
  { value: "20", label: "20 mg/ml — common" },
  { value: "50", label: "50 mg/ml — high" },
];

export const BOTTLE_ML_PRESETS: UsagePreset[] = [
  { value: "10", label: "10 ml bottle / pod" },
  { value: "30", label: "30 ml bottle" },
  { value: "60", label: "60 ml bottle" },
  { value: "100", label: "100 ml bottle" },
];

export const COST_PER_BOTTLE_PRESETS: UsagePreset[] = [
  { value: "5", label: "$5 per bottle" },
  { value: "10", label: "$10 per bottle" },
  { value: "15", label: "$15 per bottle" },
  { value: "20", label: "$20 per bottle" },
  { value: "25", label: "$25 per bottle" },
];

export const GRAMS_PER_DAY_PRESETS: UsagePreset[] = [
  { value: "3", label: "3 g per day — light" },
  { value: "5", label: "5 g per day" },
  { value: "7", label: "7 g per day" },
  { value: "10", label: "10 g per day" },
  { value: "15", label: "15 g per day — heavy" },
  { value: "20", label: "20 g per day" },
];

export const PACKAGE_GRAMS_PRESETS: UsagePreset[] = [
  { value: "25", label: "25 g pouch" },
  { value: "30", label: "30 g pouch" },
  { value: "40", label: "40 g pouch" },
  { value: "50", label: "50 g pouch" },
  { value: "100", label: "100 g pouch" },
];

export const COST_PER_PACKAGE_PRESETS: UsagePreset[] = [
  { value: "8", label: "$8 per pouch" },
  { value: "10", label: "$10 per pouch" },
  { value: "12", label: "$12 per pouch" },
  { value: "15", label: "$15 per pouch" },
  { value: "20", label: "$20 per pouch" },
];

export const PACK_NICOTINE_MG_PER_G_PRESETS: UsagePreset[] = [
  { value: "", label: "Not on label — use blend estimate" },
  { value: "10", label: "10 mg/g" },
  { value: "12", label: "12 mg/g" },
  { value: "14", label: "14 mg/g" },
  { value: "16", label: "16 mg/g" },
  { value: "18", label: "18 mg/g" },
];

export {
  isAllowedDecimalInput,
  parseFormNumber,
  parseLocalizedNumber,
  parseOptionalFormNumber,
} from "./parse-number";

export function roundToStep(value: number, step: number): number {
  const rounded = Math.round(value / step) * step;
  const decimals = step.toString().includes(".")
    ? step.toString().split(".")[1]?.length ?? 2
    : 0;
  return Number(rounded.toFixed(decimals));
}

export function clampValue(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function formatPickerNumber(value: number, step: number): string {
  const rounded = roundToStep(value, step);
  if (step >= 1) return String(Math.round(rounded));
  return rounded.toFixed(step < 0.01 ? 2 : 1).replace(/\.?0+$/, "");
}

export function presetSelectValue(
  value: string,
  presets: readonly UsagePreset[]
): string {
  if (presets.some((p) => p.value === value)) return value;
  if (value === "" && presets.some((p) => p.value === "")) return "";
  return "__custom__";
}
