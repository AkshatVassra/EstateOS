"use client";

import { PageHeader, PageBody } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBilling, useCreateCheckout } from "@/hooks/useBilling";
import { CreditCard, Check, Zap, Shield, FileText, Loader2, ExternalLink } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function BillingPage() {
  const { data: billing, isLoading, isError } = useBilling();
  const checkoutMutation = useCreateCheckout();

  const subscription = billing?.subscription || { plan: "pro", status: "ACTIVE", currentPeriodEnd: new Date(Date.now() + 86400000 * 30).toISOString() };
  const invoices = Array.isArray(billing?.invoices) ? billing.invoices : [];
  const plans = Array.isArray(billing?.plans) ? billing.plans : [
    { id: "starter", name: "EstateOS Starter", price: 299, currency: "USD", features: ["Up to 5 Agents", "1,000 AI Tokens/mo", "Basic CRM & Leads", "Email Support"] },
    { id: "pro", name: "EstateOS Pro AI", price: 799, currency: "USD", features: ["Up to 25 Agents", "25,000 AI Tokens/mo", "Full AI Studio (12 Tools)", "WhatsApp & Multi-channel Inbox", "Priority Support"], popular: true },
    { id: "enterprise", name: "EstateOS Enterprise", price: 1999, currency: "USD", features: ["Unlimited Agents", "Unlimited AI Tokens", "Custom AI Fine-tuning", "Dedicated Account Manager", "SLA & 24/7 Phone Support"] }
  ];

  const handleUpgrade = async (priceId: string) => {
    try {
      const res = await checkoutMutation.mutateAsync({ priceId });
      if (res && res.url) {
        window.location.href = res.url;
      }
    } catch (err) {
      console.error("Checkout failed:", err);
    }
  };

  return (
    <>
      <PageHeader 
        title="Billing & Subscription Plans" 
        description="Manage your EstateOS agency subscription, view AI token usage tiers, and download invoices." 
      />
      <PageBody>
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-accent mr-3" />
            <span className="font-medium">Loading billing overview...</span>
          </div>
        ) : (
          <div className="space-y-10 max-w-7xl">
            {/* Current Plan Overview */}
            <Card className="border-accent/40 bg-gradient-to-r from-accent/10 via-background to-background shadow-md">
              <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="accent" className="uppercase px-2.5 py-0.5 text-xs font-bold">
                      {subscription.status || "ACTIVE"}
                    </Badge>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Current Tier</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {subscription.plan ? `EstateOS ${subscription.plan.toUpperCase()}` : "EstateOS Pro AI Plan"}
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-xl">
                    Your subscription includes unlimited CRM access, automated cross-module lead scoring, and access to all 12 flagship AI Studio tools.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                  <Button variant="outline" className="gap-2">
                    <CreditCard className="h-4 w-4" />
                    Update Payment Method
                  </Button>
                  <Button variant="accent" className="gap-2">
                    <Zap className="h-4 w-4" />
                    Manage Add-ons
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Tiers */}
            <div className="space-y-4">
              <div className="text-center max-w-2xl mx-auto mb-6">
                <h3 className="text-xl sm:text-2xl font-bold">Available Upgrade Tiers</h3>
                <p className="text-sm text-muted-foreground mt-1">Scale your luxury real estate agency with higher token allowances and enterprise AI coaching.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan: any) => {
                  const isCurrent = subscription.plan?.toLowerCase() === plan.id.toLowerCase();
                  return (
                    <Card 
                      key={plan.id} 
                      className={`relative flex flex-col justify-between transition-all duration-300 ${
                        plan.popular 
                          ? "border-accent shadow-xl bg-card/80 scale-[1.02]" 
                          : "border-border shadow-sm hover:shadow-md"
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge variant="accent" className="uppercase font-bold px-3 py-0.5 shadow-sm">
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      <CardHeader className="pt-8 pb-4">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <div className="mt-4 flex items-baseline gap-1">
                          <span className="text-4xl font-extrabold tracking-tight">${plan.price}</span>
                          <span className="text-muted-foreground text-sm font-medium">/ month</span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-between space-y-6">
                        <ul className="space-y-3 text-sm">
                          {plan.features?.map((feat: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2.5 text-foreground/90">
                              <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                        <Button 
                          variant={isCurrent ? "outline" : plan.popular ? "accent" : "default"} 
                          className="w-full mt-6 font-semibold"
                          disabled={isCurrent || checkoutMutation.isPending}
                          onClick={() => handleUpgrade(plan.id)}
                        >
                          {checkoutMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : null}
                          {isCurrent ? "Current Plan" : `Upgrade to ${plan.name.replace("EstateOS ", "")}`}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Invoices Table */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  Billing History & Invoices
                </CardTitle>
                <CardDescription>Download official tax invoices and payment receipts for your agency.</CardDescription>
              </CardHeader>
              <CardContent>
                {invoices.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-border rounded-xl">
                    <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-sm font-medium">No past invoices found.</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Your upcoming billing cycle receipts will appear here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-border text-muted-foreground font-medium text-xs uppercase">
                        <tr>
                          <th className="pb-3">Invoice ID</th>
                          <th className="pb-3">Date</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {invoices.map((inv: any) => (
                          <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-3.5 font-medium font-mono text-xs">{inv.id || "INV-0001"}</td>
                            <td className="py-3.5 text-muted-foreground">
                              {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : "Recent"}
                            </td>
                            <td className="py-3.5 font-semibold">
                              {formatCurrency(Number(inv.amount || 0), "USD")}
                            </td>
                            <td className="py-3.5">
                              <Badge variant="success" className="text-[10px]">PAID</Badge>
                            </td>
                            <td className="py-3.5 text-right">
                              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                                Download PDF
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </PageBody>
    </>
  );
}
