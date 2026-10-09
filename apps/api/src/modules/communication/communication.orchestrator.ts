import { prisma } from '@estateos/database';
import { AIPipelineService } from './ai/ai-pipeline.service';
import { LeadScoringService } from '../lead/lead-scoring.service';
import { normalizePhone } from './phone';
import { WhatsAppSenderService, WhatsAppTemplateRequiredError } from './whatsapp-sender.service';

export class CommunicationOrchestrator {
  /**
   * The 19-step ripple effect for inbound communication.
   */
  static async processInboundMessage(agencyId: string, fromPhone: string, messageBody: string, providerMessageId: string, phoneNumberId?: string, contactName?: string) {
    const normalizedPhone = normalizePhone(fromPhone);

    const existingMessage = await prisma.message.findFirst({
      where: { agencyId, providerMessageId },
      select: { id: true, conversationId: true },
    });
    if (existingMessage) {
      return { success: true, duplicate: true, conversationId: existingMessage.conversationId };
    }

    // STEP 1: Find or Create Conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        agencyId,
        participants: {
          some: { phone: normalizedPhone }
        }
      },
      include: { lead: true, participants: true }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          agencyId,
          channel: 'WHATSAPP',
          participants: {
            create: { phone: normalizedPhone, role: 'CUSTOMER' }
          }
        },
        include: { lead: true, participants: true }
      });
      console.log(`[V2 Engine] Created new conversation ${conversation.id}`);
    }

    // STEP 2: Find or Create Lead
    let lead = conversation.lead;
    if (!lead) {
      // Try to find by phone across the agency
      lead = await prisma.lead.findUnique({
        where: {
          agencyId_phone: {
            agencyId,
            phone: normalizedPhone
          }
        }
      });

      if (!lead) {
        lead = await prisma.lead.create({
          data: {
            agencyId,
            phone: normalizedPhone,
            name: contactName?.trim() || 'WhatsApp Contact',
            source: 'whatsapp',
            status: 'NEW',
          }
        });
      }

      // Link conversation to lead
      conversation = await prisma.conversation.update({
        where: { id: conversation.id },
        data: { leadId: lead.id },
        include: { lead: true, participants: true }
      });
      console.log(`[V2 Engine] Linked lead ${lead.id} to conversation`);
    }

    // STEP 3: Save Message
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        agencyId,
        sender: normalizedPhone,
        receiver: 'SYSTEM',
        body: messageBody,
        direction: 'INBOUND',
        providerMessageId
      }
    });

    const previousTemperature = lead.temperature;

    // Extract and persist CRM facts before deriving the lead score. Scoring the
    // pre-extraction record made a buyer's first detailed message look cold.
    const aiResult = await AIPipelineService.processIncomingMessage(message, conversation);
    const messageCount = await prisma.message.count({
      where: { conversationId: conversation.id, direction: 'INBOUND' },
    });
    lead = await prisma.lead.findUniqueOrThrow({ where: { id: lead.id } });
    const score = LeadScoringService.calculate({
      budget: lead.budget,
      budgetMin: lead.budgetMin,
      budgetMax: lead.budgetMax,
      timelineDays: lead.timelineDays,
      bedrooms: lead.bedrooms,
      preferredAreas: lead.preferredAreas,
      intent: lead.intent,
      messageCount,
      viewingRequested: /\b(view|viewing|visit|see)\b/i.test(messageBody),
    });
    lead = await prisma.lead.update({
      where: { id: lead.id },
      data: { score: score.score, leadScore: score.score, temperature: score.temperature, lastMessageAt: new Date() },
    });

    if (score.temperature === "HOT" && previousTemperature !== "HOT") {
      await this.createHotLeadActions(agencyId, lead.id, lead.name, lead.assignedUserId, score.score);
    }

    // STEP 7: Timeline & Conversation Activity
    await prisma.conversationActivity.create({
      data: {
        conversationId: conversation.id,
        type: 'MESSAGE_RECEIVED',
        details: JSON.stringify({ messageId: message.id, aiAnalysis: aiResult?.smartReply || 'Processed' })
      }
    });

    // STEP 8: Send Reply to WhatsApp if generated
    if (aiResult?.smartReply && phoneNumberId) {
      try {
        const externalMessageId = await WhatsAppSenderService.sendText({
          phoneNumberId,
          to: normalizedPhone,
          body: aiResult.smartReply,
          lastInboundAt: new Date(),
        });
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            agencyId,
            sender: 'SYSTEM',
            receiver: normalizedPhone,
            body: aiResult.smartReply,
            direction: 'OUTBOUND',
            aiGenerated: true,
            providerMessageId: externalMessageId,
          },
        });
      } catch (error) {
        if (error instanceof WhatsAppTemplateRequiredError) {
          console.warn("Auto-reply requires an approved WhatsApp template.");
        } else {
          console.error("Unable to send WhatsApp auto-reply.", error instanceof Error ? error.message : error);
        }
      }
    }

    return {
      success: true,
      conversationId: conversation.id,
      leadId: lead.id,
      aiAnalysis: aiResult
    };
  }

  private static async createHotLeadActions(
    agencyId: string,
    leadId: string,
    leadName: string,
    assignedUserId: string | null,
    score: number,
  ): Promise<void> {
    const existingHotTask = await prisma.task.findFirst({
      where: { agencyId, leadId, source: "LEAD_HOT", status: { in: ["TODO", "IN_PROGRESS"] } },
    });
    if (!existingHotTask) {
      await prisma.task.create({
        data: {
          agencyId,
          leadId,
          userId: assignedUserId,
          title: `Contact hot lead: ${leadName}`,
          description: `Lead score is ${score}. Review matching properties and follow up now.`,
          priority: "URGENT",
          source: "LEAD_HOT",
          dueAt: new Date(Date.now() + 15 * 60 * 1000),
        },
      });
    }
    if (assignedUserId) {
      await prisma.notification.create({
        data: { userId: assignedUserId, message: `Hot lead alert: ${leadName} reached a score of ${score}.`, isRead: false },
      });
    }
  }
}
