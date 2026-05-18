import assert from "node:assert/strict";

/** Fail when any duplicate `id` values appear in a list. */
export function assertUniqueIds<T extends { id: string }>(
  items: T[],
  label = "items"
): void {
  const seen = new Set<string>();
  const duplicates: string[] = [];
  for (const item of items) {
    if (seen.has(item.id)) duplicates.push(item.id);
    seen.add(item.id);
  }
  assert.equal(
    duplicates.length,
    0,
    `${label}: duplicate ids — ${duplicates.join(", ")}`
  );
}

/** Fail when durations are not strictly increasing (catalog sort order). */
export function assertStrictlyAscendingDurations(
  items: { id: string; durationMs: number }[]
): void {
  for (let i = 1; i < items.length; i++) {
    assert.ok(
      items[i].durationMs > items[i - 1].durationMs,
      `expected ${items[i].id} (${items[i].durationMs}ms) after ${items[i - 1].id} (${items[i - 1].durationMs}ms)`
    );
  }
}

/** Round-trip check for percentage progress: round(achieved / total × 100). */
export function assertPercentProgress(
  achieved: number,
  total: number,
  actual: number
): void {
  const expected = Math.round((achieved / total) * 100);
  assert.equal(
    actual,
    expected,
    `progress ${actual}% should be round(${achieved}/${total}×100)=${expected}%`
  );
}
