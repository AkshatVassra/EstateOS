import { NextRequest } from "next/server";
import { ApiResponse } from "@/utils/api-response";
import { DashboardService } from "./dashboard.service";
import { AuthContext } from "@/utils/route-handler";

export class DashboardController {
  static async getOverview(req: NextRequest, auth: AuthContext) {
    const data = await DashboardService.getOverview(auth.agencyId);
    return ApiResponse.success("Dashboard overview fetched successfully", data);
  }

  static async getActivities(req: NextRequest, auth: AuthContext) {
    const data = await DashboardService.getActivities(auth.agencyId);
    return ApiResponse.success("Recent activities fetched successfully", data);
  }

  static async getPriorities(req: NextRequest, auth: AuthContext) {
    const data = await DashboardService.getPriorities(auth.agencyId);
    return ApiResponse.success("AI Priorities fetched successfully", data);
  }

  static async getPerformance(req: NextRequest, auth: AuthContext) {
    const data = await DashboardService.getPerformance(auth.agencyId);
    return ApiResponse.success("Performance metrics fetched successfully", data);
  }

  static async getRevenue(req: NextRequest, auth: AuthContext) {
    const data = await DashboardService.getRevenue(auth.agencyId);
    return ApiResponse.success("Revenue metrics fetched successfully", data);
  }
}
