import { withRouteHandler } from "@/utils/route-handler";
import { ConversationController } from "@/modules/communication/conversation/conversation.controller";

export const POST = withRouteHandler(async (req, { params, auth }) => {
  const resolvedParams = await params;
  return await ConversationController.sendMessage(req, resolvedParams.id, auth);
});
