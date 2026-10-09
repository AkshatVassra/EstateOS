import { ApiResponse } from "@/utils/api-response";
import { WebhookService } from "./webhook.service";

export class WebhookController {
  static async clerk(req: Request) {
    await WebhookService.handleClerkWebhook(req);
    return ApiResponse.success("Webhook processed successfully");
  }
}
