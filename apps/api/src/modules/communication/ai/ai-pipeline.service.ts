import { Message, Conversation, Prisma } from "@estateos/database";
import { ConversationRepository } from "../repositories/conversation.repository";
import { prisma } from "@estateos/database";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const extractedLeadDataSchema = z.object({
  intent: z.string().optional(),
  sentiment: z.string().optional(),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  budget: z.number().finite().positive().nullable().optional(),
  propertyType: z.string().min(1).optional().nullable(),
  tasks: z.array(z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    dueAt: z.string().datetime().optional(),
  })).default([]),
  appointments: z.array(z.object({
    title: z.string().optional(),
    date: z.string().datetime().optional(),
  })).default([]),
});

type ExtractedLeadData = z.infer<typeof extractedLeadDataSchema>;

export class AIPipelineService {
  private static getGeminiModel() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("[AI PIPELINE] GEMINI_API_KEY not configured in environment.");
      return null;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    return genAI.getGenerativeModel({ model: modelName });
  }

  /**
   * Run the AI pipeline for every incoming message using Gemini AI
   */
  static async processIncomingMessage(message: Message, conversation: Conversation) {
    // 1. Fetch conversation history for context
    const fullConversation = await ConversationRepository.findById(conversation.id, conversation.agencyId);
    if (!fullConversation) return;

    // 2. Call Gemini model to extract intelligence
    const extractedData = await this.extractLeadData(message.body);
    
    // 3. Update CRM (Lead) with extracted data
    if (conversation.leadId) {
      await this.updateLeadFromExtractedData(conversation.leadId, extractedData);
    }

    // 4. Generate Smart Reply using Gemini AI
    const historyMessages = fullConversation.messages || [];
    const smartReply = await this.generateSmartReply(message.body, historyMessages, extractedData);
    
    // 5. Update Conversation Summary & Score
    await this.updateConversationSummary(conversation.id, extractedData);

    // 6. Action Engine (Tasks & Appointments)
    if (conversation.leadId) {
      await this.processIntentActions(conversation.leadId, conversation.id, conversation.agencyId, extractedData);
    }

    return {
      extractedData,
      smartReply
    };
  }

  private static async extractLeadData(textBody: string): Promise<ExtractedLeadData> {
    const model = this.getGeminiModel();
    if (!model) {
      return this.fallbackExtractLeadData(textBody);
    }

    try {
      const prompt = `
You are a Real Estate AI Assistant for EstateOS CRM. Analyze the following incoming WhatsApp client message and extract intelligence into valid JSON format.

Client Message: "${textBody}"

Respond STRICTLY with a valid JSON object matching this schema (do NOT include markdown code fences or extra text):
{
  "intent": "EXPLORATION" | "VIEWING" | "FOLLOW_UP" | "BUY",
  "sentiment": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
  "urgency": "LOW" | "MEDIUM" | "HIGH",
  "budget": number or null (extract exact numerical budget if mentioned e.g. 5000000),
  "propertyType": string or null (e.g. "Villa", "Apartment", "Penthouse"),
  "tasks": [
    {
      "title": "string",
      "description": "string",
      "dueAt": "ISO date string"
    }
  ],
  "appointments": [
    {
      "title": "string",
      "date": "ISO date string"
    }
  ]
}
`;

      const result = await model.generateContent(prompt);
      const rawText = result.response.text().trim();
      const cleanedJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = extractedLeadDataSchema.safeParse(JSON.parse(cleanedJson) as unknown);
      if (!parsed.success) {
        throw new Error("Gemini returned an invalid lead extraction payload.");
      }
      return parsed.data;
    } catch (error) {
      console.error("[AI PIPELINE] Error parsing Gemini lead data, falling back:", error);
      return this.fallbackExtractLeadData(textBody);
    }
  }

  private static fallbackExtractLeadData(textBody: string): ExtractedLeadData {
    const lower = textBody.toLowerCase();
    const data: ExtractedLeadData = {
      intent: 'EXPLORATION',
      sentiment: 'NEUTRAL',
      urgency: 'LOW',
      tasks: [],
      appointments: []
    };

    if (lower.includes('million') || lower.includes('budget') || lower.includes(' m')) {
      data.budget = 5000000;
    }
    if (lower.includes('villa')) data.propertyType = 'Villa';
    if (lower.includes('apartment')) data.propertyType = 'Apartment';
    
    if (lower.includes('tomorrow') || lower.includes('visit') || lower.includes('viewing')) {
      data.intent = 'VIEWING';
      data.urgency = 'HIGH';
      data.appointments.push({
        title: 'Property Viewing',
        date: new Date(Date.now() + 86400000).toISOString()
      });
    }
    
    if (lower.includes('decide') || lower.includes('later') || lower.includes('follow up')) {
      data.intent = 'FOLLOW_UP';
      data.tasks.push({
        title: 'Follow up on property interest',
        description: 'Lead requested time to decide.',
        dueAt: new Date(Date.now() + 86400000 * 2).toISOString()
      });
    }

    return data;
  }

  private static async generateSmartReply(
    textBody: string,
    history: Array<Pick<Message, "sender" | "body">>,
    data: ExtractedLeadData,
  ): Promise<string> {
    const model = this.getGeminiModel();
    if (!model) {
      return this.fallbackGenerateSmartReply(data);
    }

    try {
      const recentHistory = history.slice(-5).map(m => `${m.sender}: ${m.body}`).join("\n");
      const prompt = `
You are EstateOS AI, an expert, polite, and luxury real estate copilot for Dubai Real Estate agencies.
Generate a direct, helpful, and natural response to reply to the client on WhatsApp.

Conversation Context:
${recentHistory}

Latest Client Message: "${textBody}"
Extracted Intelligence: ${JSON.stringify(data)}

Instructions:
- Keep the response short (1 to 3 sentences maximum) suitable for WhatsApp.
- Be friendly, professional, and directly address their request (properties, budgets, viewings).
- If they ask for viewings, offer to arrange a slot.
- Output ONLY the reply text, no quotes or metadata.
`;

      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      console.error("[AI PIPELINE] Error generating Gemini smart reply:", error);
      return this.fallbackGenerateSmartReply(data);
    }
  }

  private static fallbackGenerateSmartReply(data: ExtractedLeadData): string {
    if (data.intent === 'VIEWING') {
      return "I would be happy to schedule a viewing for you! Is tomorrow good?";
    }
    return "Thank you for reaching out to EstateOS. Let me find the best luxury properties matching your criteria.";
  }

  private static async updateLeadFromExtractedData(leadId: string, data: ExtractedLeadData): Promise<void> {
    const updatePayload: Prisma.LeadUncheckedUpdateInput = {};
    if (data.budget != null) updatePayload.budget = data.budget;
    if (data.propertyType) updatePayload.propertyType = data.propertyType;
    if (data.intent) updatePayload.intent = data.intent;
    
    if (Object.keys(updatePayload).length > 0) {
      console.log(`[AI PIPELINE] Auto-updating CRM Lead ${leadId}`);
      await prisma.lead.update({
        where: { id: leadId },
        data: updatePayload
      });
    }
  }

  private static async processIntentActions(
    leadId: string,
    conversationId: string,
    agencyId: string,
    data: ExtractedLeadData,
  ) {
    if (data.tasks.length > 0) {
      console.log(`[AI PIPELINE] Auto-creating Follow-Up Tasks`);
      for (const task of data.tasks) {
        await prisma.task.create({
          data: {
            agencyId,
            leadId,
            title: task.title || 'Follow up with lead',
            description: task.description || 'Generated by AI Copilot',
            dueAt: task.dueAt ? new Date(task.dueAt) : new Date(Date.now() + 86400000),
            source: 'AI_COPILOT'
          }
        });
      }
    }

    if (data.appointments.length > 0) {
      console.log(`[AI PIPELINE] Auto-creating Appointments`);
      for (const appointment of data.appointments) {
        await prisma.appointment.create({
          data: {
            agencyId,
            leadId,
            conversationId,
            title: appointment.title || 'Property Viewing',
            date: appointment.date ? new Date(appointment.date) : new Date(Date.now() + 86400000)
          }
        });
      }
    }
  }

  private static async updateConversationSummary(conversationId: string, data: ExtractedLeadData): Promise<void> {
    console.log(`[AI PIPELINE] Saving Conversation Summary`);
    await prisma.conversationSummary.create({
      data: {
        conversationId,
        summary: `Gemini AI Analysis: Intent=${data.intent || 'UNKNOWN'}, Urgency=${data.urgency || 'LOW'}, Budget=${data.budget || 'N/A'}`,
        intent: data.intent || 'EXPLORATION'
      }
    });
  }
}
