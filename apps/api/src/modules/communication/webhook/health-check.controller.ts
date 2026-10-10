import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@estateos/database";

/**
 * Health check endpoint for WhatsApp webhook infrastructure
 * Checks: database connection, pending events, dead letter queue
 */
export async function GET(req: NextRequest) {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check webhook event queue status
    const pendingCount = await prisma.webhookEvent.count({
      where: { status: "PENDING" },
    });
    const processingCount = await prisma.webhookEvent.count({
      where: { status: "PROCESSING" },
    });
    const retryCount = await prisma.webhookEvent.count({
      where: { status: "RETRY" },
    });
    const deadLetterCount = await prisma.webhookEvent.count({
      where: { status: "DEAD_LETTER" },
    });

    // Check WhatsApp accounts
    const activeAccounts = await prisma.whatsAppAccount.count({
      where: { status: "ACTIVE" },
    });

    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      checks: {
        database: "ok",
        webhookQueue: {
          pending: pendingCount,
          processing: processingCount,
          retry: retryCount,
          deadLetter: deadLetterCount,
        },
        whatsappAccounts: {
          active: activeAccounts,
        },
      },
    };

    // Mark as degraded if there are too many dead letter events
    if (deadLetterCount > 100) {
      health.status = "degraded";
    }

    return NextResponse.json(health, { status: health.status === "healthy" ? 200 : 503 });
  } catch (error) {
    console.error("[HealthCheck] Health check failed:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
