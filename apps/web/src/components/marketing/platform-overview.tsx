"use client";

﻿
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Users, Building, MessageCircle, BarChart } from "lucide-react";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "leads", label: "Leads", icon: Users },
  { id: "properties", label: "Properties", icon: Building },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "analytics", label: "Analytics", icon: BarChart },
];

export function PlatformOverview() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <section className="py-24 md:py-32 bg-muted/20 border-y border-border/50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="outline" className="mb-4">Platform Overview</Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Everything in its right place.
          </h2>
          <p className="text-lg text-muted-foreground">
            A command center for your entire real estate agency.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-foreground text-background shadow-md" 
                    : "bg-background border border-border/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative mx-auto max-w-5xl rounded-[24px] border border-border/50 bg-background/50 p-2 shadow-2xl overflow-hidden min-h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20 pointer-events-none" />
          
          <div className="rounded-[18px] border border-border bg-card h-full w-full overflow-hidden relative">
            {/* Browser Fake Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b border-border">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-border" />
                <div className="h-3 w-3 rounded-full bg-border" />
                <div className="h-3 w-3 rounded-full bg-border" />
              </div>
            </div>

            <div className="p-8 h-[500px] flex items-center justify-center relative bg-grid-white/[0.02]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="h-20 w-20 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6 shadow-inner">
                    {(() => {
                      const ActiveIcon = tabs.find((t) => t.id === activeTab)?.icon;
                      return ActiveIcon ? <ActiveIcon className="h-10 w-10" /> : null;
                    })()}
                  </div>
                  <h3 className="text-2xl font-semibold mb-2 capitalize">{activeTab} View</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Interactive preview of the {activeTab} interface showcasing premium Apple-style design and layout.
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
