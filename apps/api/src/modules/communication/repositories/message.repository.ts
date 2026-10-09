import { prisma } from "@/lib/prisma";
import { Prisma } from "@estateos/database";

export class MessageRepository {
  static async create(data: Prisma.MessageUncheckedCreateInput) {
    return prisma.message.create({
      data,
    });
  }

  static async findById(id: string) {
    return prisma.message.findUnique({
      where: { id },
      include: { attachments: true, statuses: true, reactions: true }
    });
  }

  static async findByProviderId(providerMessageId: string) {
    return prisma.message.findFirst({
      where: { providerMessageId },
    });
  }

  static async updateStatus(id: string, status: string) {
    return prisma.message.update({
      where: { id },
      data: { status },
    });
  }

  static async createStatus(data: Prisma.MessageStatusUncheckedCreateInput) {
    return prisma.messageStatus.create({ data });
  }

  static async createAttachment(data: Prisma.AttachmentUncheckedCreateInput) {
    return prisma.attachment.create({ data });
  }
}
