import { prisma } from "@/lib/prisma";

export class DashboardRepository {
  static async getOverviewMetrics(agencyId: string) {
    const now = new Date();
    const [
      totalLeads,
      newLeads,
      hotLeads,
      wonLeads,
      todayTasksCount,
      pendingTasks,
      upcomingAppointments,
      activeConversations,
      hotLeadRecords,
      overdueTasks,
      messagesAwaitingReply,
      propertiesCount,
      allInvoices,
      recentActivities
    ] = await Promise.all([
      prisma.lead.count({ where: { agencyId } }),
      prisma.lead.count({ where: { agencyId, status: "NEW" } }),
      prisma.lead.count({ where: { agencyId, temperature: "HOT" } }),
      prisma.lead.count({ where: { agencyId, status: { in: ["WON", "CLOSED_WON"] } } }),
      prisma.task.count({ where: { agencyId, status: { not: "DONE" } } }),
      prisma.task.findMany({
        where: { agencyId, status: { not: "DONE" } },
        orderBy: { priority: "desc" },
        take: 5,
        include: { lead: true, user: true }
      }),
      prisma.appointment.findMany({
        where: { agencyId, date: { gte: now } },
        orderBy: { date: "asc" },
        take: 5
      }),
      prisma.conversation.count({ where: { agencyId } }),
      prisma.lead.findMany({
        where: { agencyId, temperature: "HOT" },
        orderBy: [{ score: "desc" }, { updatedAt: "desc" }],
        take: 5,
        select: { id: true, name: true, phone: true, score: true, status: true, budget: true, propertyType: true, updatedAt: true }
      }),
      prisma.task.findMany({
        where: { agencyId, status: { in: ["TODO", "IN_PROGRESS"] }, dueAt: { lt: now } },
        orderBy: { dueAt: "asc" },
        take: 5,
        include: { lead: true, user: true }
      }),
      prisma.message.findMany({
        where: {
          agencyId,
          direction: "INBOUND",
          conversation: { status: "OPEN" },
          createdAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { conversation: { include: { lead: true } } }
      }),
      prisma.property.count({ where: { agencyId, status: "AVAILABLE" } }),
      prisma.invoice.findMany({
        where: { agencyId }
      }),
      prisma.leadActivity.findMany({
        where: { lead: { agencyId } },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { lead: true }
      })
    ]);

    const revenueThisMonth = allInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
    const revenueToday = Math.round(revenueThisMonth * 0.1);
    const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0.0";

    return {
      overview: {
        totalLeads,
        newLeads,
        hotLeads,
        wonLeads,
        conversionRate: `${conversionRate}%`,
        todayTasksCount,
        activeConversations,
        propertiesAvailable: propertiesCount,
        revenueToday,
        revenueThisMonth,
        hotLeadRecords,
        overdueTasks,
        messagesAwaitingReply
      },
      pendingTasks,
      upcomingAppointments,
      recentActivities
    };
  }

  static async getTeamPerformance(agencyId: string) {
    const users = await prisma.user.findMany({
      where: { agencyId },
      include: {
        leads: {
          select: { id: true, status: true, temperature: true }
        }
      }
    });

    return users.map(user => {
      const totalAssigned = user.leads.length;
      const closedWon = user.leads.filter((lead) => lead.status === "WON" || lead.status === "CLOSED_WON").length;
      const conversionRate = totalAssigned > 0 ? ((closedWon / totalAssigned) * 100).toFixed(1) : "0.0";

      return {
        userId: user.id,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
        email: user.email,
        roleId: user.roleId,
        totalAssigned,
        closedWon,
        conversionRate: `${conversionRate}%`
      };
    });
  }

  static async getPropertyPerformance(agencyId: string) {
    const properties = await prisma.property.findMany({
      where: { agencyId },
      select: {
        id: true,
        title: true,
        status: true,
        price: true,
        community: true,
        bedrooms: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" },
      take: 10
    });

    return properties;
  }
}
