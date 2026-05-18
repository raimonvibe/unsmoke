import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CDC_BENEFITS_OVER_TIME,
  getHealthSource,
  HEALTH_SOURCES,
  WHO_CESSATION,
} from "./health-sources";
import { MILESTONES } from "./milestones";
import { assertUniqueIds } from "../test/assertions";

describe("health sources registry", () => {
  it("lists CDC and WHO reference URLs with required metadata", () => {
    assert.ok(HEALTH_SOURCES.length >= 3);
    for (const source of HEALTH_SOURCES) {
      assert.ok(source.url.startsWith("https://"), source.id);
      assert.ok(source.name.length > 0, source.id);
      assert.ok(source.note.length > 0, source.id);
    }
  });

  it("resolves sources by id", () => {
    assert.equal(getHealthSource(CDC_BENEFITS_OVER_TIME.id)?.url, CDC_BENEFITS_OVER_TIME.url);
    assert.equal(getHealthSource(WHO_CESSATION.id)?.name, WHO_CESSATION.name);
    assert.equal(getHealthSource("nonexistent"), undefined);
  });
});

describe("milestone source attribution", () => {
  const allowedSourceIds = new Set(HEALTH_SOURCES.map((s) => s.id));

  it("cites only registered CDC or WHO sources with a published timeframe", () => {
    for (const milestone of MILESTONES) {
      assert.ok(
        allowedSourceIds.has(milestone.sourceId),
        `${milestone.id}: unknown sourceId ${milestone.sourceId}`
      );
      assert.ok(
        milestone.publishedTimeframe?.includes("CDC") ||
          milestone.publishedTimeframe?.includes("WHO"),
        `${milestone.id}: timeframe should name CDC or WHO`
      );
    }
  });

  it("uses both CDC and WHO across the milestone catalog", () => {
    const sourceIds = new Set(MILESTONES.map((m) => m.sourceId));
    assert.ok(sourceIds.has(CDC_BENEFITS_OVER_TIME.id));
    assert.ok(sourceIds.has(WHO_CESSATION.id));
  });

  it("keeps milestone ids unique for citation and UI keys", () => {
    assertUniqueIds(MILESTONES, "MILESTONES");
  });
});
