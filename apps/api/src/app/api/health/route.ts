import { NextRequest } from "next/server";
import { HealthCheckController } from "@/modules/communication/webhook/health-check.controller";

export async function GET(req: NextRequest) {
  return HealthCheckController.get(req);
}
