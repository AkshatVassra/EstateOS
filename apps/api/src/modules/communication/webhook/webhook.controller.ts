import { NextRequest } from "next/server";
import { WebhookService } from "./webhook.service";
import { rateLimiter } from "./rate-limiter";
import type { MetaWebhookPayload } from "../dto/meta-webhook.dto";

const ONE_MINUTE_MS = 60_000;

async function isAllowed(request: NextRequest): Promise<boolean> {
  const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = Number.parseInt(process.env.WEBHOOK_RATE_LIMIT_PER_MINUTE ?? "120", 10);
  const result = await rateLimiter.check(key, limit, ONE_MINUTE_MS);
  return result.allowed;
}

function isWebhookPayload(value: unknown): value is MetaWebhookPayload {
  return typeof value === "object" && value !== null;
}

export class WebhookController {
  /**
   * Handle GET request for Meta Webhook Verification
   */
  static async verify(req: NextRequest) {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    const expectedToken = process.env.META_WEBHOOK_VERIFY_TOKEN;
    if (!expectedToken) {
      console.error("Meta webhook verification is not configured.");
      return new Response("Webhook verification is not configured", { status: 503 });
    }

    if (mode && token && challenge) {
      const verified = await WebhookService.verifyWebhook(mode, token, challenge, expectedToken);
      if (verified) return new Response(verified, { status: 200 });
    }

    return new Response("Forbidden", { status: 403 });
  }

  /**
   * Handle POST request for Meta Webhook Events
   * Validates Meta signature before processing and enqueues for async processing.
   */
  static async handleEvent(req: NextRequest) {
    if (!(await isAllowed(req))) {
      return new Response("Too many requests", { status: 429, headers: { "Retry-After": "60" } });
    }

    const bodyText = await req.text();

    // Signature verification — always required in production
    const signature = req.headers.get("x-hub-signature-256");
    const appSecret = process.env.META_APP_SECRET;

    if (!appSecret || !signature) {
      console.error("[Webhook] Meta signature configuration is incomplete.");
      return new Response("Invalid signature", { status: 401 });
    }

    if (!WebhookService.validateSignature(bodyText, signature, appSecret)) {
      console.error("[Webhook] Invalid Meta signature received.");
      return new Response("Invalid signature", { status: 401 });
    }

    let body: unknown;
    try {
      body = JSON.parse(bodyText);
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    if (!isWebhookPayload(body)) return new Response("Invalid webhook payload", { status: 400 });

    // Enqueue for async processing via worker
    try {
      const { WebhookEventService } = await import("./webhook-event.service");
      const result = await WebhookEventService.enqueue(body);
      console.log(`[Webhook] Event enqueued: ${result.id} (duplicate: ${result.duplicate})`);
      return Response.json({ status: "enqueued", eventId: result.id, duplicate: result.duplicate }, { status: 200 });
    } catch (error) {
      console.error("[Webhook] Error enqueueing event:", error instanceof Error ? error.message : error);
      return new Response("Service unavailable", { status: 503 });
    }
  }
}
