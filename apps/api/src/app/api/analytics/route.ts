import { withRouteHandler } from "@/utils/route-handler";
import { AnalyticsController } from "@/modules/analytics/analytics.controller";

export const GET = withRouteHandler(async (req, { auth }) => {
  return await AnalyticsController.getAnalytics(req, auth);
});
