import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  leadId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  dueAt: z.string().datetime().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
});

export const updateTaskSchema = createTaskSchema.partial();
