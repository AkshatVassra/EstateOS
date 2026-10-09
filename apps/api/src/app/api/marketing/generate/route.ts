import { withRouteHandler } from "@/utils/route-handler";
import { MarketingController } from "@/modules/marketing/marketing.controller";

export const POST = withRouteHandler(async (req, { auth }) => {
  return await MarketingController.generateCopy(req, auth);
});
