"use client";

﻿
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const testimonials = [
  {
    quote: "EstateOS completely changed how we handle leads. We respond instantly and only talk to qualified buyers now.",
    name: "Sarah Jenkins",
    role: "Founder, Prime Realty",
    stat: "3x More Viewings",
  },
  {
    quote: "The WhatsApp integration is flawless. Buyers think they are talking to a real agent because the AI is so natural.",
    name: "Michael Chen",
    role: "Director, Chen Properties",
    stat: "Zero Missed Leads",
  },
  {
    quote: "We scaled from 5 to 15 agents easily because the system handles all the manual onboarding and lead distribution.",
    name: "Emma Watson",
    role: "Managing Director, Horizon",
    stat: "200% Growth",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-muted/30 border-y border-border/50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">Customers</Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Loved by top agencies.
          </h2>
          <p className="text-lg text-muted-foreground">
            Don't just take our word for it. See what our users are saying.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 rounded-[24px] border border-border/50 bg-background flex flex-col justify-between"
            >
              <div>
                <div className="text-accent mb-6">
                  â˜…â˜…â˜…â˜…â˜…
                </div>
                <p className="text-lg mb-8">"{t.quote}"</p>
              </div>
              
              <div className="flex items-center justify-between border-t border-border/50 pt-6">
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
                <Badge variant="accent" className="bg-accent/10 text-accent hover:bg-accent/10">
                  {t.stat}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
