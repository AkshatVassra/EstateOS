import { NextRequest } from "next/server";
import { ApiResponse } from "@/utils/api-response";
import { UploadService } from "./upload.service";
import { AuthContext } from "@/utils/route-handler";
import { z } from "zod";

const uploadSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
});

export class UploadController {
  static async getPresignedUrl(req: NextRequest, auth: AuthContext) {
    const body = await req.json();
    const { filename, contentType } = uploadSchema.parse(body);
    const result = await UploadService.getPresignedUrl(auth.agencyId, filename, contentType);
    return ApiResponse.success("Presigned URL generated", result);
  }
}
