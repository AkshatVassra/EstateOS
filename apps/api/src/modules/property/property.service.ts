import { ApiError } from "@/utils/api-error";
import { PropertyRepository } from "./property.repository";
import { Prisma, PropertyStatus } from "@estateos/database";
import { prisma } from "@/lib/prisma";
import { AiService } from "@/modules/ai/ai.service";
import { PropertyMatchingService } from "./property-matching.service";
import type { z } from "zod";
import type { createPropertySchema, updatePropertySchema } from "./property.validator";

type CreatePropertyInput = z.infer<typeof createPropertySchema>;
type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;

export class PropertyService {
  static async createProperty(agencyId: string, data: CreatePropertyInput) {
    const dbData: Prisma.PropertyUncheckedCreateInput = {
      ...data,
      agencyId,
    };

    const property = await PropertyRepository.create(dbData);

    // Cross-Module Trigger 1: Auto-generate marketing description
    try {
      const captionData = await AiService.generateCaption(agencyId, property.id, "Instagram", "Luxury");
      await prisma.property.update({
        where: { id: property.id },
        data: { description: (property.description || "") + "\n\n--- AI Suggested Caption ---\n" + captionData.caption }
      });
    } catch (err) {
      console.error("[PROPERTY AI TRIGGER ERROR]", err);
    }

    // Cross-Module Trigger 2: Update Dashboard Stats
    try {
      const existingStat = await prisma.dashboardStat.findFirst({
        where: { agencyId, metric: "ACTIVE_LISTINGS" }
      });
      if (existingStat) {
        await prisma.dashboardStat.update({
          where: { id: existingStat.id },
          data: { value: existingStat.value + 1 }
        });
      } else {
        await prisma.dashboardStat.create({
          data: { agencyId, metric: "ACTIVE_LISTINGS", value: 1 }
        });
      }
    } catch (err) {
      console.error("[PROPERTY DASHBOARD STAT ERROR]", err);
    }

    // Cross-Module Trigger 3: Match with existing leads and notify agents
    try {
      const matchingLeads = await prisma.lead.findMany({
        where: {
          agencyId,
          status: { notIn: ["CLOSED_WON", "CLOSED_LOST", "LOST", "DORMANT"] },
          budget: { gte: property.price } // Leads with budget >= property price
        },
        take: 10
      });

      for (const lead of matchingLeads) {
        if (lead.assignedUserId) {
          await prisma.notification.create({
            data: {
              userId: lead.assignedUserId,
              message: `🏡 New Property Match! '${property.title}' matches your lead ${lead.name}'s budget.`,
              isRead: false
            }
          });
          
          await prisma.task.create({
            data: {
              agencyId,
              leadId: lead.id,
              userId: lead.assignedUserId,
              title: `Pitch matched property: ${property.title}`,
              description: `This new listing matches ${lead.name}'s budget. Send them a WhatsApp message!`,
              priority: "HIGH",
              dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day
            }
          });
        }
      }
    } catch (err) {
      console.error("[PROPERTY MATCHING ERROR]", err);
    }

    return property;
  }

  static async getProperty(id: string, agencyId: string) {
    const property = await PropertyRepository.findById(id, agencyId);
    if (!property) {
      throw ApiError.notFound("Property not found");
    }
    return property;
  }

  static async getAllProperties(agencyId: string, skip = 0, take = 20, status?: string) {
    return PropertyRepository.findAll(agencyId, { skip, take, status: status as PropertyStatus | undefined });
  }

  static async getMatches(agencyId: string, leadId: string, take = 5) {
    const lead = await prisma.lead.findFirst({ where: { id: leadId, agencyId } });
    if (!lead) throw ApiError.notFound("Lead not found");

    const properties = await prisma.property.findMany({
      where: { agencyId, status: "AVAILABLE" },
      include: { communityRel: true, amenitiesLinks: true },
      orderBy: { createdAt: "desc" },
    });

    return properties
      .map((property) => ({
        property,
        ...PropertyMatchingService.score(lead, property),
      }))
      .sort((left, right) => right.score - left.score)
      .slice(0, take);
  }

  static async updateProperty(id: string, agencyId: string, data: UpdatePropertyInput) {
    await this.getProperty(id, agencyId);
    return PropertyRepository.update(id, agencyId, data);
  }

  static async deleteProperty(id: string, agencyId: string) {
    await this.getProperty(id, agencyId);
    return PropertyRepository.delete(id, agencyId);
  }
}
