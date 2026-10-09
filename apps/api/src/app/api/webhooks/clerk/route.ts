import { withRouteHandler } from "@/utils/route-handler";
import { WebhookController } from "@/modules/auth/webhook.controller";

export const POST = withRouteHandler(async (req) => {
  return await WebhookController.clerk(req);
}, { requireAuth: false });
