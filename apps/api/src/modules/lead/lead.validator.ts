import { z } from "zod";

export const createLeadSchema = z.object({
  phone: z.string().min(1, "Phone is required"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  nationality: z.string().optional(),
  budget: z.number().optional(),
  budgetMin: z.number().optional(),
  budgetMax: z.number().optional(),
  propertyType: z.string().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  location: z.string().optional(),
  timeline: z.string().optional(),
  purpose: z.string().optional(),
  notes: z.string().optional(),
  source: z.string().optional(),
});

export const updateLeadSchema = createLeadSchema.partial();

export const assignLeadSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
});

export const createLeadNoteSchema = z.object({
  note: z.string().min(1, "Note cannot be empty"),
});
