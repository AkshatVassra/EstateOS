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
      throw new Error(`No active WhatsApp account or META_ACCESS_TOKEN configured for phone number ${input.phoneNumberId}.`);
    }

    const apiVersion = process.env.WHATSAPP_API_VERSION ?? "v21.0";
    const response = await fetch(`https://graph.facebook.com/${apiVersion}/${input.phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: input.to.replace(/\D/g, ""),
        type: "text",
        text: { body: input.body },
      }),
    });

    const payload: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(`WhatsApp Graph API rejected the message (${response.status}).`);
    }

    const providerMessageId = this.providerMessageId(payload);
    if (!providerMessageId) {
      throw new Error("WhatsApp Graph API accepted a message without returning its message ID.");
    }
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
