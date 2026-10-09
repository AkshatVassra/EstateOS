"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

import { Hero } from "@/components/marketing/hero";
import { Problem } from "@/components/marketing/problem";
import { BentoGrid } from "@/components/marketing/bento-grid";
import { PlatformOverview } from "@/components/marketing/platform-overview";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { WhyEstateOS } from "@/components/marketing/why-estateos";
import { AIFeatures } from "@/components/marketing/ai-features";
import { DashboardShowcase } from "@/components/marketing/dashboard-showcase";
import { Pricing } from "@/components/marketing/pricing";

import { FAQ } from "@/components/marketing/faq";
import { Footer } from "@/components/marketing/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent/30 selection:text-accent">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center shadow-md">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Estate<span className="text-muted-foreground">OS</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-5">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link href="/command-center">
                <Button variant="ghost" className="hidden sm:inline-flex">Dashboard</Button>
              </Link>
              <UserButton />
            </Show>
          </div>
        </div>
      </nav>

      <main>
        <Hero />
        <Problem />
        <BentoGrid />
        <PlatformOverview />
        <HowItWorks />
        <WhyEstateOS />
        <AIFeatures />
        <DashboardShowcase />
        <Pricing />

        <FAQ />
      </main>

      <Footer />
    </div>
  );
}