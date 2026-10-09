import {
  LeadStatus,
  LeadTemperature,
  Prisma,
  prisma,
  PropertyStatus,
  SubscriptionStatus,
} from "@estateos/database";
import { encryptWhatsAppToken } from "../../../apps/api/src/modules/communication/token-crypto";

const DEMO_AGENCY_SLUG = "demo-gulf-properties";

export async function main() {
  const ownerRole = await prisma.role.upsert({
    where: { id: "00000000-0000-4000-8000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-4000-8000-000000000001",
      name: "Owner",
    },
  });

  await prisma.permission.upsert({
    where: { key: "admin" },
    update: {},
    create: { key: "admin" },
  });

  const agency = await prisma.agency.upsert({
    where: { slug: DEMO_AGENCY_SLUG },
    update: {},
    create: {
      name: "Gulf Properties LLC",
      slug: DEMO_AGENCY_SLUG,
      country: "AE",
      companySize: "5-20",
    },
  });

  await prisma.subscription.upsert({
    where: { agencyId: agency.id },
    update: {},
    create: {
      agencyId: agency.id,
      plan: "professional",
      status: SubscriptionStatus.TRIALING,
      trialEndsAt: new Date(Date.now() + 14 * 86400000),
    },
  });

  await prisma.agencySettings.upsert({
    where: { agencyId: agency.id },
    update: {},
    create: {
      agencyId: agency.id,
      data: {
        ai: { autoReply: true, defaultModel: "claude-sonnet" },
        whatsapp: { enabled: true },
      },
    },
  });

  const metaPhoneNumberId = process.env.META_PHONE_NUMBER_ID;
  const metaBusinessAccountId = process.env.META_BUSINESS_ACCOUNT_ID;
  const metaAccessToken = process.env.META_ACCESS_TOKEN;
  const metaVerifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN;

  if (metaPhoneNumberId && metaBusinessAccountId && metaAccessToken && metaVerifyToken) {
    await prisma.whatsAppAccount.upsert({
      where: { phoneNumberId: metaPhoneNumberId },
      update: {
        agencyId: agency.id,
        businessAccountId: metaBusinessAccountId,
        accessTokenEncrypted: encryptWhatsAppToken(metaAccessToken),
        verifyToken: metaVerifyToken,
        status: "ACTIVE",
      },
      create: {
        agencyId: agency.id,
        phoneNumberId: metaPhoneNumberId,
        businessAccountId: metaBusinessAccountId,
        accessTokenEncrypted: encryptWhatsAppToken(metaAccessToken),
        verifyToken: metaVerifyToken,
        status: "ACTIVE",
      },
    });
  } else {
    console.log("Skipping WhatsApp account seed: Meta credentials are not configured.");
  }

  const demoUser = await prisma.user.upsert({
    where: { clerkUserId: "dev_local_user" },
    update: {},
    create: {
      agencyId: agency.id,
      clerkUserId: "dev_local_user",
      email: "demo@estateos.app",
      name: "Akshat Sharma",
      roleId: ownerRole.id,
    },
  });

  const lead1 = await prisma.lead.upsert({
    where: {
      agencyId_phone: { agencyId: agency.id, phone: "+971501234567" },
    },
    update: {},
    create: {
      agencyId: agency.id,
      assignedUserId: demoUser.id,
      name: "Rajesh Kumar",
      phone: "+971501234567",
      status: LeadStatus.QUALIFYING,
      temperature: LeadTemperature.HOT,
      score: 93,
      budgetMin: new Prisma.Decimal(2200000),
      budgetMax: new Prisma.Decimal(2600000),
      bedrooms: 3,
      preferredAreas: ["Dubai Hills"],
      nationality: "Indian",
      intent: "residence",
      paymentType: "mortgage",
      timelineDays: 30,
      tags: ["whatsapp", "mortgage"],
    },
  });

  await prisma.property.upsert({
    where: {
      agencyId_slug: { agencyId: agency.id, slug: "dubai-hills-3br-park-view" },
    },
    update: {},
    create: {
      agencyId: agency.id,
      title: "3BR Park View — Dubai Hills Estate",
      slug: "dubai-hills-3br-park-view",
      price: new Prisma.Decimal(2450000),
      bedrooms: 3,
      bathrooms: 4,
      community: "Dubai Hills",
      developer: "Emaar",
      status: PropertyStatus.AVAILABLE,
    },
  });

  const conversation = await prisma.conversation.create({
    data: {
      agencyId: agency.id,
      leadId: lead1.id,
      channel: "WHATSAPP",
      status: "OPEN"
    }
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation.id,
        agencyId: agency.id,
        sender: "+971501234567",
        receiver: "SYSTEM",
        direction: "INBOUND",
        body: "Hi, looking for 3 bed in Dubai Hills around 2.5M",
      },
      {
        conversationId: conversation.id,
        agencyId: agency.id,
        sender: "SYSTEM",
        receiver: "+971501234567",
        direction: "OUTBOUND",
        aiGenerated: true,
        body: "Great choice. Are you planning mortgage or cash, and when do you hope to move in?",
      },
      {
        conversationId: conversation.id,
        agencyId: agency.id,
        sender: "+971501234567",
        receiver: "SYSTEM",
        direction: "INBOUND",
        body: "Mortgage, Indian nationality, need within 30 days for family",
      },
    ],
  });

  console.log("Seed complete:", agency.slug, lead1.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
