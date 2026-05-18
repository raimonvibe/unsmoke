/**
 * Parse numbers from form strings — supports "." and "," decimals (iPhone EU keyboards).
 */

/** Accepts "12.5" and "12,5" (common on European phone keyboards). */
export function parseLocalizedNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(/\s/g, "");
  if (!trimmed || trimmed === "." || trimmed === ",") return null;

  let normalized = trimmed;
  const hasComma = trimmed.includes(",");
  const hasDot = trimmed.includes(".");

  if (hasComma && hasDot) {
    normalized = trimmed.replace(/\./g, "").replace(",", ".");
  } else if (hasComma) {
    normalized = trimmed.replace(",", ".");
  }

  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : null;
}

/** While typing in a decimal text field. */
export function isAllowedDecimalInput(raw: string): boolean {
  return raw === "" || /^-?\d*[.,]?\d*$/.test(raw);
}

/** Required numeric form field — uses fallback when empty or invalid. */
export function parseFormNumber(value: string, fallback: number): number {
  const n = parseLocalizedNumber(value);
  return n === null ? fallback : n;
}

/** Optional numeric form field — undefined when blank. */
export function parseOptionalFormNumber(value: string): number | undefined {
  if (!value.trim()) return undefined;
  const n = parseLocalizedNumber(value);
  return n === null ? undefined : n;
}
