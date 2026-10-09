import { NextRequest } from "next/server";
import { ApiResponse } from "@/utils/api-response";
import { ConversationService } from "./conversation.service";
import { AuthContext } from "@/utils/route-handler";

export class ConversationController {
  static async getAll(req: NextRequest, auth: AuthContext) {
    const url = new URL(req.url);
    const skip = parseInt(url.searchParams.get("skip") || "0");
    const take = parseInt(url.searchParams.get("take") || "20");
    const status = url.searchParams.get("status") || undefined;

    const conversations = await ConversationService.getConversations(auth.agencyId, skip, take, status);
    return ApiResponse.success("Conversations fetched successfully", conversations);
  }

  static async getOne(req: NextRequest, id: string, auth: AuthContext) {
    const conversation = await ConversationService.getConversation(id, auth.agencyId);
    return ApiResponse.success("Conversation fetched successfully", conversation);
  }

  static async sendMessage(req: NextRequest, id: string, auth: AuthContext) {
    const body = await req.json();
    const { receiver, content } = body;
    // Assuming the authenticated user is the sender (or the agency's primary number)
    const sender = "AGENCY_PHONE"; 

    const message = await ConversationService.sendMessage(auth.agencyId, id, sender, receiver, content);
    return ApiResponse.success("Message sent successfully", message, 201);
  }

  static async sendMessageWithoutId(req: NextRequest, auth: AuthContext) {
    const body = await req.json();
    const { receiver, content, conversationId } = body;
    const sender = "AGENCY_PHONE"; 

    const message = await ConversationService.sendMessage(auth.agencyId, conversationId, sender, receiver, content);
    return ApiResponse.success("Message sent successfully", message, 201);
  }
}
