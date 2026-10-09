"use client";

﻿
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Brain, FileText, Image, Search, ShieldAlert, Users, CalendarDays, LineChart, MessageCircle } from "lucide-react";

const features = [
  { icon: Brain, title: "AI Lead Qualification" },
  { icon: ShieldAlert, title: "AI Buyer Scoring" },
  { icon: Search, title: "AI Property Matching" },
  { icon: MessageCircle, title: "AI WhatsApp Replies" },
  { icon: FileText, title: "AI Proposal Generator" },
  { icon: Image, title: "AI Flyer Generator" },
  { icon: CalendarDays, title: "AI Sales Coach" },
  { icon: LineChart, title: "AI Market Insights" },
];

export function AIFeatures() {
  return (
    <section className="py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="accent" className="mb-4 bg-accent/10 text-accent border-accent/20">
            Powered by AI
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Intelligence in every feature.
          </h2>
          <p className="text-lg text-muted-foreground">
            Not just a wrapper. We've built AI deeply into every workflow to automate the impossible.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="p-6 rounded-[20px] border border-border/50 bg-background hover:bg-muted/50 transition-colors flex flex-col items-center text-center gap-4 group"
            >
              <div className="h-14 w-14 rounded-2xl bg-accent/5 group-hover:bg-accent/10 border border-accent/10 flex items-center justify-center text-accent transition-colors">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="font-medium">{feature.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
