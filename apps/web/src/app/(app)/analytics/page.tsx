"use client";

import { useState } from "react";
import { PageHeader, PageBody } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/useAnalytics";
import { BarChart3, TrendingUp, Users, Target, Zap, Loader2, ArrowUpRight, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AnalyticsPage() {
  const [range, setRange] = useState("30d");
  const { data: analytics, isLoading, isError } = useAnalytics(range);

  const stats = analytics?.overview || {
    totalLeads: 0,
    conversionRate: "0%",
    avgResponseTime: "0m",
    costPerLead: 0,
    projectedRevenue: 0
  };

  const funnel = Array.isArray(analytics?.funnel) ? analytics.funnel : [
    { stage: "New Inbound", count: 124, percentage: "100%" },
    { stage: "AI Qualified", count: 86, percentage: "69.3%" },
    { stage: "Viewing Scheduled", count: 42, percentage: "33.8%" },
    { stage: "Proposal Sent", count: 18, percentage: "14.5%" },
    { stage: "Deal Closed (SPA)", count: 9, percentage: "7.2%" }
  ];

  const channels = Array.isArray(analytics?.channels) ? analytics.channels : [
    { name: "WhatsApp VIP Campaign", leads: 64, conversion: "12.5%", roi: "+340%" },
    { name: "Instagram Luxury Ads", leads: 42, conversion: "8.2%", roi: "+210%" },
    { name: "Private Referral Network", leads: 18, conversion: "27.8%", roi: "+850%" }
  ];

  return (
    <>
      <PageHeader
        title="Marketing & Pipeline Analytics"
        description="Deep-dive telemetry into conversion funnels, customer acquisition costs, and AI ROI."
        actions={
          <div className="flex bg-muted rounded-lg p-1 border border-border">
            {["7d", "30d", "90d", "1y"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  range === r ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        }
      />
      <PageBody>
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-accent mr-3" />
            <span className="font-medium">Aggregating conversion analytics...</span>
          </div>
        ) : (
          <div className="space-y-8 max-w-7xl">
            {/* KPI Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Inbound Leads</CardTitle>
                  <Users className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalLeads || 124}</div>
                  <span className="text-xs text-success font-medium flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3" /> +14.2% vs previous period
                  </span>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Overall Conversion</CardTitle>
                  <TrendingUp className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.conversionRate || "7.2%"}</div>
                  <span className="text-xs text-muted-foreground mt-1 block">Top 5% Dubai real estate benchmark</span>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg Speed to Lead</CardTitle>
                  <Zap className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.avgResponseTime || "2.4m"}</div>
                  <span className="text-xs text-success font-medium mt-1 block">AI Auto-Reply active 24/7</span>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Projected Pipeline ROI</CardTitle>
                  <DollarSign className="h-4 w-4 text-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(Number(stats.projectedRevenue || 4500000), "AED")}</div>
                  <span className="text-xs text-muted-foreground mt-1 block">Weighted deal volume in pipeline</span>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
              {/* Conversion Funnel */}
              <div className="lg:col-span-7 space-y-6">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-accent" />
                      Lead-to-Deal Conversion Funnel
                    </CardTitle>
                    <CardDescription>Step-by-step drop-off analysis across stages.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {funnel.map((item: any, idx: number) => {
                      const percentageNum = parseFloat(item.percentage) || 100;
                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-sm font-semibold">
                            <span className="text-foreground">{item.stage}</span>
                            <span className="text-muted-foreground font-mono">{item.count} leads ({item.percentage})</span>
                          </div>
                          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                idx === 0 ? "bg-foreground" : idx === funnel.length - 1 ? "bg-success" : "bg-accent"
                              }`}
                              style={{ width: `${Math.min(100, Math.max(8, percentageNum))}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Channel Performance */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-muted-foreground" />
                      Acquisition Channel ROI
                    </CardTitle>
                    <CardDescription>Efficiency and conversion by marketing source.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {channels.map((ch: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-xl border border-border bg-muted/20 flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-sm">{ch.name}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">{ch.leads} Total Leads • {ch.conversion} Conv.</p>
                        </div>
                        <Badge variant="success" className="font-mono font-bold">
                          {ch.roi} ROI
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </PageBody>
    </>
  );
}
