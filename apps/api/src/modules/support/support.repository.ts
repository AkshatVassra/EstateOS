import { prisma } from "@/lib/prisma";

export class SupportRepository {
  static async getTickets(agencyId: string) {
    return prisma.ticket.findMany({
      where: { agencyId },
      orderBy: { id: "desc" }
    });
  }

  static async createTicket(agencyId: string, subject: string, status = "OPEN") {
    return prisma.ticket.create({
      data: {
        agencyId,
        subject,
        status
      }
    });
  }

  static async getKnowledgeBaseArticles(query?: string) {
    const articles = await prisma.knowledgeBaseArticle.findMany({
      take: 20
    });

    if (!query) return articles;
    const lower = query.toLowerCase();
    return articles.filter(a => a.title.toLowerCase().includes(lower));
  }
}
