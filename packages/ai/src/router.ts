import type {
  AIProviderName,
  CompletionRequest,
  CompletionResult,
  LeadSlots,
  QualificationResult,
} from "./types";

function extractSlotsFromText(text: string): LeadSlots {
  const lower = text.toLowerCase();
  const slots: LeadSlots = {};

  const bedMatch = lower.match(/(\d)\s*bed/);
  if (bedMatch) slots.bedrooms = parseInt(bedMatch[1], 10);

  if (lower.includes("dubai hills")) slots.preferredAreas = ["Dubai Hills"];
  if (lower.includes("marina")) slots.preferredAreas = ["Marina"];

  const budgetMatch = lower.match(/(\d+\.?\d*)\s*m/);
  if (budgetMatch) {
    const m = parseFloat(budgetMatch[1]);
    slots.budgetMax = m * 1_000_000;
    slots.budgetMin = m * 1_000_000 * 0.9;
  }

  if (lower.includes("mortgage")) slots.paymentType = "mortgage";
  if (lower.includes("cash")) slots.paymentType = "cash";
  if (lower.includes("invest")) slots.intent = "investment";
  if (lower.includes("family") || lower.includes("living")) slots.intent = "residence";
  if (lower.includes("indian")) slots.nationality = "Indian";

  const dayMatch = lower.match(/(\d+)\s*day/);
  if (dayMatch) slots.timelineDays = parseInt(dayMatch[1], 10);
  if (lower.includes("30 day") || lower.includes("30 days")) slots.timelineDays = 30;

  let filled = 0;
  if (slots.budgetMax) filled += 2;
  if (slots.bedrooms) filled += 1;
  if (slots.preferredAreas?.length) filled += 1;
  if (slots.timelineDays) filled += 1;
  if (slots.paymentType) filled += 1;
  if (slots.intent) filled += 1;

  const score = Math.min(100, 15 + filled * 14);
  slots.score = score;
  slots.temperature = score >= 75 ? "HOT" : score >= 40 ? "WARM" : "COLD";
  slots.nextAction =
    score >= 75 ? "Book viewing and send top 3 matches" : "Continue qualification";

  return slots;
}

async function callOpenAI(req: CompletionRequest): Promise<CompletionResult | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      max_tokens: req.maxTokens ?? 512,
      temperature: req.temperature ?? 0.4,
      messages: [
        { role: "system", content: req.system },
        ...req.messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  return {
    text: data.choices[0]?.message?.content ?? "",
    provider: "openai",
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
  };
}

async function callAnthropic(req: CompletionRequest): Promise<CompletionResult | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514",
      max_tokens: req.maxTokens ?? 512,
      system: req.system,
      messages: req.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as {
    content: { type: string; text: string }[];
  };
  const text = data.content.find((c) => c.type === "text")?.text ?? "";
  return {
    text,
    provider: "anthropic",
    model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514",
  };
}

export async function complete(req: CompletionRequest): Promise<CompletionResult> {
  const chain = (process.env.AI_PROVIDER_CHAIN ?? "anthropic,openai,mock").split(
    ","
  ) as AIProviderName[];

  for (const provider of chain) {
    if (provider === "anthropic") {
      const r = await callAnthropic(req);
      if (r) return r;
    }
    if (provider === "openai") {
      const r = await callOpenAI(req);
      if (r) return r;
    }
  }

  const lastUser = [...req.messages].reverse().find((m) => m.role === "user");
  const slots = extractSlotsFromText(lastUser?.content ?? "");
  const reply =
    slots.score && slots.score >= 75
      ? "Thank you — I have enough to suggest a few Dubai Hills options in your budget. Would Saturday or Sunday work for a viewing?"
      : "Thanks for reaching out. To share the best options, what budget range and bedroom count are you looking for, and is this for investment or to live in?";

  return { text: reply, provider: "mock", model: "estateos-heuristic-v1" };
}

const QUALIFY_SYSTEM = `You are EstateOS sales AI for a Dubai real estate agency.
Be concise (WhatsApp style, under 500 chars). Qualify: budget, beds, area, timeline, cash/mortgage, investment vs residence.
Do not be overly friendly. Ask at most one follow-up if info is missing.
Reply with plain text only — no JSON.`;

export async function qualifyAndReply(
  history: { role: "user" | "assistant"; content: string }[]
): Promise<QualificationResult> {
  const result = await complete({
    system: QUALIFY_SYSTEM,
    messages: history,
    maxTokens: 400,
    temperature: 0.3,
  });

  const lastUser = [...history].reverse().find((m) => m.role === "user");
  const slots = extractSlotsFromText(
    `${lastUser?.content ?? ""}\n${result.text}`
  );

  return { reply: result.text.trim(), slots };
}

export function computeScore(slots: LeadSlots): number {
  return slots.score ?? 0;
}
