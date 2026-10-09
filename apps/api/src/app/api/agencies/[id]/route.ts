import { withRouteHandler } from "@/utils/route-handler";
import { AgencyController } from "@/modules/agency/agency.controller";

export const GET = withRouteHandler(async (req, { params, auth }) => {
  return await AgencyController.getOne(req, params.id, auth);
});

export const PUT = withRouteHandler(async (req, { params, auth }) => {
  return await AgencyController.update(req, params.id, auth);
});

export const DELETE = withRouteHandler(async (req, { params, auth }) => {
  return await AgencyController.delete(req, params.id, auth);
});
