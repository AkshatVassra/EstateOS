import { NextRequest } from "next/server";
import { ApiResponse } from "@/utils/api-response";
import { SupportService } from "./support.service";
import { AuthContext } from "@/utils/route-handler";
import { z } from "zod";

const createTicketSchema = z.object({
  subject: z.string().min(1, "Ticket subject is required"),
});

export class SupportController {
  static async getAll(req: NextRequest, auth: AuthContext) {
    const data = await SupportService.getTickets(auth.agencyId);
    return ApiResponse.success("Support tickets fetched successfully", data);
  }

  static async create(req: NextRequest, auth: AuthContext) {
    const body = await req.json();
    const { subject } = createTicketSchema.parse(body);
    const ticket = await SupportService.createTicket(auth.agencyId, subject);
    return ApiResponse.success("Support ticket created successfully", ticket, 201);
  }

  static async getKB(req: NextRequest, _auth: AuthContext) {
    const url = new URL(req.url);
    const query = url.searchParams.get("q") || undefined;
    const data = await SupportService.getKnowledgeBase(query);
    return ApiResponse.success("Knowledge base articles fetched successfully", data);
  }

  static async getStatus(_req: NextRequest, _auth: AuthContext) {
    const data = await SupportService.getSystemStatus();
    return ApiResponse.success("System status fetched successfully", data);
  }
}
