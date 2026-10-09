import { NextRequest } from "next/server";
import { ApiResponse } from "@/utils/api-response";
import { AdminService } from "./admin.service";
import { AuthContext } from "@/utils/route-handler";

export class AdminController {
  static async getOverview(_req: NextRequest, _auth: AuthContext) {
    const data = await AdminService.getOverview();
    return ApiResponse.success("Platform admin overview fetched successfully", data);
  }

  static async getAgencies(_req: NextRequest, _auth: AuthContext) {
    const data = await AdminService.getAgencies();
    return ApiResponse.success("Agencies fetched successfully", data);
  }

  static async getUsers(req: NextRequest, _auth: AuthContext) {
    const url = new URL(req.url);
    const agencyId = url.searchParams.get("agencyId") || undefined;
    const data = await AdminService.getUsers(agencyId);
    return ApiResponse.success("Users fetched successfully", data);
  }

  static async getAuditLogs(req: NextRequest, _auth: AuthContext) {
    const url = new URL(req.url);
    const agencyId = url.searchParams.get("agencyId") || undefined;
    const data = await AdminService.getAuditLogs(agencyId);
    return ApiResponse.success("Audit logs fetched successfully", data);
  }
}
