import { prisma } from "@/lib/prisma";
import { Prisma } from "@estateos/database";

export class CalendarRepository {
  static async create(data: Prisma.AppointmentUncheckedCreateInput) {
    return prisma.appointment.create({ data });
  }

  static async findAll(agencyId: string) {
    return prisma.appointment.findMany({
      where: { agencyId },
      orderBy: { date: "asc" },
    });
  }

  static async findById(id: string, agencyId: string) {
    return prisma.appointment.findFirst({
      where: { id, agencyId },
    });
  }

  static async delete(id: string, agencyId: string) {
    const appointment = await prisma.appointment.findFirst({ where: { id, agencyId }, select: { id: true } });
    if (!appointment) throw new Error("Appointment not found for agency");
    return prisma.appointment.delete({
      where: { id },
    });
  }
}
