import { ApiError } from "@/utils/api-error";
import { LeadRepository } from "./lead.repository";
import { LeadStatus, Prisma } from "@estateos/database";
import { prisma } from "@/lib/prisma";
import type { z } from "zod";
import type { createLeadSchema, updateLeadSchema } from "./lead.validator";

type CreateLeadInput = z.infer<typeof createLeadSchema>;
type UpdateLeadInput = z.infer<typeof updateLeadSchema>;

export class LeadService {
  static async createLead(agencyId: string, data: CreateLeadInput) {
    const name = `${data.firstName || ""} ${data.lastName || ""}`.trim() || "Unknown";
    
    // Calculate automated AI Lead Score & buying intent
    let leadScore = 50;
    let temperature: "COLD" | "WARM" | "HOT" = "COLD";
    let intent = "Exploring Dubai real estate market";

    const budgetVal = Number(data.budget || 0);
    const timelineDaysVal = 90;

    if (budgetVal >= 5000000 || timelineDaysVal <= 30 || data.source === "REFERRAL" || data.source === "WHATSAPP") {
      leadScore = 85;
      temperature = "HOT";
      intent = "High buying intent for luxury residential property";
    } else if (budgetVal >= 2000000 || timelineDaysVal <= 60) {
      leadScore = 68;
      temperature = "WARM";
      intent = "Moderate buying intent looking for investment yield";
    }

    const dbData: Prisma.LeadUncheckedCreateInput = {
      ...data,
      name,
      agencyId,
      leadScore,
      score: leadScore,
      temperature,
      intent
    };

    const lead = await LeadRepository.create(dbData);
    
    await LeadRepository.addActivity({
      leadId: lead.id,
      activity: `Lead created via ${data.source || "manual"} (AI Score: ${leadScore})`,
    });

    // Cross-Module Trigger 1: Create automated follow-up task due in 24 hours
    try {
      await prisma.task.create({
        data: {
          agencyId,
          leadId: lead.id,
          userId: lead.assignedUserId || null,
          title: `Initial Outreach & Qualification: ${lead.name}`,
          description: `Contact lead via phone or WhatsApp. AI buying intent: ${intent}`,
          priority: temperature === "HOT" ? "HIGH" : "MEDIUM",
          dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      });
    } catch (err) {
      console.error("[CROSS-MODULE TRIGGER ERROR] Failed to create follow-up task:", err);
    }

    // Cross-Module Trigger 2: Notify assigned agent if present
    if (lead.assignedUserId) {
      try {
        await prisma.notification.create({
          data: {
            userId: lead.assignedUserId,
            message: `🔥 New ${temperature} lead assigned to you: ${lead.name} (${intent})`,
            isRead: false
          }
        });
      } catch (err) {
        console.error("[CROSS-MODULE TRIGGER ERROR] Failed to notify user:", err);
      }
    }

    // Cross-Module Trigger 3: Update Dashboard Stats
    try {
      const existingStat = await prisma.dashboardStat.findFirst({
        where: { agencyId, metric: "TOTAL_LEADS" }
      });
      if (existingStat) {
        await prisma.dashboardStat.update({
          where: { id: existingStat.id },
          data: { value: existingStat.value + 1 }
        });
      } else {
        await prisma.dashboardStat.create({
          data: { agencyId, metric: "TOTAL_LEADS", value: 1 }
        });
      }
    } catch (err) {
      console.error("[CROSS-MODULE TRIGGER ERROR] Failed to update dashboard stat:", err);
    }

    return lead;
  }

  static async getLead(id: string, agencyId: string) {
    const lead = await LeadRepository.findById(id, agencyId);
    if (!lead) {
      throw ApiError.notFound("Lead not found");
    }
    return lead;
  }

  static async getAllLeads(agencyId: string, skip = 0, take = 20, status?: string) {
    return LeadRepository.findAll(agencyId, { skip, take, status: status as LeadStatus | undefined });
  }

  static async updateLead(id: string, agencyId: string, data: UpdateLeadInput) {
    const lead = await this.getLead(id, agencyId);
    const updateData: Prisma.LeadUncheckedUpdateInput = { ...data };
    if (updateData.firstName || updateData.lastName) {
      updateData.name = `${updateData.firstName || lead.firstName || ""} ${updateData.lastName || lead.lastName || ""}`.trim() || "Unknown";
    }

    return LeadRepository.update(id, agencyId, updateData);
  }

  static async deleteLead(id: string, agencyId: string) {
    await this.getLead(id, agencyId);
    return LeadRepository.delete(id, agencyId);
  }

  static async assignLead(id: string, agencyId: string, userId: string, authUserId: string) {
    await this.getLead(id, agencyId);
    
    // You could verify the user to assign belongs to the same agency here
    
    const updated = await LeadRepository.update(id, agencyId, { assignedUserId: userId });
    
    await LeadRepository.addActivity({
      leadId: id,
      activity: `Lead assigned to user ${userId}`,
      createdBy: authUserId,
    });

    // Cross-Module Trigger: Notify assigned agent
    try {
      await prisma.notification.create({
        data: {
          userId,
          message: `📋 Lead reassigned to you: ${updated.name}`,
          isRead: false
        }
      });
    } catch (err) {
      console.error("[CROSS-MODULE TRIGGER ERROR] Failed to notify assigned user:", err);
    }

    return updated;
  }

  static async addNote(id: string, agencyId: string, userId: string, note: string) {
    await this.getLead(id, agencyId);

    const createdNote = await LeadRepository.addNote({
      leadId: id,
      userId,
      note,
    });

    await LeadRepository.addActivity({
      leadId: id,
      activity: "Note added",
      createdBy: userId,
    });

    return createdNote;
  }
}
