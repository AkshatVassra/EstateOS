"use client";

﻿
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Search, Calendar, BarChart, Users, Sparkles, Building, ListTodo } from "lucide-react";

const bentoItems = [
  {
    title: "AI Lead Qualification",
    desc: "Automatically filter out window shoppers and identify high-intent buyers.",
    colSpan: "md:col-span-2",
    icon: Sparkles,
    gradient: "from-blue-500/10 to-indigo-500/10",
  },
  {
    title: "WhatsApp Automation",
    desc: "Instant replies, property matching, and schedulingâ€”all in WhatsApp.",
    colSpan: "md:col-span-1",
    icon: MessageCircle,
    gradient: "from-green-500/10 to-emerald-500/10",
  },
  {
    title: "Property Inventory",
    desc: "Manage all your listings in one beautiful, searchable database.",
    colSpan: "md:col-span-1",
    icon: Building,
    gradient: "from-orange-500/10 to-amber-500/10",
  },
  {
    title: "Smart Analytics",
    desc: "Track agent performance, lead sources, and revenue metrics in real-time.",
    colSpan: "md:col-span-2",
    icon: BarChart,
    gradient: "from-purple-500/10 to-pink-500/10",
  },
  {
    title: "Team Management",
    desc: "Assign leads, set permissions, and collaborate seamlessly.",
    colSpan: "md:col-span-1",
    icon: Users,
    gradient: "from-cyan-500/10 to-blue-500/10",
  },
  {
    title: "AI Content Studio",
    desc: "Generate property descriptions and marketing flyers in seconds.",
    colSpan: "md:col-span-1",
    icon: Search,
    gradient: "from-red-500/10 to-rose-500/10",
  },
  {
    title: "Automated Scheduling",
    desc: "Let buyers book viewings directly based on your availability.",
    colSpan: "md:col-span-1",
    icon: Calendar,
    gradient: "from-yellow-500/10 to-orange-500/10",
  },
];

export function BentoGrid() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">Platform</Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Everything Your Agency Needs
          </h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive suite of tools designed specifically for modern real estate professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          {bentoItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group relative overflow-hidden rounded-[24px] border border-border/50 bg-background/50 p-8 transition-all hover:border-accent/50 ${item.colSpan}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-50 transition-opacity group-hover:opacity-100`} />
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="h-12 w-12 rounded-2xl bg-background border border-border flex items-center justify-center shadow-sm">
                  <item.icon className="h-6 w-6 text-foreground" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
