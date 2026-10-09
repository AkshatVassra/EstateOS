import { prisma } from "@/lib/prisma";
import { Prisma } from "@estateos/database";

export class ConversationRepository {
  static async create(data: Prisma.ConversationUncheckedCreateInput) {
    return prisma.conversation.create({
      data,
    });
  }

  static async findById(id: string, agencyId: string) {
    return prisma.conversation.findFirst({
      where: { id, agencyId },
      include: {
        participants: true,
        tags: true,
        summaries: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 50,
          include: { attachments: true }
        }
      },
    });
  }

  static async findByPhone(agencyId: string, phone: string) {
    return prisma.conversation.findFirst({
      where: {
        agencyId,
        participants: {
          some: { phone }
        }
      },
      include: {
        participants: true
      }
    });
  }

  static async findAll(agencyId: string, params: { skip?: number; take?: number; status?: string }) {
    const where: Prisma.ConversationWhereInput = { agencyId };
    if (params.status) where.status = params.status;

    return prisma.conversation.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: { updatedAt: "desc" },
      include: { participants: true, tags: true },
    });
  }

  static async update(id: string, data: Prisma.ConversationUncheckedUpdateInput) {
    return prisma.conversation.update({
      where: { id },
      data,
    });
  }

  static async addParticipant(data: Prisma.ConversationParticipantUncheckedCreateInput) {
    return prisma.conversationParticipant.create({ data });
  }
}
