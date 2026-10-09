"use client";

﻿
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, ShieldCheck, Zap } from "lucide-react";

const reasons = [
  {
    icon: Clock,
    title: "Respond 24/7",
    desc: "Never miss a lead because you were asleep or in a meeting.",
  },
  {
    icon: ShieldCheck,
    title: "Never lose a lead",
    desc: "Every interaction is logged, tracked, and followed up automatically.",
  },
  {
    icon: TrendingUp,
    title: "Increase conversions",
    desc: "Speed to lead is everything. AI responds instantly, increasing your close rate.",
  },
  {
    icon: Zap,
    title: "Reduce manual work",
    desc: "Free your agents from data entry so they can focus on building relationships.",
  },
];

export function WhyEstateOS() {
  return (
    <section className="py-24 md:py-32 bg-muted/30 border-y border-border/50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">Why EstateOS</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Grow your agency without growing your headcount.
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              EstateOS acts as your ultimate digital assistant, ensuring every lead is nurtured, qualified, and matched with the perfect property.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {reasons.map((reason, i) => (
                <div key={i} className="flex flex-col gap-2 p-4 rounded-2xl bg-background border border-border/50 shadow-sm hover:border-accent/30 transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <reason.icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold">{reason.title}</h4>
                  <p className="text-sm text-muted-foreground">{reason.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[600px] rounded-[32px] overflow-hidden border border-border bg-card p-2 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 via-background to-purple-500/20 opacity-50 pointer-events-none" />
            <div className="w-full h-full rounded-[24px] border border-border/50 bg-background flex flex-col p-6 items-center justify-center text-center">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-white shadow-xl mb-6">
                <TrendingUp className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-bold mb-2">300% ROI</h3>
              <p className="text-muted-foreground max-w-xs">
                Agencies using EstateOS report a 3x increase in lead conversion rates within the first 30 days.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
