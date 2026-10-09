import { z } from "zod";

export const generateReplySchema = z.object({
  leadId: z.string().uuid(),
  context: z.string().optional(),
});

export const generateSummarySchema = z.object({
  leadId: z.string().uuid(),
});

export const generateRecommendSchema = z.object({
  leadId: z.string().uuid(),
  preferences: z.string().optional(),
});

export const generateCaptionSchema = z.object({
  propertyId: z.string().uuid(),
  platform: z.enum(["INSTAGRAM", "FACEBOOK", "LINKEDIN", "TWITTER"]).default("INSTAGRAM"),
  tone: z.string().optional(),
});
