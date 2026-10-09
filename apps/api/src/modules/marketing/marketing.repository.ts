import { prisma } from "@/lib/prisma";

export class MarketingRepository {
  static async createCampaign(agencyId: string, name: string) {
    return prisma.campaign.create({
      data: {
        agencyId,
        name
      }
    });
  }

  static async getCampaigns(agencyId: string) {
    return prisma.campaign.findMany({
      where: { agencyId },
      orderBy: { id: "desc" }
    });
  }

  static async getCampaignById(id: string, agencyId: string) {
    return prisma.campaign.findFirst({
      where: { id, agencyId }
    });
  }

  static async saveGeneratedPost(agencyId: string, content: string) {
    return prisma.generatedPost.create({
      data: {
        agencyId,
        content
      }
    });
  }

  static async getGeneratedPosts(agencyId: string) {
    return prisma.generatedPost.findMany({
      where: { agencyId },
      orderBy: { id: "desc" },
      take: 20
    });
  }
}
