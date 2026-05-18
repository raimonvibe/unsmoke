import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatMl } from "./format-display";
import {
  formatNicotineMg,
  getConsumptionStats,
  getDailyCost,
  getTotalMoneySaved,
} from "./usage";
import { at, MS } from "../test/helpers";
import {
  CIGARETTES,
  quitData,
  QUIT,
  TOBACCO_LABELED,
  TOBACCO_MEDIUM,
  VAPING,
} from "../test/fixtures";

describe("getDailyCost", () => {
  it("sums each product daily cost", () => {
    assert.equal(
      getDailyCost(quitData({ cigarettes: CIGARETTES })),
      10
    );
    assert.equal(getDailyCost(quitData({ vaping: VAPING })), 3);
    assert.equal(getDailyCost(quitData({ tobacco: TOBACCO_MEDIUM })), 1.2);
    assert.equal(
      getDailyCost(
        quitData({
          cigarettes: { perDay: 10, costPerUnit: 0.5 },
          vaping: VAPING,
          tobacco: TOBACCO_MEDIUM,
        })
      ),
      5 + 3 + 1.2
    );
  });
});

describe("getTotalMoneySaved", () => {
  it("equals daily cost × elapsed fractional days", () => {
    const all = quitData({
      cigarettes: { perDay: 10, costPerUnit: 0.5 },
      vaping: VAPING,
    });
    assert.equal(getTotalMoneySaved(all, QUIT, at(QUIT, MS.day)), 8);
    assert.equal(
      getTotalMoneySaved(quitData({ tobacco: TOBACCO_MEDIUM }), QUIT, at(QUIT, MS.day)),
      1.2
    );
  });
});

describe("getConsumptionStats", () => {
  it("returns only stats for configured products", () => {
    const c = getConsumptionStats(quitData({ cigarettes: CIGARETTES }), QUIT, QUIT);
    assert.equal(c.length, 1);
    assert.equal(c[0].label, "Cigarettes avoided");

    const v = getConsumptionStats(
      quitData({ vaping: VAPING }),
      QUIT,
      at(QUIT, 5 * MS.day)
    );
    assert.deepEqual(
      v.map((s) => s.label),
      ["E-liquid avoided", "Nicotine (vape)", "Bottles avoided"]
    );
    assert.equal(v[0].value, "10 ml");
    assert.equal(v[1].value, "200 mg");
    assert.equal(v[2].value, "1");
  });

  it("tobacco stats use estimated nicotine without pack label", () => {
    const t = getConsumptionStats(
      quitData({ tobacco: TOBACCO_MEDIUM }),
      QUIT,
      at(QUIT, 10 * MS.day)
    );
    assert.equal(t[0].value, "50 g");
    assert.equal(t[1].label, "Nicotine (tobacco, est.)");
    assert.equal(t[1].value, "600 mg");
    assert.equal(t[1].hint, "Estimated from blend");
    assert.equal(t[2].value, "1");
  });

  it("tobacco stats use pack label nicotine when provided", () => {
    const t = getConsumptionStats(
      quitData({ tobacco: TOBACCO_LABELED }),
      QUIT,
      at(QUIT, MS.day)
    );
    assert.equal(t[1].label, "Nicotine (tobacco, pack)");
    assert.equal(t[1].value, "70 mg");
    assert.equal(t[1].hint, "From pack label");
  });

  it("shows zero bottles and packages before a full unit", () => {
    const v = getConsumptionStats(
      quitData({ vaping: VAPING }),
      QUIT,
      at(QUIT, MS.day)
    );
    assert.equal(v[2].value, "0");

    const t = getConsumptionStats(
      quitData({ tobacco: TOBACCO_MEDIUM }),
      QUIT,
      at(QUIT, MS.day)
    );
    assert.equal(t[2].value, "0");
  });

  it("dashboard values match raw calculations", () => {
    const now = at(QUIT, 5 * MS.day);
    const v = getConsumptionStats(quitData({ vaping: VAPING }), QUIT, now);
    assert.equal(v[0].value, formatMl(2 * 5));
    assert.equal(v[1].value, formatNicotineMg(40 * 5));
    assert.equal(v[2].value, "1");
    assert.equal(v[1].hint, "From strength on bottle");
  });
});

describe("formatNicotineMg", () => {
  it("formats mg and g readably", () => {
    assert.equal(formatNicotineMg(8.5), "8.5 mg");
    assert.equal(formatNicotineMg(850), "850 mg");
    assert.equal(formatNicotineMg(1500), "1.5 g");
  });
});
