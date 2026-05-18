import type { LegacyQuitData, ProductType, QuitData } from "./types";

function isLegacyQuitData(raw: Record<string, unknown>): boolean {
  return (
    typeof raw.perDay === "number" &&
    typeof raw.costPerUnit === "number" &&
    raw.cigarettes === undefined &&
    raw.vaping === undefined &&
    raw.tobacco === undefined
  );
}

function isValidCigarettes(raw: unknown): boolean {
  if (!raw || typeof raw !== "object") return false;
  const c = raw as Record<string, unknown>;
  return (
    typeof c.perDay === "number" &&
    c.perDay > 0 &&
    typeof c.costPerUnit === "number" &&
    c.costPerUnit >= 0
  );
}

function isValidVaping(raw: unknown): boolean {
  if (!raw || typeof raw !== "object") return false;
  const v = raw as Record<string, unknown>;
  return (
    typeof v.mlPerDay === "number" &&
    v.mlPerDay > 0 &&
    typeof v.nicotineMgPerMl === "number" &&
    v.nicotineMgPerMl > 0 &&
    typeof v.bottleMl === "number" &&
    v.bottleMl > 0 &&
    typeof v.costPerBottle === "number" &&
    v.costPerBottle >= 0
  );
}

function isValidTobacco(raw: unknown): boolean {
  if (!raw || typeof raw !== "object") return false;
  const t = raw as Record<string, unknown>;
  const validVariant =
    t.variant === "light" || t.variant === "medium" || t.variant === "heavy";
  const validOptionalLabel =
    t.nicotineMgPerGram === undefined ||
    (typeof t.nicotineMgPerGram === "number" && t.nicotineMgPerGram > 0);

  return (
    validVariant &&
    typeof t.gramsPerDay === "number" &&
    t.gramsPerDay > 0 &&
    typeof t.packageGrams === "number" &&
    t.packageGrams > 0 &&
    typeof t.costPerPackage === "number" &&
    t.costPerPackage >= 0 &&
    validOptionalLabel
  );
}

export function deriveProductType(
  data: Pick<QuitData, "cigarettes" | "vaping" | "tobacco">
): ProductType {
  const count =
    (data.cigarettes ? 1 : 0) +
    (data.vaping ? 1 : 0) +
    (data.tobacco ? 1 : 0);
  if (count > 1) return "mixed";
  if (data.cigarettes) return "cigarettes";
  if (data.vaping) return "vaping";
  if (data.tobacco) return "tobacco";
  return "mixed";
}

function buildQuitData(
  quitDate: string,
  cigarettes: QuitData["cigarettes"],
  vaping: QuitData["vaping"],
  tobacco: QuitData["tobacco"],
  productType?: ProductType
): QuitData {
  const data: QuitData = {
    quitDate,
    productType:
      productType ?? deriveProductType({ cigarettes, vaping, tobacco }),
  };
  if (cigarettes) data.cigarettes = cigarettes;
  if (vaping) data.vaping = vaping;
  if (tobacco) data.tobacco = tobacco;
  return data;
}

/**
 * Normalizes stored quit data. Returns null if invalid or legacy puff-based vaping.
 */
export function normalizeQuitData(raw: unknown): QuitData | null {
  if (!raw || typeof raw !== "object") return null;

  const d = raw as Record<string, unknown>;
  if (typeof d.quitDate !== "string") return null;

  if (isLegacyQuitData(d)) {
    const legacy = d as unknown as LegacyQuitData;
    if (legacy.productType === "vaping") return null;
    return buildQuitData(
      legacy.quitDate,
      { perDay: legacy.perDay, costPerUnit: legacy.costPerUnit },
      undefined,
      undefined,
      legacy.productType === "both" ? "cigarettes" : legacy.productType
    );
  }

  const cigarettes = isValidCigarettes(d.cigarettes)
    ? (d.cigarettes as QuitData["cigarettes"])
    : undefined;
  const vaping = isValidVaping(d.vaping)
    ? (d.vaping as QuitData["vaping"])
    : undefined;
  const tobacco = isValidTobacco(d.tobacco)
    ? (d.tobacco as QuitData["tobacco"])
    : undefined;

  if (!cigarettes && !vaping && !tobacco) return null;

  const legacyType =
    typeof d.productType === "string" ? (d.productType as ProductType) : undefined;

  if (legacyType === "both" && (!cigarettes || !vaping)) return null;
  if (legacyType === "cigarettes" && !cigarettes) return null;
  if (legacyType === "vaping" && !vaping) return null;
  if (legacyType === "tobacco" && !tobacco) return null;

  return buildQuitData(d.quitDate, cigarettes, vaping, tobacco, legacyType);
}
