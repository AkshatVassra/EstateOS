import { prisma } from "@/lib/prisma";

export class AdminRepository {
  static async getAgencies() {
    return prisma.agency.findMany({
      include: {
        _count: {
          select: { users: true, leads: true, properties: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  static async getUsers(agencyId?: string) {
    const where = agencyId ? { agencyId } : {};
    return prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        createdAt: true,
        lastLogin: true,
        agency: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 50
    });
  }

  static async getAuditLogs(agencyId?: string) {
    const where = agencyId ? { agencyId } : {};
    return prisma.activityLog.findMany({
      where,
      orderBy: { id: "desc" },
      take: 50
    });
  }

  static async getSystemStats() {
    const [totalAgencies, totalUsers, totalLeads, totalProperties, activeSubscriptions] = await Promise.all([
      prisma.agency.count(),
      prisma.user.count(),
      prisma.lead.count(),
      prisma.property.count(),
      prisma.subscription.count({ where: { status: "ACTIVE" } })
    ]);

    return {
      totalAgencies,
      totalUsers,
      totalLeads,
      totalProperties,
      activeSubscriptions
    };
  }
}
