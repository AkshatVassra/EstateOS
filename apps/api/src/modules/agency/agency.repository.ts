import { prisma } from "@/lib/prisma";
import { Prisma } from "@estateos/database";

export class AgencyRepository {
  static async create(data: Prisma.AgencyCreateInput) {
    return prisma.agency.create({
      data,
    });
  }

  static async findById(id: string) {
    return prisma.agency.findUnique({
      where: { id },
      include: {
        settings: true,
      },
    });
  }

  static async findBySlug(slug: string) {
    return prisma.agency.findUnique({
      where: { slug },
    });
  }

  static async findAll(params: { skip?: number; take?: number }) {
    return prisma.agency.findMany({
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
    });
  }

  static async update(id: string, data: Prisma.AgencyUpdateInput) {
    return prisma.agency.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.agency.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: "DELETED",
      },
    });
  }

  static async updateSettings(agencyId: string, data: Prisma.AgencySettingsUpdateInput) {
    return prisma.agencySettings.upsert({
      where: { agencyId },
      update: data,
      create: {
        agencyId,
        data: data.data ?? {},
      },
    });
  }
}
