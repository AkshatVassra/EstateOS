import { withRouteHandler } from "@/utils/route-handler";
import { DashboardController } from "@/modules/dashboard/dashboard.controller";

export const GET = withRouteHandler(async (req, { auth }) => {
  return await DashboardController.getRevenue(req, auth);
});
