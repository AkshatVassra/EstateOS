import { WhatsappRepository } from "./repositories/whatsapp.repository";
import { isCustomerServiceWindowOpen } from "./whatsapp-policy";

export class WhatsAppTemplateRequiredError extends Error {
  constructor() {
    super("A free-form WhatsApp reply is only permitted within the 24-hour customer-service window.");
    this.name = "WhatsAppTemplateRequiredError";
  }
}

type SendTextInput = {
  phoneNumberId: string;
  to: string;
  body: string;
  lastInboundAt: Date;
};

export class WhatsAppSenderService {
  static async sendText(input: SendTextInput): Promise<string> {
    if (!isCustomerServiceWindowOpen(input.lastInboundAt)) {
      throw new WhatsAppTemplateRequiredError();
    }

    // Try DB first, fall back to env var
    let accessToken = await WhatsappRepository.getActiveAccessToken(input.phoneNumberId);
    if (!accessToken) {
      accessToken = process.env.META_ACCESS_TOKEN ?? null;
    }
    if (!accessToken) {
      const error = `No active WhatsApp account or META_ACCESS_TOKEN configured for phone number ${input.phoneNumberId}.`;
      console.error(`[WhatsApp] ${error}`);
      throw new Error(error);
    }

    const apiVersion = process.env.WHATSAPP_API_VERSION ?? "v21.0";
    const url = `https://graph.facebook.com/${apiVersion}/${input.phoneNumberId}/messages`;
    const body = JSON.stringify({
      messaging_product: "whatsapp",
      to: input.to.replace(/\D/g, ""),
      type: "text",
      text: { body: input.body },
    });

    console.log(`[WhatsApp] Sending message to ${input.to} via phone number ${input.phoneNumberId}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body,
    });

    const payload: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      const error = `WhatsApp Graph API rejected the message (${response.status}): ${JSON.stringify(payload)}`;
      console.error(`[WhatsApp] ${error}`);
      throw new Error(error);
    }

    const providerMessageId = this.providerMessageId(payload);
    if (!providerMessageId) {
      const error = "WhatsApp Graph API accepted a message without returning its message ID.";
      console.error(`[WhatsApp] ${error}`, payload);
      throw new Error(error);
    }

    console.log(`[WhatsApp] Message sent successfully, provider ID: ${providerMessageId}`);
    return providerMessageId;
  }

  private static providerMessageId(payload: unknown): string | null {
    if (!payload || typeof payload !== "object") return null;
    const messages = (payload as { messages?: unknown }).messages;
    if (!Array.isArray(messages) || !messages[0] || typeof messages[0] !== "object") return null;
    const id = (messages[0] as { id?: unknown }).id;
    return typeof id === "string" && id.length > 0 ? id : null;
  }
}
