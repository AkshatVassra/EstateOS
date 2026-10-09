import { NextRequest } from "next/server";
import { ApiResponse } from "@/utils/api-response";
import { PropertyService } from "./property.service";
import { createPropertySchema, updatePropertySchema } from "./property.validator";
import { AuthContext } from "@/utils/route-handler";

export class PropertyController {
  static async create(req: NextRequest, auth: AuthContext) {
    const body = await req.json();
    const data = createPropertySchema.parse(body);
    const property = await PropertyService.createProperty(auth.agencyId, data);
    return ApiResponse.success("Property created successfully", property, 201);
  }

  static async getAll(req: NextRequest, auth: AuthContext) {
    const url = new URL(req.url);
    const skip = parseInt(url.searchParams.get("skip") || "0");
    const take = parseInt(url.searchParams.get("take") || "20");
    const status = url.searchParams.get("status") || undefined;
    const leadId = url.searchParams.get("leadId");

    if (leadId) {
      const matches = await PropertyService.getMatches(auth.agencyId, leadId, Math.min(take, 20));
      return ApiResponse.success("Property matches fetched successfully", matches);
    }
    
    const properties = await PropertyService.getAllProperties(auth.agencyId, skip, take, status);
    return ApiResponse.success("Properties fetched successfully", properties);
  }

  static async getOne(req: NextRequest, id: string, auth: AuthContext) {
    const property = await PropertyService.getProperty(id, auth.agencyId);
    return ApiResponse.success("Property fetched successfully", property);
  }

  static async update(req: NextRequest, id: string, auth: AuthContext) {
    const body = await req.json();
    const data = updatePropertySchema.parse(body);
    const property = await PropertyService.updateProperty(id, auth.agencyId, data);
    return ApiResponse.success("Property updated successfully", property);
  }

  static async delete(req: NextRequest, id: string, auth: AuthContext) {
    await PropertyService.deleteProperty(id, auth.agencyId);
    return ApiResponse.success("Property deleted successfully");
  }
}
