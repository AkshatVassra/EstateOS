import { withRouteHandler } from "@/utils/route-handler";
import { UploadController } from "@/modules/upload/upload.controller";

export const POST = withRouteHandler(async (req, { auth }) => {
  return await UploadController.getPresignedUrl(req, auth);
});
