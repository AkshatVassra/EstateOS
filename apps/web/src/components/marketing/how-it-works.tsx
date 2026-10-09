"use client";

﻿
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { UserPlus, MessageCircle, BrainCircuit, Search, CalendarCheck, Handshake } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Lead Generation", desc: "New lead arrives via ads or website." },
  { icon: MessageCircle, title: "WhatsApp Init", desc: "EstateOS sends an instant WhatsApp message." },
  { icon: BrainCircuit, title: "AI Qualification", desc: "AI asks questions to determine intent and budget." },
  { icon: Search, title: "Property Match", desc: "AI finds and sends perfect properties from inventory." },
  { icon: CalendarCheck, title: "Booking", desc: "Buyer books a viewing directly in the chat." },
  { icon: Handshake, title: "Deal Closed", desc: "Agent takes over the viewing and closes the deal." },
];

export function HowItWorks() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">How It Works</Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            A seamless automated flow.
          </h2>
          <p className="text-lg text-muted-foreground">
            Watch how EstateOS transforms a click into a closed deal without lifting a finger until it matters.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connecting Line */}
          <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2 hidden sm:block" />

          <div className="space-y-12 relative">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`flex flex-col sm:flex-row items-start sm:items-center gap-6 ${
                  i % 2 === 0 ? "sm:flex-row-reverse text-left sm:text-right" : "text-left"
                }`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? "sm:pr-12" : "sm:pl-12"} pt-2 sm:pt-0`}>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>

                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-background bg-accent text-white shadow-lg shadow-accent/20">
                  <step.icon className="h-6 w-6" />
                </div>

                <div className="flex-1 hidden sm:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
