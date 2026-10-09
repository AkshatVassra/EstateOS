import { prisma } from "@estateos/database";
import { WebhookEventService } from "../modules/communication/webhook/webhook-event.service";

const POLL_INTERVAL_MS = 1_000;
let stopped = false;

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, () => {
    stopped = true;
  });
}

async function run(): Promise<void> {
  while (!stopped) {
    try {
      const processed = await WebhookEventService.processAvailable();
      if (processed === 0) {
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      }
    } catch (error) {
      console.error("Webhook worker failed; retrying shortly.", error instanceof Error ? error.message : error);
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }
  }
  await prisma.$disconnect();
}

void run();
