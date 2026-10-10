import { prisma } from "@/lib/prisma";
import { WhatsappRepository } from "../repositories/whatsapp.repository";
import { MessageRepository } from "../repositories/message.repository";
import { MetaWebhookPayload, MetaValue } from "../dto/meta-webhook.dto";
import { validateMetaSignature } from "./meta-signature";
import { CommunicationOrchestrator } from "../communication.orchestrator";

export class WebhookService {
  /**
   * Verify the webhook request from Meta
   */
  static async verifyWebhook(
    mode: string,
    token: string,
    challenge: string,
    verifyToken: string
  ): Promise<string | null> {
    if (mode === "subscribe" && token === verifyToken) {
      return challenge;
    }
    return null;
  }

  /**
   * Validate Meta webhook signature
   */
  static validateSignature(payload: string, signature: string, appSecret: string): boolean {
    return validateMetaSignature(payload, signature, appSecret);
  }

  /**
   * Process incoming webhook event
   */
  static async processWebhookEvent(payload: MetaWebhookPayload): Promise<void> {
    if (payload.object !== "whatsapp_business_account" || !payload.entry) {
      return;
    }

    for (const entry of payload.entry) {
      const changes = entry.changes || [];
      for (const change of changes) {
        if (change.value.messages) {
          await this.processIncomingMessage(change.value);
        }
        if (change.value.statuses) {
          await this.processMessageStatus(change.value);
        }
      }
    }
  }

  private static async processIncomingMessage(value: MetaValue): Promise<void> {
    const metadata = value.metadata;
    const phoneNumberId = metadata.phone_number_id;

    // 1. Find the agency account based on phone number id
    let account = await WhatsappRepository.findByPhoneNumberId(phoneNumberId);
    let agencyId: string;
    if (!account) {
      console.warn(`[Webhook] No WhatsApp account found for phone ${phoneNumberId}, falling back to primary agency.`);
      const primaryAgency = await prisma.agency.findFirst();
      if (!primaryAgency) {
        console.error("[Webhook] No active agency found for inbound Meta event.");
        throw new Error("No active agency found for inbound Meta event");
      }
      agencyId = primaryAgency.id;
    } else {
      agencyId = account.agencyId;
    }
    const messages = value.messages || [];
    const contacts = value.contacts || [];

    // Process each message
    for (const message of messages) {
      const contact = contacts.find((c) => c.wa_id === message.from);
      const senderPhone = message.from;

      // Extract message content
      let textBody = "";
      if (message.type === "text" && message.text) {
        textBody = message.text.body;
      } else if (message.type === "image") {
        textBody = message.image?.caption || "[Image received]";
      } else if (message.type === "document") {
        textBody = message.document?.caption || "[Document received]";
      } else {
        textBody = `[${message.type} received]`;
      }

      // Delegate to V2 Communication Orchestrator
      try {
        await CommunicationOrchestrator.processInboundMessage(
          agencyId,
          senderPhone,
          textBody,
          message.id,
          phoneNumberId,
          contact?.profile.name
        );
        console.log(`[Webhook] Successfully processed message ${message.id} for agency ${agencyId}`);
      } catch (error) {
        console.error(`[Webhook] Failed to process message ${message.id} for agency ${agencyId}:`, error instanceof Error ? error.message : error);
        throw error; // Re-throw to trigger retry in worker
      }
    }
  }

  private static async processMessageStatus(value: MetaValue): Promise<void> {
    const statuses = value.statuses || [];
    for (const status of statuses) {
      const message = await MessageRepository.findByProviderId(status.id);
      if (message) {
        await MessageRepository.updateStatus(message.id, status.status.toUpperCase());
        await MessageRepository.createStatus({
          messageId: message.id,
          status: status.status.toUpperCase(),
          timestamp: new Date(parseInt(status.timestamp, 10) * 1000)
        });
      }
    }
  }
}
