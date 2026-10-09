import { withRouteHandler } from "@/utils/route-handler";
import { TaskController } from "@/modules/task/task.controller";

export const GET = withRouteHandler(async (req, { params, auth }) => {
  return await TaskController.getOne(req, params.id, auth);
});

export const PUT = withRouteHandler(async (req, { params, auth }) => {
  return await TaskController.update(req, params.id, auth);
});

export const DELETE = withRouteHandler(async (req, { params, auth }) => {
  return await TaskController.delete(req, params.id, auth);
});
