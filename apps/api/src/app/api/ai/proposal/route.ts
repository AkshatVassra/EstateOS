import { withRouteHandler } from "@/utils/route-handler";
import { AiController } from "@/modules/ai/ai.controller";

export const POST = withRouteHandler(async (req, { auth }) => {
  return await AiController.proposal(req, auth);
});
