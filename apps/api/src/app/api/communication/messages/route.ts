import { withRouteHandler } from "@/utils/route-handler";
import { ConversationController } from "@/modules/communication/conversation/conversation.controller";

export const POST = withRouteHandler(async (req, { auth }) => {
  return await ConversationController.sendMessageWithoutId(req, auth);
});
