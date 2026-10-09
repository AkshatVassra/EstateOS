import { withRouteHandler } from "@/utils/route-handler";
import { AgencyController } from "@/modules/agency/agency.controller";

export const PUT = withRouteHandler(async (req, { params, auth }) => {
  return await AgencyController.updateSettings(req, params.id, auth);
});
