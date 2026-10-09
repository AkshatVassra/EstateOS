import { withRouteHandler } from "@/utils/route-handler";
import { AuthController } from "@/modules/auth/auth.controller";

export const GET = withRouteHandler(async (req, { auth }) => {
  return await AuthController.me(auth);
});
