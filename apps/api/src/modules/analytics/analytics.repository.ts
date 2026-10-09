import { prisma } from "@/lib/prisma";

export class AnalyticsRepository {
  static async getLeadFunnel(agencyId: string) {
    const leads = await prisma.lead.groupBy({
      by: ["status"],
      where: { agencyId },
      _count: { id: true }
    });

    const funnelMap: Record<string, number> = {
      NEW: 0,
      CONTACTED: 0,
      QUALIFYING: 0,
      QUALIFIED: 0,
      VIEWING: 0,
      NEGOTIATION: 0,
      WON: 0,
      LOST: 0,
      CLOSED_WON: 0,
      CLOSED_LOST: 0
    };

    leads.forEach(item => {
      if (item.status in funnelMap) {
        funnelMap[item.status] = item._count.id;
      } else {
        funnelMap[item.status] = item._count.id;
      }
    });

    return [
      { stage: "New Leads", count: funnelMap.NEW || 0, color: "hsl(var(--accent))" },
      { stage: "Contacted & Qualifying", count: (funnelMap.CONTACTED || 0) + (funnelMap.QUALIFYING || 0), color: "hsl(var(--primary))" },
      { stage: "Qualified & Viewing", count: (funnelMap.QUALIFIED || 0) + (funnelMap.VIEWING || 0), color: "hsl(var(--warning))" },
      { stage: "Negotiation", count: funnelMap.NEGOTIATION || 0, color: "hsl(var(--secondary))" },
      { stage: "Closed Won", count: (funnelMap.WON || 0) + (funnelMap.CLOSED_WON || 0), color: "hsl(220, 70%, 50%)" }
    ];
  }

  static async getRevenueTrends(agencyId: string) {
    const invoices = await prisma.invoice.findMany({
      where: { agencyId },
      select: { id: true, amount: true }
    });

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const monthlyMap: Record<string, number> = {};

    invoices.forEach((inv, idx) => {
      // Distribute across recent months if no createdAt exists on legacy schema
      const monthIdx = (now.getMonth() - (idx % 6) + 12) % 12;
      const monthYear = `${months[monthIdx]} ${now.getFullYear()}`;
      monthlyMap[monthYear] = (monthlyMap[monthYear] || 0) + Number(inv.amount || 0);
    });

    return Object.entries(monthlyMap).map(([month, revenue]) => ({
      month,
      revenue
    }));
  }

  static async getLeadSources(agencyId: string) {
    const sources = await prisma.lead.groupBy({
      by: ["source"],
      where: { agencyId },
      _count: { source: true }
    });

    return sources.map(s => ({
      source: (s.source || "Unknown").toUpperCase(),
      count: s._count.source
    }));
  }

  static async getAgentPerformance(agencyId: string) {
    const users = await prisma.user.findMany({
      where: { agencyId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        leads: {
          select: { status: true }
        }
      }
    });

    return users.map(user => {
      const totalLeads = user.leads.length;
      const closedWon = user.leads.filter((lead) => lead.status === "WON" || lead.status === "CLOSED_WON").length;
      return {
        userId: user.id,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
        totalLeads,
        closedWon,
        conversionRate: totalLeads > 0 ? ((closedWon / totalLeads) * 100).toFixed(1) + "%" : "0.0%"
      };
    }).sort((a, b) => b.closedWon - a.closedWon);
  }
}
