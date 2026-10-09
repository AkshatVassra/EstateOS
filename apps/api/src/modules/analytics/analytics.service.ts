import { AnalyticsRepository } from "./analytics.repository";

export class AnalyticsService {
  static async getDashboardAnalytics(agencyId: string) {
    const [funnel, revenueTrends, leadSources, agentRankings] = await Promise.all([
      AnalyticsRepository.getLeadFunnel(agencyId),
      AnalyticsRepository.getRevenueTrends(agencyId),
      AnalyticsRepository.getLeadSources(agencyId),
      AnalyticsRepository.getAgentPerformance(agencyId)
    ]);

    const totalLeads = funnel.reduce((sum, item) => sum + item.count, 0);
    const wonLeads = funnel.find((funnelItem) => funnelItem.stage === "Closed Won")?.count || 0;
    const totalRevenue = revenueTrends.reduce((sum, item) => sum + item.revenue, 0);
    const averageDealSize = wonLeads > 0 ? (totalRevenue / wonLeads).toFixed(2) : "0.00";
    const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) + "%" : "0.0%";

    return {
      overview: {
        totalLeads,
        wonLeads,
        totalRevenue,
        averageDealSize,
        conversionRate
      },
      funnel,
      revenueTrends,
      leadSources,
      agentRankings
    };
  }
}
