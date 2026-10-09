import { NextRequest } from "next/server";
import { ApiResponse } from "@/utils/api-response";
import { AgencyService } from "./agency.service";
import { createAgencySchema, updateAgencySchema, updateAgencySettingsSchema } from "./agency.validator";
import { AuthContext } from "@/utils/route-handler";
import { ApiError } from "@/utils/api-error";

export class AgencyController {
  static async create(req: NextRequest, _auth: AuthContext) {
    const body = await req.json();
    const data = createAgencySchema.parse(body);
    const agency = await AgencyService.createAgency(data);
    return ApiResponse.success("Agency created successfully", agency, 201);
  }

  static async getAll(req: NextRequest, _auth: AuthContext) {
    const url = new URL(req.url);
    const skip = parseInt(url.searchParams.get("skip") || "0");
    const take = parseInt(url.searchParams.get("take") || "20");
    const agencies = await AgencyService.getAllAgencies(skip, take);
    return ApiResponse.success("Agencies fetched successfully", agencies);
  }

  static async getOne(req: NextRequest, id: string, auth: AuthContext) {
    // Basic multi-tenant check: user can only access their own agency
    // Unless they have an admin role
    if (auth.agencyId !== id) {
      throw ApiError.forbidden("You do not have access to this agency");
    }

    const agency = await AgencyService.getAgency(id);
    return ApiResponse.success("Agency fetched successfully", agency);
  }

  static async update(req: NextRequest, id: string, auth: AuthContext) {
    if (auth.agencyId !== id) {
      throw ApiError.forbidden("You do not have access to modify this agency");
    }

    const body = await req.json();
    const data = updateAgencySchema.parse(body);
    const agency = await AgencyService.updateAgency(id, data);
    return ApiResponse.success("Agency updated successfully", agency);
  }

  static async delete(req: NextRequest, id: string, auth: AuthContext) {
    if (auth.agencyId !== id) {
      throw ApiError.forbidden("You do not have access to delete this agency");
    }
    
    await AgencyService.deleteAgency(id);
    return ApiResponse.success("Agency deleted successfully");
  }

  static async updateSettings(req: NextRequest, id: string, auth: AuthContext) {
    if (auth.agencyId !== id) {
      throw ApiError.forbidden("You do not have access to modify these settings");
    }

    const body = await req.json();
    const data = updateAgencySettingsSchema.parse(body);
    const settings = await AgencyService.updateSettings(id, data);
    return ApiResponse.success("Agency settings updated successfully", settings);
  }
}
