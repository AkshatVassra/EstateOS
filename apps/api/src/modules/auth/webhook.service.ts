import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { ApiError } from "@/utils/api-error";
import { prisma } from "@/lib/prisma";

export class WebhookService {
  static async handleClerkWebhook(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      throw new Error("Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local");
    }

    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      throw ApiError.badRequest("Error occured -- no svix headers");
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      throw ApiError.badRequest("Error occured");
    }

    const eventType = evt.type;

    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      const primaryEmail = email_addresses.find((email) => email.id === evt.data.primary_email_address_id);

      const fullName = `${first_name || ""} ${last_name || ""}`.trim() || primaryEmail?.email_address || "User";

      await prisma.user.upsert({
        where: { clerkUserId: id },
        update: {
          name: fullName,
          firstName: first_name || "",
          lastName: last_name || "",
          email: primaryEmail?.email_address || "",
          avatarUrl: image_url,
        },
        create: {
          clerkUserId: id,
          name: fullName,
          firstName: first_name || "",
          lastName: last_name || "",
          email: primaryEmail?.email_address || "",
          avatarUrl: image_url,
          agencyId: "temp-agency-id", // Note: The user needs a way to select or create an agency.
        },
      });
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;
      if (id) {
        await prisma.user.delete({
          where: { clerkUserId: id },
        });
      }
    }

    return true;
  }
}
