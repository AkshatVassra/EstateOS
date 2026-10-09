import { withRouteHandler } from "@/utils/route-handler";
import { ConversationController } from "@/modules/communication/conversation/conversation.controller";

export const GET = withRouteHandler(async (req, { auth }) => {
  return await ConversationController.getAll(req, auth);
});
