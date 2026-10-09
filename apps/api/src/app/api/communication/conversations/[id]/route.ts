import { withRouteHandler } from "@/utils/route-handler";
import { ConversationController } from "@/modules/communication/conversation/conversation.controller";

export const GET = withRouteHandler(async (req, { params, auth }) => {
  return await ConversationController.getOne(req, params.id, auth);
});
