import { ApiError } from "@/utils/api-error";
import { CalendarRepository } from "./calendar.repository";
import { Prisma } from "@estateos/database";

export class CalendarService {
  static async createAppointment(
    agencyId: string,
    data: Omit<Prisma.AppointmentUncheckedCreateInput, "agencyId" | "date"> & { date: string | Date },
  ) {
    return CalendarRepository.create({
      ...data,
      agencyId,
      date: new Date(data.date),
    });
  }

  static async getAllAppointments(agencyId: string) {
    return CalendarRepository.findAll(agencyId);
  }

  static async deleteAppointment(id: string, agencyId: string) {
    const apt = await CalendarRepository.findById(id, agencyId);
    if (!apt) throw ApiError.notFound("Appointment not found");
    return CalendarRepository.delete(id, agencyId);
  }
}
