import { withRouteHandler } from "@/utils/route-handler";
import { TaskController } from "@/modules/task/task.controller";

export const GET = withRouteHandler(async (req, { auth }) => {
  return await TaskController.getAll(req, auth);
});

export const POST = withRouteHandler(async (req, { auth }) => {
  return await TaskController.create(req, auth);
});
