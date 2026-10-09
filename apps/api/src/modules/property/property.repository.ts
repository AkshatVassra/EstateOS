import { prisma } from "@/lib/prisma";
import { Prisma, PropertyStatus } from "@estateos/database";

export class PropertyRepository {
  static async create(data: Prisma.PropertyUncheckedCreateInput) {
    return prisma.property.create({
      data,
    });
  }

  static async findById(id: string, agencyId: string) {
    return prisma.property.findFirst({
      where: { id, agencyId },
      include: {
        images: { orderBy: { orderNo: "asc" } },
        documents: true,
        developerRel: true,
        communityRel: true,
      },
    });
  }

  static async findAll(agencyId: string, params: { skip?: number; take?: number; status?: PropertyStatus }) {
    const where: Prisma.PropertyWhereInput = { agencyId };
    if (params.status) where.status = params.status;

    return prisma.property.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
      include: { developerRel: true, communityRel: true, images: { take: 1 } },
    });
  }

  static async update(id: string, agencyId: string, data: Prisma.PropertyUncheckedUpdateInput) {
    const property = await prisma.property.findFirst({ where: { id, agencyId }, select: { id: true } });
    if (!property) throw new Error("Property not found for agency");
    return prisma.property.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string, agencyId: string) {
    const property = await prisma.property.findFirst({ where: { id, agencyId }, select: { id: true } });
    if (!property) throw new Error("Property not found for agency");
    return prisma.property.delete({
      where: { id },
    });
  }
}
