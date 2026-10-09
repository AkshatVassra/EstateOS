"use client";

﻿
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const views = [
  "Dashboard",
  "Inbox",
  "Lead Details",
  "Properties",
  "Marketing",
  "Analytics",
  "Calendar",
  "Team",
  "Billing",
];

export function DashboardShowcase() {
  return (
    <section className="py-24 md:py-32 bg-muted/30 border-y border-border/50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">Dashboard Showcase</Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            A page for every need.
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore the depth of EstateOS. Beautifully crafted interfaces for every aspect of your business.
          </p>
        </div>

        {/* Marquee effect for dashboard screenshots / views */}
        <div className="relative w-full overflow-hidden flex flex-col gap-6">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-muted/30 to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-muted/30 to-transparent z-10" />
          
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-6 min-w-max"
          >
            {[...views, ...views].map((view, i) => (
              <div 
                key={i} 
                className="w-[400px] h-[250px] rounded-[20px] border border-border/50 bg-background shadow-sm p-6 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-4">
                  <div className="h-3 w-3 rounded-full bg-border" />
                  <div className="h-3 w-3 rounded-full bg-border" />
                  <div className="h-3 w-3 rounded-full bg-border" />
                  <span className="ml-2 text-sm font-medium">{view}</span>
                </div>
                <div className="flex-1 rounded-xl bg-muted/50 border border-border/30 flex items-center justify-center text-muted-foreground text-sm">
                  {view} Interface Mockup
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
