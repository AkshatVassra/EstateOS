import { withRouteHandler } from "@/utils/route-handler";
import { PropertyController } from "@/modules/property/property.controller";

export const GET = withRouteHandler(async (req, { params, auth }) => {
  return await PropertyController.getOne(req, params.id, auth);
});

export const PUT = withRouteHandler(async (req, { params, auth }) => {
  return await PropertyController.update(req, params.id, auth);
});

export const DELETE = withRouteHandler(async (req, { params, auth }) => {
  return await PropertyController.delete(req, params.id, auth);
});
