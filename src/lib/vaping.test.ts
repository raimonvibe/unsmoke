import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatMl,
  getBottlesAvoided,
  getMlAvoided,
  getNicotineMgAvoided,
  getNicotineMgPerBottle,
  getVapingCostPerDay,
  getVapingCostPerMl,
  getVapingNicotineMgPerDay,
} from "./vaping";
import { at, MS } from "../test/helpers";
import { QUIT, VAPING } from "../test/fixtures";

describe("vaping daily rates", () => {
  it("cost per ml = bottle price ÷ bottle ml", () => {
    assert.equal(getVapingCostPerMl(VAPING), 1.5);
  });

  it("daily cost = ml per day × cost per ml", () => {
    assert.equal(getVapingCostPerDay(VAPING), 3);
  });

  it("daily nicotine = ml per day × mg per ml", () => {
    assert.equal(getVapingNicotineMgPerDay(VAPING), 40);
  });

  it("nicotine per bottle = bottle ml × mg per ml", () => {
    assert.equal(getNicotineMgPerBottle(VAPING), 200);
  });
});

describe("vaping avoided", () => {
  it("ml and nicotine scale with fractional days", () => {
    assert.equal(getMlAvoided(QUIT, VAPING, at(QUIT, 12 * MS.hour)), 1);
    assert.equal(getNicotineMgAvoided(QUIT, VAPING, at(QUIT, 12 * MS.hour)), 20);
  });

  it("bottles avoided = floor(elapsed days × bottles per day)", () => {
    // 2 ml/day ÷ 10 ml/bottle = 0.2 bottles/day
    assert.equal(getBottlesAvoided(QUIT, VAPING, at(QUIT, 4 * MS.day)), 0);
    assert.equal(getBottlesAvoided(QUIT, VAPING, at(QUIT, 5 * MS.day)), 1);
    assert.equal(getBottlesAvoided(QUIT, VAPING, at(QUIT, MS.day)), 0);
  });
});

describe("formatMl", () => {
  it("formats ml readably", () => {
    assert.equal(formatMl(1.25), "1.3 ml");
    assert.equal(formatMl(42.7), "42.7 ml");
    assert.equal(formatMl(10), "10 ml");
  });
});
