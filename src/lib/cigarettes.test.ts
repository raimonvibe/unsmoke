import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getCigaretteCostPerDay } from "./cigarettes";
import { CIGARETTES } from "../test/fixtures";

describe("cigarettes", () => {
  it("daily cost = cigarettes per day × cost per cigarette", () => {
    assert.equal(getCigaretteCostPerDay(CIGARETTES), 10);
  });
});
