import { withRouteHandler } from "@/utils/route-handler";
import { NotificationController } from "@/modules/notification/notification.controller";

export const PUT = withRouteHandler(async (req, { params, auth }) => {
  return await NotificationController.markRead(req, params.id, auth);
});

export const DELETE = withRouteHandler(async (req, { params, auth }) => {
  return await NotificationController.delete(req, params.id, auth);
});
