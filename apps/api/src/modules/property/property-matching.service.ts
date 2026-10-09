type LeadMatchProfile = {
  budgetMin?: unknown;
  budgetMax?: unknown;
  budget?: unknown;
  bedrooms?: number | null;
  preferredAreas?: unknown;
  propertyType?: string | null;
  purpose?: string | null;
};

type PropertyMatchCandidate = {
  id: string;
  title: string;
  price: unknown;
  bedrooms: number;
  propertyTypeId?: string | null;
  purpose?: string | null;
  community?: string | null;
  communityRel?: { name: string } | null;
  amenities?: unknown;
  amenitiesLinks?: Array<{ amenity: string }>;
};

export class PropertyMatchingService {
  static score(lead: LeadMatchProfile, property: PropertyMatchCandidate) {
    const reasons: string[] = [];
    const price = Number(property.price);
    const budgetMin = Number(lead.budgetMin ?? 0);
    const budgetMax = Number(lead.budgetMax ?? lead.budget ?? 0);
    const referenceBudget = budgetMax || budgetMin;
    let score = 0;

    if (referenceBudget > 0) {
      const variance = Math.abs(price - referenceBudget) / referenceBudget;
      if (variance <= 0.05) { score += 40; reasons.push("Within the target budget"); }
      else if (variance <= 0.1) { score += 30; reasons.push("Close to the target budget"); }
      else if (variance <= 0.2) { score += 18; reasons.push("Within an acceptable budget range"); }
    }

    if (lead.bedrooms != null) {
      if (property.bedrooms === lead.bedrooms) { score += 20; reasons.push("Exact bedroom match"); }
      else if (Math.abs(property.bedrooms - lead.bedrooms) === 1) { score += 10; reasons.push("Within one bedroom"); }
    }

    const community = (property.communityRel?.name ?? property.community ?? "").toLowerCase();
    const areas = this.toStrings(lead.preferredAreas).map((area) => area.toLowerCase());
    if (community && areas.some((area) => community.includes(area) || area.includes(community))) {
      score += 20;
      reasons.push("Preferred location");
    }

    const amenities = property.amenitiesLinks?.map((item) => item.amenity) ?? this.toStrings(property.amenities);
    if (amenities.length > 0) {
      score += Math.min(10, amenities.length);
      reasons.push("Available amenities");
    }

    if (lead.propertyType && property.propertyTypeId && lead.propertyType.toLowerCase() === property.propertyTypeId.toLowerCase()) {
      score += 10;
      reasons.push("Property type match");
    }

    return { score: Math.min(100, score), reasons };
  }

  private static toStrings(value: unknown): string[] {
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  }
}
