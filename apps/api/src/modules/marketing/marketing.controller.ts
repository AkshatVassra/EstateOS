import { NextRequest } from "next/server";
import { ApiResponse } from "@/utils/api-response";
import { MarketingService } from "./marketing.service";
import { AuthContext } from "@/utils/route-handler";
import { z } from "zod";

const createCampaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
});

const generateCopySchema = z.object({
  platform: z.string().default("Instagram"),
  tone: z.string().default("Luxury"),
  topic: z.string().min(1, "Topic or property name is required"),
  propertyDetails: z.string().optional(),
});

export class MarketingController {
  static async getAll(req: NextRequest, auth: AuthContext) {
    const data = await MarketingService.getCampaigns(auth.agencyId);
    return ApiResponse.success("Marketing campaigns fetched successfully", data);
  }

  static async create(req: NextRequest, auth: AuthContext) {
    const body = await req.json();
    const { name } = createCampaignSchema.parse(body);
    const campaign = await MarketingService.createCampaign(auth.agencyId, name);
    return ApiResponse.success("Campaign created successfully", campaign, 201);
  }

  static async generateCopy(req: NextRequest, auth: AuthContext) {
    const body = await req.json();
    const params = generateCopySchema.parse(body);
    const result = await MarketingService.generateAdCopy(auth.agencyId, params);
    return ApiResponse.success("Marketing copy generated successfully", result);
  }
}
