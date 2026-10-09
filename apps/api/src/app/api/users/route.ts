import { withRouteHandler } from "@/utils/route-handler";
import { UserController } from "@/modules/user/user.controller";

export const GET = withRouteHandler(async (req, { auth }) => {
  return await UserController.getAll(req, auth);
});

export const POST = withRouteHandler(async (req, { auth }) => {
  return await UserController.create(req, auth);
});
