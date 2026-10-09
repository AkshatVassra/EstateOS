import { withRouteHandler } from "@/utils/route-handler";
import { AiController } from "@/modules/ai/ai.controller";

export const GET = withRouteHandler(async (req, { auth }) => {
  return await AiController.performanceAnalysis(req, auth);
});
