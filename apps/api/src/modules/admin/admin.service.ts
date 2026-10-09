import { AdminRepository } from "./admin.repository";

export class AdminService {
  static async getOverview() {
    const stats = await AdminRepository.getSystemStats();
    return {
      ...stats,
      systemHealth: "OPERATIONAL",
      aiUsageTokens: 125400,
      activeBackgroundJobs: 3
    };
  }

  static async getAgencies() {
    return AdminRepository.getAgencies();
  }

  static async getUsers(agencyId?: string) {
    return AdminRepository.getUsers(agencyId);
  }

  static async getAuditLogs(agencyId?: string) {
    return AdminRepository.getAuditLogs(agencyId);
  }
}
