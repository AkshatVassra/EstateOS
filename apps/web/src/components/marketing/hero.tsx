"use client";

﻿
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, MessageCircle, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
      {/* Background Gradients */}
      <div className="absolute top-0 inset-x-0 h-full w-full bg-background overflow-hidden -z-10">
        <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-accent/20 blur-[120px] opacity-50" />
        <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-purple-500/20 blur-[120px] opacity-50" />
      </div>

      <div className="mx-auto max-w-7xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <Badge variant="outline" className="mb-8 border-accent/30 bg-accent/5 backdrop-blur-md text-accent px-4 py-1.5 text-sm">
            <Sparkles className="h-4 w-4 mr-2" />
            Introducing EstateOS
          </Badge>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[1.1] max-w-5xl text-foreground">
            The AI Operating System for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-600">
              Modern Real Estate
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Qualify leads instantly. Recommend properties automatically. Manage your entire agency from one beautiful platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all hover:scale-105 shadow-xl shadow-foreground/10">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/book-demo">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-border/50 bg-background/50 backdrop-blur-sm hover:bg-muted transition-all">
                Book a Demo
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-20 relative mx-auto w-full max-w-5xl"
        >
          <div className="relative rounded-[24px] border border-border/50 bg-background/50 backdrop-blur-2xl p-2 shadow-2xl shadow-accent/10">
            <div className="rounded-[18px] overflow-hidden border border-border bg-card">
              {/* Fake Browser Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <div className="mx-auto bg-background/50 border border-border/50 rounded-md px-3 py-1 text-xs text-muted-foreground font-mono">
                  app.estateos.com
                </div>
              </div>
              {/* Dashboard Content Fake */}
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 min-h-[400px]">
                {/* Sidebar */}
                <div className="w-48 hidden md:flex flex-col gap-2">
                  {['Dashboard', 'Inbox', 'Leads', 'Properties', 'Analytics'].map((item, i) => (
                    <div key={i} className={`px-3 py-2 rounded-lg text-sm font-medium ${i === 0 ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:bg-muted'}`}>
                      {item}
                    </div>
                  ))}
                </div>
                {/* Main Content */}
                <div className="flex-1 flex flex-col gap-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-2xl font-semibold">Overview</h3>
                      <p className="text-sm text-muted-foreground">Welcome back to EstateOS</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { label: "New Leads", value: "24" },
                      { label: "AI Matches", value: "156" },
                      { label: "Close Rate", value: "32%" }
                    ].map((stat, i) => (
                      <div key={i} className="p-4 rounded-xl border border-border/50 bg-background">
                        <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-3xl font-semibold">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 rounded-xl border border-border/50 bg-background/50 flex items-center justify-center p-6 text-muted-foreground text-sm">
                    Interactive chart simulation
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 md:-left-10 top-20 flex items-center gap-3 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl p-4 shadow-xl"
            >
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">AI Replying on WhatsApp</p>
                <p className="text-xs text-muted-foreground">To 3 buyers right now</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -right-4 md:-right-10 bottom-20 flex items-center gap-3 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl p-4 shadow-xl"
            >
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Deal Closed</p>
                <p className="text-xs text-muted-foreground">$24,000 Commission</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
