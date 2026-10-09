"use client";

import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/layout/marketing-header";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-surface">
      <MarketingHeader />
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </Card>
      </div>
      <MarketingFooter />
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your agency workspace">
      <form className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" className="mt-1" placeholder="you@agency.com" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" className="mt-1" />
        </div>
        <Link href="/forgot-password" className="text-sm text-accent hover:underline">
          Forgot password?
        </Link>
        <Link href="/command-center">
          <Button type="button" variant="accent" className="mt-2 w-full">
            Continue
          </Button>
        </Link>
        <Button type="button" variant="outline" className="w-full">
          Continue with Google
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">
        New agency?{" "}
        <Link href="/register" className="text-accent hover:underline">
          Start free trial
        </Link>
      </p>
    </AuthShell>
  );
}