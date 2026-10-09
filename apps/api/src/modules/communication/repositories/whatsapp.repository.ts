import { prisma } from "@/lib/prisma";
import { Prisma } from "@estateos/database";
import { decryptWhatsAppToken, isEncryptedWhatsAppToken } from "../token-crypto";

export class WhatsappRepository {
  static async create(data: Prisma.WhatsAppAccountUncheckedCreateInput) {
    return prisma.whatsAppAccount.create({
      data,
    });
  }

  static async findByPhoneNumberId(phoneNumberId: string) {
    return prisma.whatsAppAccount.findFirst({
      where: { phoneNumberId, status: "ACTIVE" },
      include: { agency: true }
    });
  }

  static async findByAgencyId(agencyId: string) {
    return prisma.whatsAppAccount.findFirst({
      where: { agencyId, status: "ACTIVE" },
    });
  }

  static async getActiveAccessToken(phoneNumberId: string): Promise<string | null> {
    const account = await this.findByPhoneNumberId(phoneNumberId);
    if (account?.accessTokenEncrypted) {
      try {
        if (isEncryptedWhatsAppToken(account.accessTokenEncrypted)) {
          return decryptWhatsAppToken(account.accessTokenEncrypted);
        }
        if (account.accessTokenEncrypted.length > 50) {
          return account.accessTokenEncrypted;
        }
      } catch (err) {
        console.warn("[WhatsApp] Could not decrypt stored token, falling back to environment variable:", err instanceof Error ? err.message : err);
      }
    }
    return process.env.META_ACCESS_TOKEN || null;
  }

  static async update(id: string, data: Prisma.WhatsAppAccountUncheckedUpdateInput) {
    return prisma.whatsAppAccount.update({
      where: { id },
      data,
    });
  }

  static async logWebhook(data: Prisma.WebhookLogUncheckedCreateInput) {
    return prisma.webhookLog.create({ data });
  }
}
