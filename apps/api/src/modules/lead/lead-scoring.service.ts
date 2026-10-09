import { LeadTemperature } from "@estateos/database";

type LeadScoringInput = {
  budget?: unknown;
  budgetMin?: unknown;
  budgetMax?: unknown;
  timelineDays?: number | null;
  bedrooms?: number | null;
  preferredAreas?: unknown;
  intent?: string | null;
  messageCount?: number;
  viewingRequested?: boolean;
};

export type LeadScoreResult = {
  score: number;
  temperature: LeadTemperature;
  factors: {
    budgetClarity: number;
    timelineUrgency: number;
    engagement: number;
    qualification: number;
    intent: number;
  };
};

export class LeadScoringService {
  static calculate(input: LeadScoringInput): LeadScoreResult {
    const budget = Number(input.budgetMax ?? input.budgetMin ?? input.budget ?? 0);
    const budgetClarity = budget > 0 ? 20 : 0;
    const timelineUrgency = this.timelineScore(input.timelineDays);
    const engagement = Math.min(15, Math.max(0, (input.messageCount ?? 0) * 3));
    const qualification = [
      budget > 0,
      Boolean(input.bedrooms),
      this.hasPreferredArea(input.preferredAreas),
      input.timelineDays != null,
    ].filter(Boolean).length * 6.25;
    const intent = input.viewingRequested || this.isHighIntent(input.intent) ? 20 : this.isMediumIntent(input.intent) ? 12 : 4;
    const score = Math.round(Math.min(100, budgetClarity + timelineUrgency + engagement + qualification + intent));

    return {
      score,
      temperature: score >= 75 ? LeadTemperature.HOT : score >= 40 ? LeadTemperature.WARM : LeadTemperature.COLD,
      factors: { budgetClarity, timelineUrgency, engagement, qualification, intent },
    };
  }

  private static timelineScore(timelineDays?: number | null) {
    if (timelineDays == null) return 0;
    if (timelineDays <= 14) return 20;
    if (timelineDays <= 30) return 16;
    if (timelineDays <= 60) return 10;
    return 5;
  }

  private static hasPreferredArea(value: unknown) {
    return Array.isArray(value) ? value.length > 0 : typeof value === "string" && value.trim().length > 0;
  }

  private static isHighIntent(value?: string | null) {
    return ["BUY", "VIEWING", "VIEW", "HIGH", "URGENT"].includes((value ?? "").toUpperCase());
  }

  private static isMediumIntent(value?: string | null) {
    return ["QUALIFIED", "INTERESTED", "FOLLOW_UP", "MEDIUM"].includes((value ?? "").toUpperCase());
  }
}
