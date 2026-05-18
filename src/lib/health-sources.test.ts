import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { HEALTH_SOURCES } from "./health-sources";
import { MILESTONES, MILESTONE_SOURCE } from "./milestones";

describe("health sources", () => {
  it("lists CDC and WHO reference URLs", () => {
    assert.ok(HEALTH_SOURCES.length >= 3);
    for (const s of HEALTH_SOURCES) {
      assert.ok(s.url.startsWith("https://"));
      assert.ok(s.name.length > 0);
    }
  });

  it("every milestone cites the CDC benefits-over-time source", () => {
    for (const m of MILESTONES) {
      assert.equal(m.sourceId, MILESTONE_SOURCE.id);
      assert.ok(m.publishedTimeframe?.includes("CDC"));
    }
  });
});
