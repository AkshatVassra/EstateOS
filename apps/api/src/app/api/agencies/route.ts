import { withRouteHandler } from "@/utils/route-handler";
import { AgencyController } from "@/modules/agency/agency.controller";

export const GET = withRouteHandler(async (req, { auth }) => {
  return await AgencyController.getAll(req, auth);
});

export const POST = withRouteHandler(async (req, { auth }) => {
  return await AgencyController.create(req, auth);
});
