import { NextRequest } from "next/server";
import { WebhookController } from "@/modules/communication/webhook/webhook.controller";

// Used by Meta to verify the webhook
export async function GET(req: NextRequest) {
  return WebhookController.verify(req);
}

// Used by Meta to send events (messages, statuses)
export async function POST(req: NextRequest) {
  return WebhookController.handleEvent(req);
}
