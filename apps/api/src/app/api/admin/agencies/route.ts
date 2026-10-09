import { withRouteHandler } from "@/utils/route-handler";
import { AdminController } from "@/modules/admin/admin.controller";

export const GET = withRouteHandler(async (req, { auth }) => {
  return await AdminController.getAgencies(req, auth);
});
