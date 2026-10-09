import { DashboardRepository } from "./dashboard.repository";

export class DashboardService {
  static async getOverview(agencyId: string) {
    const data = await DashboardRepository.getOverviewMetrics(agencyId);
    
    // Generate intelligent AI priorities & insights based on real database metrics
    const aiPriorities = [];
    if (data.overview.hotLeads > 0) {
      aiPriorities.push({
        id: "ai-priority-hot-leads",
        title: `${data.overview.hotLeads} Hot Leads Require Immediate Contact`,
        description: "High buying intent detected. Prioritize outreach to maximize conversion probabilities.",
        priority: "HIGH",
        actionUrl: "/leads?temperature=HOT"
      });
    }
    if (data.overview.todayTasksCount > 0) {
      aiPriorities.push({
        id: "ai-priority-pending-tasks",
        title: `${data.overview.todayTasksCount} Tasks Scheduled For Today`,
        description: "Complete pending follow-ups and client proposals to maintain pipeline velocity.",
        priority: "MEDIUM",
        actionUrl: "/command-center"
      });
    }
    if (data.overview.newLeads > 0) {
      aiPriorities.push({
        id: "ai-priority-new-leads",
        title: `${data.overview.newLeads} Unqualified New Leads`,
        description: "AI qualification engine recommends initial phone or WhatsApp outreach within 15 minutes.",
        priority: "HIGH",
        actionUrl: "/leads?status=NEW"
      });
    }

    if (aiPriorities.length === 0) {
      aiPriorities.push({
        id: "ai-priority-all-clear",
        title: "Pipeline Clean – All Priorities Addressed",
        description: "No urgent tasks or critical lead alerts at this time. Consider prospecting or reviewing property listings.",
        priority: "LOW",
        actionUrl: "/properties"
      });
    }

    return {
      ...data,
      aiPriorities,
      aiInsights: {
        summary: `Current conversion rate stands at ${data.overview.conversionRate} with ${data.overview.activeConversations} active client conversations.`,
        recommendation: "Focus on closing warm negotiations to exceed monthly revenue targets."
      }
    };
  }

  static async getActivities(agencyId: string) {
    const data = await DashboardRepository.getOverviewMetrics(agencyId);
    return data.recentActivities;
  }

  static async getPriorities(agencyId: string) {
    const overview = await this.getOverview(agencyId);
    return overview.aiPriorities;
  }

  static async getPerformance(agencyId: string) {
    const [team, properties] = await Promise.all([
      DashboardRepository.getTeamPerformance(agencyId),
      DashboardRepository.getPropertyPerformance(agencyId)
    ]);
    return { team, properties };
  }

  static async getRevenue(agencyId: string) {
    const data = await DashboardRepository.getOverviewMetrics(agencyId);
    return {
      revenueToday: data.overview.revenueToday,
      revenueThisMonth: data.overview.revenueThisMonth,
      currency: "AED"
    };
  }
}
