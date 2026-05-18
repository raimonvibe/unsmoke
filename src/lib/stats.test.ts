import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getElapsedDays } from "./calculations";
import {
  formatChartDate,
  getCravingsPerDay,
  getLast7DaysCravings,
  getSmokeFreeStreakDays,
} from "./stats";
import { at, localDate, MS } from "../test/helpers";

describe("getCravingsPerDay", () => {
  it("groups timestamps by local calendar day and sorts ascending", () => {
    const timestamps = [
      localDate(2024, 5, 18, 10).toISOString(),
      localDate(2024, 5, 18, 20).toISOString(),
      localDate(2024, 5, 17, 15).toISOString(),
    ];

    assert.deepEqual(getCravingsPerDay(timestamps), [
      { date: "2024-06-17", count: 1 },
      { date: "2024-06-18", count: 2 },
    ]);
  });

  it("returns empty array when no cravings", () => {
    assert.deepEqual(getCravingsPerDay([]), []);
  });
});

describe("getLast7DaysCravings", () => {
  const anchor = localDate(2024, 5, 18, 12);

  it("returns exactly 7 days ending on anchor date", () => {
    const rows = getLast7DaysCravings([], anchor);
    assert.equal(rows.length, 7);
    assert.equal(rows[0].date, "2024-06-12");
    assert.equal(rows[6].date, "2024-06-18");
  });

  it("counts cravings on the correct local day", () => {
    const timestamps = [
      localDate(2024, 5, 18, 9).toISOString(),
      localDate(2024, 5, 18, 21).toISOString(),
      localDate(2024, 5, 16, 12).toISOString(),
    ];

    const rows = getLast7DaysCravings(timestamps, anchor);
    const byDate = Object.fromEntries(rows.map((r) => [r.date, r.count]));

    assert.equal(byDate["2024-06-18"], 2);
    assert.equal(byDate["2024-06-16"], 1);
    assert.equal(byDate["2024-06-17"], 0);
  });
});

describe("getSmokeFreeStreakDays", () => {
  const quit = localDate(2024, 0, 1);

  it("delegates to elapsed whole days from calculations", () => {
    assert.equal(getSmokeFreeStreakDays(quit, at(quit, 23 * MS.hour)), 0);
    assert.equal(getSmokeFreeStreakDays(quit, at(quit, 25 * MS.hour)), 1);
    assert.equal(
      getSmokeFreeStreakDays(quit, at(quit, MS.day)),
      getElapsedDays(quit, at(quit, MS.day))
    );
  });
});

describe("formatChartDate", () => {
  it("formats YYYY-MM-DD as a weekday label", () => {
    assert.equal(formatChartDate("2024-06-18"), "Tue");
  });
});
