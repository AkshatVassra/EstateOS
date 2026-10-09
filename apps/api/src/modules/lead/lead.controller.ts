import { NextRequest } from "next/server";
import { ApiResponse } from "@/utils/api-response";
import { LeadService } from "./lead.service";
import { createLeadSchema, updateLeadSchema, assignLeadSchema, createLeadNoteSchema } from "./lead.validator";
import { AuthContext } from "@/utils/route-handler";

export class LeadController {
  static async create(req: NextRequest, auth: AuthContext) {
    const body = await req.json();
    const data = createLeadSchema.parse(body);
    const lead = await LeadService.createLead(auth.agencyId, data);
    return ApiResponse.success("Lead created successfully", lead, 201);
  }

  static async getAll(req: NextRequest, auth: AuthContext) {
    const url = new URL(req.url);
    const skip = parseInt(url.searchParams.get("skip") || "0");
    const take = parseInt(url.searchParams.get("take") || "20");
    const status = url.searchParams.get("status") || undefined;
    
    const leads = await LeadService.getAllLeads(auth.agencyId, skip, take, status);
    return ApiResponse.success("Leads fetched successfully", leads);
  }

  static async getOne(req: NextRequest, id: string, auth: AuthContext) {
    const lead = await LeadService.getLead(id, auth.agencyId);
    return ApiResponse.success("Lead fetched successfully", lead);
  }

  static async update(req: NextRequest, id: string, auth: AuthContext) {
    const body = await req.json();
    const data = updateLeadSchema.parse(body);
    const lead = await LeadService.updateLead(id, auth.agencyId, data);
    return ApiResponse.success("Lead updated successfully", lead);
  }

  static async delete(req: NextRequest, id: string, auth: AuthContext) {
    await LeadService.deleteLead(id, auth.agencyId);
    return ApiResponse.success("Lead deleted successfully");
  }

  static async assign(req: NextRequest, id: string, auth: AuthContext) {
    const body = await req.json();
    const { userId } = assignLeadSchema.parse(body);
    const lead = await LeadService.assignLead(id, auth.agencyId, userId, auth.userId);
    return ApiResponse.success("Lead assigned successfully", lead);
  }

  static async addNote(req: NextRequest, id: string, auth: AuthContext) {
    const body = await req.json();
    const { note } = createLeadNoteSchema.parse(body);
    const result = await LeadService.addNote(id, auth.agencyId, auth.userId, note);
    return ApiResponse.success("Note added successfully", result, 201);
  }
}
