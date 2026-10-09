import { NextRequest } from "next/server";
import { ApiResponse } from "@/utils/api-response";
import { AiService } from "./ai.service";
import { generateReplySchema, generateSummarySchema, generateRecommendSchema, generateCaptionSchema } from "./ai.validator";
import { AuthContext } from "@/utils/route-handler";

export class AiController {
  static async reply(req: NextRequest, auth: AuthContext) {
    const body = await req.json();
    const data = generateReplySchema.parse(body);
    const result = await AiService.generateReply(auth.agencyId, data.leadId, data.context);
    return ApiResponse.success("AI Reply generated successfully", result);
  }

  static async summary(req: NextRequest, auth: AuthContext) {
    const body = await req.json();
    const data = generateSummarySchema.parse(body);
    const result = await AiService.generateSummary(auth.agencyId, data.leadId);
    return ApiResponse.success("AI Summary generated successfully", result);
  }

  static async recommend(req: NextRequest, auth: AuthContext) {
    const body = await req.json();
    const data = generateRecommendSchema.parse(body);
    const result = await AiService.generateRecommendation(auth.agencyId, data.leadId, data.preferences);
    return ApiResponse.success("AI Recommendation generated successfully", result);
  }

  static async caption(req: NextRequest, auth: AuthContext) {
    const body = await req.json();
    const data = generateCaptionSchema.parse(body);
    const result = await AiService.generateCaption(auth.agencyId, data.propertyId, data.platform, data.tone);
    return ApiResponse.success("AI Caption generated successfully", result);
  }

  static async salesCoach(req: NextRequest, auth: AuthContext) {
    const body = await req.json();
    const leadId = body.leadId || "unassigned";
    const objection = body.objection || undefined;
    const result = await AiService.generateSalesCoach(auth.agencyId, leadId, objection);
    return ApiResponse.success("AI Sales Coach advice generated successfully", result);
  }

  static async followup(req: NextRequest, auth: AuthContext) {
    const body = await req.json();
    const leadId = body.leadId || "unassigned";
    const stage = body.stage || undefined;
    const result = await AiService.generateFollowup(auth.agencyId, leadId, stage);
    return ApiResponse.success("AI Followup generated successfully", result);
  }

  static async qualify(req: NextRequest, auth: AuthContext) {
    const body = await req.json();
    const leadId = body.leadId || "unassigned";
    const result = await AiService.generateQualification(auth.agencyId, leadId);
    return ApiResponse.success("AI Qualification report generated successfully", result);
  }

  static async emailWriter(req: NextRequest, auth: AuthContext) {
    const body = await req.json();
    const result = await AiService.generateEmailWriter(auth.agencyId, body.targetName || "Valued Client", body.topic || "Luxury Penthouse Collection");
    return ApiResponse.success("AI Email generated successfully", result);
  }

  static async proposal(req: NextRequest, auth: AuthContext) {
    const body = await req.json();
    const result = await AiService.generateProposal(auth.agencyId, body.clientName || "VIP Investor", body.propertyName || "The Royal Atlantis Residences");
    return ApiResponse.success("AI Proposal generated successfully", result);
  }

  static async contractDraft(req: NextRequest, auth: AuthContext) {
    const body = await req.json();
    const result = await AiService.generateContractDraft(auth.agencyId, body.clauseType || "Special Payment Plan & Refund Terms");
    return ApiResponse.success("AI Contract draft generated successfully", result);
  }

  static async marketInsights(req: NextRequest, auth: AuthContext) {
    const url = new URL(req.url);
    const location = url.searchParams.get("location") || "Palm Jumeirah";
    const result = await AiService.generateMarketInsights(auth.agencyId, location);
    return ApiResponse.success("AI Market insights generated successfully", result);
  }

  static async performanceAnalysis(req: NextRequest, auth: AuthContext) {
    const url = new URL(req.url);
    const agentId = url.searchParams.get("agentId") || undefined;
    const result = await AiService.generatePerformanceAnalysis(auth.agencyId, agentId);
    return ApiResponse.success("AI Performance analysis generated successfully", result);
  }
}
