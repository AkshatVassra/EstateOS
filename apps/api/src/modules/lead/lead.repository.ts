import { prisma } from "@/lib/prisma";
import { LeadStatus, Prisma } from "@estateos/database";

export class LeadRepository {
  static async create(data: Prisma.LeadUncheckedCreateInput) {
    return prisma.lead.create({
      data,
    });
  }

  static async findById(id: string, agencyId: string) {
    return prisma.lead.findFirst({
      where: { id, agencyId },
      include: {
        assignedUser: true,
        leadNotes: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
        },
        leadTags: true,
        activities: {
          orderBy: { createdAt: "desc" },
        }
      },
    });
  }

  static async findAll(agencyId: string, params: { skip?: number; take?: number; status?: LeadStatus }) {
    const where: Prisma.LeadWhereInput = { agencyId };
    if (params.status) where.status = params.status;

    return prisma.lead.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
      include: { assignedUser: true, leadTags: true },
    });
  }

  static async update(id: string, agencyId: string, data: Prisma.LeadUncheckedUpdateInput) {
    const lead = await prisma.lead.findFirst({ where: { id, agencyId }, select: { id: true } });
    if (!lead) throw new Error("Lead not found for agency");
    return prisma.lead.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string, agencyId: string) {
    const lead = await prisma.lead.findFirst({ where: { id, agencyId }, select: { id: true } });
    if (!lead) throw new Error("Lead not found for agency");
    return prisma.lead.delete({
      where: { id },
    });
  }

  static async addNote(data: Prisma.LeadNoteUncheckedCreateInput) {
    return prisma.leadNote.create({ data });
  }

  static async addActivity(data: Prisma.LeadActivityUncheckedCreateInput) {
    return prisma.leadActivity.create({ data });
  }
}
