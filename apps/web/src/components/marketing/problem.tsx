"use client";

﻿
import { motion } from "framer-motion";
import { FileSpreadsheet, MessageCircle, Calendar, Mail, ArrowRight, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Problem() {
  return (
    <section className="py-24 md:py-32 bg-muted/30 border-y border-border/50 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">The Problem</Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Real Estate is broken.
          </h2>
          <p className="text-lg text-muted-foreground">
            Too many tools. Too much manual work. You're losing deals because your leads are scattered and follow-ups are slow.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr,auto,1fr] gap-8 items-center max-w-5xl mx-auto">
          {/* Old Way */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[24px] border border-border/50 bg-background/50 backdrop-blur-sm p-8 shadow-sm flex flex-col items-center justify-center h-full relative"
          >
            <div className="absolute inset-0 bg-red-500/5 rounded-[24px] pointer-events-none" />
            <h3 className="text-xl font-semibold mb-8 text-muted-foreground">The Old Way</h3>
            
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: MessageCircle, label: "WhatsApp" },
                { icon: FileSpreadsheet, label: "Excel" },
                { icon: Mail, label: "Email" },
                { icon: Calendar, label: "Calendar" },
                { icon: FileSpreadsheet, label: "Google Sheets" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="h-14 w-14 rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground shadow-sm">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
                </div>
              ))}
            </div>
            
            <p className="mt-8 text-sm text-center text-muted-foreground">
              Scattered context. Manual data entry.<br />Lost opportunities.
            </p>
          </motion.div>

          {/* Arrow */}
          <div className="hidden lg:flex flex-col items-center text-muted-foreground">
            <div className="h-px w-16 bg-border" />
            <ArrowRight className="h-6 w-6 my-4 text-accent" />
            <div className="h-px w-16 bg-border" />
          </div>
          
          <div className="lg:hidden flex justify-center text-muted-foreground py-4">
            <ArrowRight className="h-8 w-8 rotate-90 text-accent" />
          </div>

          {/* New Way */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[24px] border border-accent/20 bg-accent/5 p-8 shadow-lg shadow-accent/10 flex flex-col items-center justify-center h-full relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-purple-500/10 rounded-[24px] pointer-events-none" />
            
            <h3 className="text-xl font-semibold mb-8 text-foreground">The EstateOS Way</h3>
            
            <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-white shadow-xl shadow-accent/20 mb-6">
              <Zap className="h-10 w-10" />
            </div>
            
            <h4 className="text-2xl font-bold mb-2">One Platform.</h4>
            <p className="text-center font-medium text-muted-foreground">
              Everything Connected.
            </p>
            <p className="mt-4 text-sm text-center text-muted-foreground">
              AI handles the busywork.<br />You focus on closing.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
