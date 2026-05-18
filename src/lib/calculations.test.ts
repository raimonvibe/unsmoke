import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getCigarettesAvoided,
  getElapsedDays,
  getElapsedFractionalDays,
  getElapsedMs,
  getMoneySaved,
  getTimeSinceQuit,
  MS_PER_DAY,
  scaleByElapsedDays,
  scaleByElapsedDaysFloored,
} from "./calculations";
import { at, MS } from "../test/helpers";
import { CIGARETTES, QUIT } from "../test/fixtures";

/**
 * Core time and scaling primitives used by usage stats and milestone unlocks.
 * Milestone-specific behavior lives in calculations-milestones.test.ts.
 */

describe("elapsed time", () => {
  it("decomposes stopwatch duration into days through seconds", () => {
    const now = at(QUIT, 2 * MS.day + 3 * MS.hour + 4 * MS.minute + 5 * MS.second);
    assert.deepEqual(getTimeSinceQuit(QUIT, now), {
      days: 2,
      hours: 3,
      minutes: 4,
      seconds: 5,
      totalMs: 2 * MS.day + 3 * MS.hour + 4 * MS.minute + 5 * MS.second,
    });
  });

  it("clamps elapsed ms to zero before quit date", () => {
    assert.equal(getElapsedFractionalDays(QUIT, at(QUIT, -MS.hour)), 0);
    assert.equal(getElapsedMs(QUIT, at(QUIT, -MS.hour)), 0);
    assert.deepEqual(getTimeSinceQuit(QUIT, at(QUIT, -MS.hour)), {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
    });
  });

  it("whole days match time-since-quit days field", () => {
    const now = at(QUIT, 25 * MS.hour);
    assert.equal(getElapsedDays(QUIT, now), 1);
    assert.equal(getElapsedDays(QUIT, now), getTimeSinceQuit(QUIT, now).days);
  });

  it("uses a fixed ms-per-day constant for fractional days", () => {
    const halfDay = at(QUIT, 12 * MS.hour);
    assert.equal(getElapsedMs(QUIT, halfDay), 12 * MS.hour);
    assert.equal(getElapsedFractionalDays(QUIT, halfDay), 0.5);
    assert.equal(MS_PER_DAY, 86_400_000);
  });
});

describe("scaleByElapsedDays", () => {
  it("scales daily rates with fractional days (money, ml, nicotine)", () => {
    assert.equal(scaleByElapsedDays(10, QUIT, at(QUIT, 12 * MS.hour)), 5);
    assert.equal(scaleByElapsedDays(10, QUIT, at(QUIT, MS.day)), 10);
    assert.equal(scaleByElapsedDays(0, QUIT, at(QUIT, MS.day)), 0);
  });

  it("floors whole-unit counts (cigarettes, bottles, packages)", () => {
    assert.equal(scaleByElapsedDaysFloored(20, QUIT, at(QUIT, MS.hour)), 0);
    assert.equal(scaleByElapsedDaysFloored(20, QUIT, at(QUIT, 12 * MS.hour)), 10);
    assert.equal(
      scaleByElapsedDaysFloored(20, QUIT, at(QUIT, MS.day + MS.hour)),
      20
    );
  });

  it("never returns negative scaled values when quit is in the future", () => {
    assert.equal(scaleByElapsedDays(100, QUIT, at(QUIT, -MS.day)), 0);
    assert.equal(scaleByElapsedDaysFloored(100, QUIT, at(QUIT, -MS.day)), 0);
  });
});

describe("cigarette savings (legacy calculation path)", () => {
  const costPerDay = CIGARETTES.perDay * CIGARETTES.costPerUnit;

  it("money saved = cost per day × elapsed fractional days", () => {
    assert.equal(getMoneySaved(QUIT, costPerDay, at(QUIT, 12 * MS.hour)), 5);
    assert.equal(getMoneySaved(QUIT, costPerDay, at(QUIT, MS.day)), 10);
  });

  it("cigarettes avoided uses floor of fractional consumption", () => {
    assert.equal(getCigarettesAvoided(QUIT, CIGARETTES.perDay, at(QUIT, MS.hour)), 0);
    assert.equal(getCigarettesAvoided(QUIT, CIGARETTES.perDay, at(QUIT, MS.day)), 20);
    assert.equal(
      getCigarettesAvoided(QUIT, CIGARETTES.perDay, at(QUIT, MS.day + 12 * MS.hour)),
      30
    );
  });
});
