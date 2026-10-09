import { z } from "zod";

export const createAppointmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().datetime(),
});

export const updateAppointmentSchema = createAppointmentSchema.partial();
