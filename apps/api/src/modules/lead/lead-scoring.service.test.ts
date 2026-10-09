import assert from "node:assert/strict";
import test from "node:test";
import { LeadScoringService } from "./lead-scoring.service";

test("scores a complete urgent buyer as hot", () => {
  const result = LeadScoringService.calculate({
    budgetMax: 2500000,
    timelineDays: 14,
    bedrooms: 3,
    preferredAreas: ["Dubai Hills"],
    intent: "VIEWING",
    messageCount: 5,
    viewingRequested: true,
  });

  assert.equal(result.temperature, "HOT");
  assert.ok(result.score >= 75);
  assert.equal(result.factors.budgetClarity, 20);
});

test("keeps an unqualified first message cold", () => {
  const result = LeadScoringService.calculate({ messageCount: 1 });

  assert.equal(result.temperature, "COLD");
  assert.ok(result.score < 40);
});

test("scores a partially qualified buyer as warm", () => {
  const result = LeadScoringService.calculate({
    budget: 1500000,
    timelineDays: 60,
    bedrooms: 2,
    preferredAreas: ["Marina"],
    intent: "INTERESTED",
    messageCount: 2,
  });

  assert.equal(result.temperature, "WARM");
  assert.ok(result.score >= 40 && result.score < 75);
});
