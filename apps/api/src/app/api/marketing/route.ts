import { withRouteHandler } from "@/utils/route-handler";
import { MarketingController } from "@/modules/marketing/marketing.controller";

export const GET = withRouteHandler(async (req, { auth }) => {
  return await MarketingController.getAll(req, auth);
});

export const POST = withRouteHandler(async (req, { auth }) => {
  return await MarketingController.create(req, auth);
});
