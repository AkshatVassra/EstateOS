"use client";

import Link from "next/link";
import { useState } from "react";
import { MarketingFooter, MarketingHeader } from "@/components/layout/marketing-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

export default function RegisterPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-surface">
      <MarketingHeader />
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md">
          <div className="mb-6 h-1 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full bg-accent transition-all duration-200"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>
          <h1 className="text-2xl font-semibold">Create your workspace</h1>
          <p className="mt-1 text-sm text-gray-500">Step {step} of 2</p>
          {step === 1 ? (
            <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
              <div>
                <Label>Agency name</Label>
                <Input className="mt-1" placeholder="Gulf Properties LLC" />
              </div>
              <div>
                <Label>Owner name</Label>
                <Input className="mt-1" placeholder="Akshat Sharma" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" className="mt-1" />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" className="mt-1" />
              </div>
              <Button type="submit" variant="accent" className="w-full">
                Continue
              </Button>
            </form>
          ) : (
            <form className="mt-6 space-y-4">
              <div>
                <Label>Company size</Label>
                <Input className="mt-1" placeholder="5-20 agents" />
              </div>
              <div>
                <Label>Country</Label>
                <Input className="mt-1" placeholder="United Arab Emirates" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input className="mt-1" placeholder="+971 …" />
              </div>
              <Link href="/command-center">
                <Button variant="accent" className="w-full">
                  Finish setup
                </Button>
              </Link>
            </form>
          )}
        </Card>
      </div>
      <MarketingFooter />
    </div>
  );
}