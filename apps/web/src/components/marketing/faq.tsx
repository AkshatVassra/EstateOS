"use client";

﻿
import { Badge } from "@/components/ui/badge";
import { Accordion } from "@/components/ui/accordion";

const faqs = [
  {
    title: "How does the AI Lead Qualification work?",
    content: "When a lead contacts you via WhatsApp or your website, our AI instantly replies, asks qualifying questions (budget, location, timeline), and scores the lead based on their answers.",
  },
  {
    title: "Does it integrate with my existing WhatsApp number?",
    content: "Yes! EstateOS connects directly to your WhatsApp Business API, allowing our AI to respond on your behalf using your official agency number.",
  },
  {
    title: "Is it difficult to set up?",
    content: "Not at all. Most agencies are fully set up within 24 hours. Our onboarding team will guide you through connecting your WhatsApp, importing properties, and inviting your team.",
  },
  {
    title: "Can I take over the chat from the AI?",
    content: "Absolutely. At any point, an agent can click 'Take Over' in the inbox to pause the AI and chat with the lead manually.",
  },
  {
    title: "Is my data secure?",
    content: "Security is our top priority. All data is encrypted at rest and in transit. We comply with GDPR and never share your leads or property data with third parties.",
  },
];

export function FAQ() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">FAQ</Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Common questions.
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <Accordion items={faqs} />
      </div>
    </section>
  );
}
