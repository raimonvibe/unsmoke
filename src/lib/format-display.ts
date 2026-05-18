/**
 * Consistent display formatting for dashboard indicators.
 * Raw values come from calculations; these only control presentation.
 */

export function formatUnitAmount(
  value: number,
  unit: string,
  options?: { decimalsBelow?: number }
): string {
  const decimalsBelow = options?.decimalsBelow ?? 10;
  if (value <= 0) return `0 ${unit}`;
  if (value < decimalsBelow) return `${value.toFixed(1)} ${unit}`;
  const rounded = Math.round(value);
  if (Math.abs(value - rounded) < 0.05) return `${rounded} ${unit}`;
  return `${value.toFixed(1)} ${unit}`;
}

export function formatMl(ml: number): string {
  return formatUnitAmount(ml, "ml");
}

export function formatGrams(grams: number): string {
  return formatUnitAmount(grams, "g");
}

export function formatNicotineMg(mg: number): string {
  if (mg <= 0) return "0 mg";
  if (mg >= 1000) return `${(mg / 1000).toFixed(1)} g`;
  if (mg < 10) return `${mg.toFixed(1)} mg`;
  const rounded = Math.round(mg);
  if (Math.abs(mg - rounded) < 0.05) return `${rounded} mg`;
  return `${mg.toFixed(1)} mg`;
}

export function formatWholeUnits(count: number): string {
  return new Intl.NumberFormat().format(Math.max(0, Math.floor(count)));
}
