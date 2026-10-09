import { prisma } from "@/lib/prisma";
import { Prisma } from "@estateos/database";

export class UserRepository {
  static async create(data: Prisma.UserUncheckedCreateInput) {
    return prisma.user.create({
      data,
    });
  }

  static async findById(id: string, agencyId: string) {
    return prisma.user.findFirst({
      where: { id, agencyId },
      include: {
        role: true,
      },
    });
  }

  static async findAll(agencyId: string, params: { skip?: number; take?: number }) {
    return prisma.user.findMany({
      where: { agencyId },
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
      include: {
        role: true,
      },
    });
  }

  static async update(id: string, agencyId: string, data: Prisma.UserUpdateInput) {
    const user = await prisma.user.findFirst({ where: { id, agencyId }, select: { id: true } });
    if (!user) throw new Error("User not found for agency");
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string, agencyId: string) {
    const user = await prisma.user.findFirst({ where: { id, agencyId }, select: { id: true } });
    if (!user) throw new Error("User not found for agency");
    return prisma.user.update({
      where: { id },
      data: {
        status: "DELETED",
        isActive: false,
      },
    });
  }
}
