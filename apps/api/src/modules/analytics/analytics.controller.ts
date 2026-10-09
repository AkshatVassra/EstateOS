import { NextRequest } from "next/server";
import { ApiResponse } from "@/utils/api-response";
import { AnalyticsService } from "./analytics.service";
import { AuthContext } from "@/utils/route-handler";

export class AnalyticsController {
  static async getAnalytics(req: NextRequest, auth: AuthContext) {
    const data = await AnalyticsService.getDashboardAnalytics(auth.agencyId);
    return ApiResponse.success("Analytics fetched successfully", data);
  }
}
