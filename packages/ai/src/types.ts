export type AIProviderName = "anthropic" | "openai" | "google" | "mock";

export interface CompletionRequest {
  system: string;
  messages: { role: "user" | "assistant"; content: string }[];
  maxTokens?: number;
  temperature?: number;
}

export interface CompletionResult {
  text: string;
  provider: AIProviderName;
  model: string;
}

export interface LeadSlots {
  budgetMin?: number;
  budgetMax?: number;
  bedrooms?: number;
  preferredAreas?: string[];
  nationality?: string;
  intent?: string;
  paymentType?: string;
  timelineDays?: number;
  score?: number;
  temperature?: "COLD" | "WARM" | "HOT";
  nextAction?: string;
}

export interface QualificationResult {
  reply: string;
  slots: LeadSlots;
}
