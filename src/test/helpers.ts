/** Shared fixtures for lib unit tests. */

export const MS = {
  second: 1_000,
  minute: 60_000,
  hour: 3_600_000,
  day: 86_400_000,
} as const;

export function at(base: Date, offsetMs: number): Date {
  return new Date(base.getTime() + offsetMs);
}

/** Local midnight-friendly date (month is 0-indexed). */
export function localDate(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0
): Date {
  return new Date(year, month, day, hour, minute, 0, 0);
}
