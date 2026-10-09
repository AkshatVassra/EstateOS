import { withRouteHandler } from "@/utils/route-handler";
import { UserController } from "@/modules/user/user.controller";

export const GET = withRouteHandler(async (req, { params, auth }) => {
  return await UserController.getOne(req, params.id, auth);
});

export const PUT = withRouteHandler(async (req, { params, auth }) => {
  return await UserController.update(req, params.id, auth);
});

export const DELETE = withRouteHandler(async (req, { params, auth }) => {
  return await UserController.delete(req, params.id, auth);
});
