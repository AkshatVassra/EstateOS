import crypto from "node:crypto";
import { Prisma, prisma } from "@estateos/database";
import { WebhookService } from "./webhook.service";
import type { MetaWebhookPayload } from "../dto/meta-webhook.dto";

const MAX_ATTEMPTS = 5;
const STALE_LOCK_MS = 10 * 60 * 1000;

type EnqueueResult = { id: string; duplicate: boolean };

/**
 * A durable inbox for signed Meta events. It is deliberately database-backed so
 * that acknowledgement is fast and no inbound message is lost when an AI call
 * or the Graph API is slow or unavailable.
 */
export class WebhookEventService {
  static async enqueue(payload: MetaWebhookPayload): Promise<EnqueueResult> {
    const eventKey = crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
    const existing = await prisma.webhookEvent.findUnique({
      where: { eventKey },
      select: { id: true },
    });
    if (existing) {
      console.log(`[WebhookEvent] Duplicate event detected: ${eventKey}`);
      return { id: existing.id, duplicate: true };
    }

    try {
      const event = await prisma.webhookEvent.create({
        data: {
          eventKey,
          payload: payload as unknown as Prisma.InputJsonValue,
        },
        select: { id: true },
      });
      console.log(`[WebhookEvent] Event enqueued: ${event.id}`);
      return { id: event.id, duplicate: false };
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        const duplicate = await prisma.webhookEvent.findUniqueOrThrow({
          where: { eventKey },
          select: { id: true },
        });
        console.log(`[WebhookEvent] Duplicate event on constraint: ${eventKey}`);
        return { id: duplicate.id, duplicate: true };
      }
      console.error("[WebhookEvent] Failed to enqueue event:", error instanceof Error ? error.message : error);
      throw error;
    }
  }

  static async processAvailable(limit = 20): Promise<number> {
    // Release stale locks
    const staleRelease = await prisma.webhookEvent.updateMany({
      where: {
        status: "PROCESSING",
        lockedAt: { lt: new Date(Date.now() - STALE_LOCK_MS) },
      },
      data: { status: "RETRY", lockedAt: null, nextAttemptAt: new Date() },
    });
    if (staleRelease.count > 0) {
      console.log(`[WebhookEvent] Released ${staleRelease.count} stale processing locks`);
    }

    let processed = 0;
    while (processed < limit && (await this.processNext())) {
      processed += 1;
    }
    return processed;
  }

  private static async processNext(): Promise<boolean> {
    const now = new Date();
    const candidate = await prisma.webhookEvent.findFirst({
      where: {
        status: { in: ["PENDING", "RETRY"] },
        nextAttemptAt: { lte: now },
      },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });
    if (!candidate) return false;

    const claim = await prisma.webhookEvent.updateMany({
      where: { id: candidate.id, status: { in: ["PENDING", "RETRY"] } },
      data: { status: "PROCESSING", lockedAt: now },
    });
    if (claim.count === 0) return true; // Another worker claimed it

    const event = await prisma.webhookEvent.findUniqueOrThrow({ where: { id: candidate.id } });
    console.log(`[WebhookEvent] Processing event ${event.id} (attempt ${event.attempts + 1}/${MAX_ATTEMPTS})`);

    try {
      await WebhookService.processWebhookEvent(event.payload as unknown as MetaWebhookPayload);
      await prisma.webhookEvent.update({
        where: { id: event.id },
        data: { status: "PROCESSED", processedAt: new Date(), lockedAt: null, lastError: null },
      });
      console.log(`[WebhookEvent] Successfully processed event ${event.id}`);
    } catch (error) {
      const attempts = event.attempts + 1;
      const deadLetter = attempts >= MAX_ATTEMPTS;
      const nextAttemptAt = deadLetter ? event.nextAttemptAt : this.retryAt(attempts);

      await prisma.webhookEvent.update({
        where: { id: event.id },
        data: {
          attempts,
          status: deadLetter ? "DEAD_LETTER" : "RETRY",
          lockedAt: null,
          nextAttemptAt: nextAttemptAt,
          lastError: this.safeErrorMessage(error),
        },
      });

      if (deadLetter) {
        console.error(`[WebhookEvent] Event ${event.id} moved to DEAD_LETTER after ${MAX_ATTEMPTS} attempts:`, this.safeErrorMessage(error));
      } else {
        console.warn(`[WebhookEvent] Event ${event.id} failed (attempt ${attempts}/${MAX_ATTEMPTS}), retrying at ${nextAttemptAt.toISOString()}:`, this.safeErrorMessage(error));
      }
    }
    return true;
  }

  private static retryAt(attempts: number): Date {
    const delayMs = Math.min(60 * 60 * 1000, 1_000 * 2 ** attempts);
    return new Date(Date.now() + delayMs);
  }

  private static safeErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message.slice(0, 1_000) : "Unknown worker error";
  }

  private static isUniqueConstraintError(error: unknown): boolean {
    return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "P2002";
  }
}
