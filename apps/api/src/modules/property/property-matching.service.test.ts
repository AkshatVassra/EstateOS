import assert from "node:assert/strict";
import test from "node:test";
import { PropertyMatchingService } from "./property-matching.service";

test("ranks a property with matching budget, bedrooms, and location highly", () => {
  const result = PropertyMatchingService.score(
    { budgetMax: 2500000, bedrooms: 3, preferredAreas: ["Dubai Hills"], propertyType: "villa" },
    {
      id: "property-1",
      title: "Hills Villa",
      price: 2450000,
      bedrooms: 3,
      propertyTypeId: "villa",
      community: "Dubai Hills",
      amenitiesLinks: [{ amenity: "POOL" }],
    },
  );

  assert.ok(result.score >= 80);
  assert.ok(result.reasons.includes("Preferred location"));
  assert.ok(result.reasons.includes("Exact bedroom match"));
});

test("does not award location points for an unrelated community", () => {
  const result = PropertyMatchingService.score(
    { budgetMax: 2000000, preferredAreas: ["Dubai Hills"] },
    {
      id: "property-2",
      title: "Marina Apartment",
      price: 2000000,
      bedrooms: 2,
      community: "Dubai Marina",
    },
  );

  assert.equal(result.reasons.includes("Preferred location"), false);
});
