import { z } from "zod";

export const createPropertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  description: z.string().optional(),
  propertyTypeId: z.string().optional(),
  status: z.enum(["DRAFT", "AVAILABLE", "RESERVED", "SOLD", "OFF_MARKET"]).default("AVAILABLE"),
  purpose: z.string().optional(),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  area: z.number().optional(),
  price: z.number().min(0),
  currency: z.string().default("AED"),
  furnishing: z.string().optional(),
  paymentPlan: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  developerId: z.string().optional(),
  communityId: z.string().optional(),
});

export const updatePropertySchema = createPropertySchema.partial();
