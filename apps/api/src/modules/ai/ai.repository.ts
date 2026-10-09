import { prisma } from "@/lib/prisma";
import { Prisma } from "@estateos/database";

export class AiRepository {
  static async logConversation(data: Prisma.AIConversationUncheckedCreateInput) {
    return prisma.aIConversation.create({ data });
  }

  static async logUsage(agencyId: string, tokens: number) {
    return prisma.aIUsageLog.create({
      data: {
        agencyId,
        tokens,
      },
    });
  }

  static async saveSummary(leadId: string, summary: string) {
    return prisma.aISummary.create({
      data: {
        leadId,
        summary,
      },
    });
  }
}
