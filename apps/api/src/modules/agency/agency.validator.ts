import { z } from "zod";

export const createAgencySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  website: z.string().url("Invalid URL").optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  companySize: z.string().optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
});

export const updateAgencySchema = createAgencySchema.partial();

export const updateAgencySettingsSchema = z.object({
  language: z.string().optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
  theme: z.string().optional(),
});
