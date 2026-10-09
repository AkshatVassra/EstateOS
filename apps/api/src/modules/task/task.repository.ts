import { prisma } from "@/lib/prisma";
import { Prisma, TaskStatus } from "@estateos/database";

export class TaskRepository {
  static async create(data: Prisma.TaskUncheckedCreateInput) {
    return prisma.task.create({ data });
  }

  static async findById(id: string, agencyId: string) {
    return prisma.task.findFirst({
      where: { id, agencyId },
      include: {
        lead: true,
        user: true,
        comments: true,
        checklists: true,
      },
    });
  }

  static async findAll(agencyId: string, params: { skip?: number; take?: number; status?: TaskStatus; leadId?: string }) {
    const where: Prisma.TaskWhereInput = { agencyId };
    if (params.status) where.status = params.status;
    if (params.leadId) where.leadId = params.leadId;

    return prisma.task.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
      include: { lead: true, user: true },
    });
  }

  static async update(id: string, agencyId: string, data: Prisma.TaskUncheckedUpdateInput) {
    const task = await prisma.task.findFirst({ where: { id, agencyId }, select: { id: true } });
    if (!task) throw new Error("Task not found for agency");
    return prisma.task.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string, agencyId: string) {
    const task = await prisma.task.findFirst({ where: { id, agencyId }, select: { id: true } });
    if (!task) throw new Error("Task not found for agency");
    return prisma.task.delete({
      where: { id },
    });
  }
}
