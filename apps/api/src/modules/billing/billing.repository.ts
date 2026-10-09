import { prisma } from "@/lib/prisma";
import { Prisma } from "@estateos/database";

export class BillingRepository {
  static async getSubscription(agencyId: string) {
    return prisma.subscription.findUnique({
      where: { agencyId },
    });
  }

  static async updateSubscription(
    agencyId: string,
    data: Pick<Prisma.SubscriptionUncheckedCreateInput, "plan" | "status" | "stripeCustomerId" | "stripeSubscriptionId" | "trialEndsAt">,
  ) {
    return prisma.subscription.upsert({
      where: { agencyId },
      update: data,
      create: {
        agencyId,
        ...data,
      },
    });
  }

  static async getInvoices(agencyId: string) {
    return prisma.invoice.findMany({
      where: { agencyId },
      orderBy: { id: "desc" }, // Usually ordered by createdAt
    });
  }
}
