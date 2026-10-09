"use client";

﻿
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$49",
    desc: "Perfect for solo agents starting with AI.",
    features: [
      "1 Agent",
      "Up to 500 leads/mo",
      "Basic WhatsApp Automation",
      "Standard Property Matching",
      "Email Support",
    ],
  },
  {
    name: "Growth",
    price: "$199",
    desc: "For growing teams ready to scale their revenue.",
    isPopular: true,
    features: [
      "Up to 5 Agents",
      "Unlimited Leads",
      "Advanced AI Qualification",
      "Custom WhatsApp Bots",
      "Analytics Dashboard",
      "Priority Support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For large brokerages needing custom solutions.",
    features: [
      "Unlimited Agents",
      "Custom AI Models",
      "White-labeling Options",
      "Dedicated Account Manager",
      "Custom Integrations",
      "SLA Guarantee",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">Pricing</Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Simple, transparent pricing.
          </h2>
          <p className="text-lg text-muted-foreground">
            Invest in AI that pays for itself with the first closed deal.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`relative rounded-[24px] p-8 border ${
                plan.isPopular 
                  ? "border-accent/50 bg-background shadow-2xl shadow-accent/10 scale-105 z-10" 
                  : "border-border/50 bg-background/50 backdrop-blur-sm"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Badge variant="accent" className="bg-accent text-white px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-medium mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-muted-foreground">/mo</span>}
                </div>
                <p className="text-sm text-muted-foreground">{plan.desc}</p>
              </div>

              <Button 
                variant={plan.isPopular ? "default" : "outline"} 
                className={`w-full mb-8 h-12 rounded-xl ${plan.isPopular ? 'bg-foreground text-background hover:bg-foreground/90' : ''}`}
              >
                {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
              </Button>

              <div className="space-y-4">
                <p className="text-sm font-medium">Includes:</p>
                {plan.features.map((feat, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="text-sm">{feat}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
