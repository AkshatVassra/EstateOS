import { ConversationRepository } from "../repositories/conversation.repository";
import { MessageRepository } from "../repositories/message.repository";

export class ConversationService {
  static async getConversations(agencyId: string, skip = 0, take = 20, status?: string) {
    return ConversationRepository.findAll(agencyId, { skip, take, status });
  }

  static async getConversation(id: string, agencyId: string) {
    const conversation = await ConversationRepository.findById(id, agencyId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    return conversation;
  }

  static async sendMessage(agencyId: string, conversationId: string, sender: string, receiver: string, body: string) {
    // 1. Save message to DB
    const message = await MessageRepository.create({
      agencyId,
      conversationId,
      sender,
      receiver,
      body,
      direction: "OUTBOUND",
      status: "SENT",
    });

    // 2. Call Meta API to actually send the message
    // await MetaApiService.sendMessage(receiver, body);

    return message;
  }
}
