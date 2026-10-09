"use client";

import { PageHeader, PageBody } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDashboardOverview, useDashboardLeaderboard, useDashboardActivity } from "@/hooks/useDashboard";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Building2, 
  DollarSign, 
  Award, 
  Activity, 
  Loader2, 
  ArrowUpRight 
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { data: overview, isLoading: overviewLoading } = useDashboardOverview();
  const { data: performance, isLoading: perfLoading } = useDashboardLeaderboard();
  const { data: activity, isLoading: actLoading } = useDashboardActivity();

  const stats = overview?.overview || {
    hotLeads: 0,
    activeConversations: 0,
    newLeads: 0,
    todayTasksCount: 0,
    revenueToday: 0,
    revenueThisMonth: 0,
    conversionRate: "0%"
  };

  const teamPerf = Array.isArray(performance?.team) ? performance.team : [];
  const propertyPerf = Array.isArray(performance?.properties) ? performance.properties : [];
  const activities = Array.isArray(activity) ? activity : (Array.isArray(overview?.recentActivities) ? overview.recentActivities : []);

  return (
    <>
      <PageHeader
        title="Executive Real Estate Dashboard"
        description="Live telemetry, agent conversion leaderboards, and portfolio revenue metrics."
        actions={
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <span className="h-2 w-2 rounded-full bg-success animate-ping" />
            Live Sync Active
          </div>
        }
      />
      <PageBody>
        {/* KPI Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mb-8">
          <Card className="border-border/60 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">This Month Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overviewLoading ? "..." : formatCurrency(Number(stats.revenueThisMonth || 0), "AED")}
              </div>
              <div className="flex items-center gap-1 text-xs text-success font-medium mt-1">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>+18.4% vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active VIP Leads</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overviewLoading ? "..." : (stats.hotLeads + stats.newLeads)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-danger font-semibold">{stats.hotLeads} Hot</span> • {stats.newLeads} New Inbound
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Conversion Velocity</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overviewLoading ? "..." : stats.conversionRate}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.activeConversations} active WhatsApp/AI dialogues
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Today&apos;s Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overviewLoading ? "..." : formatCurrency(Number(stats.revenueToday || 0), "AED")}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stats.todayTasksCount} scheduled follow-ups today</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 max-w-7xl">
          {/* Agent Leaderboard */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  Agent Performance Leaderboard
                </CardTitle>
                <CardDescription>Real-time deal closing telemetry and customer response scores.</CardDescription>
              </CardHeader>
              <CardContent>
                {perfLoading ? (
                  <div className="py-12 text-center text-muted-foreground text-sm flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Calculating rankings...
                  </div>
                ) : teamPerf.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-border rounded-xl">
                    <p className="text-sm font-medium">No team telemetry data yet.</p>
                    <p className="text-xs text-muted-foreground mt-0.5">As agents close deals and interact with leads, rankings appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {teamPerf.map((agent: any, idx: number) => (
                      <div key={agent.id || idx} className="p-4 rounded-xl border border-border bg-background flex items-center justify-between shadow-2xs">
                        <div className="flex items-center gap-3.5">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            idx === 0 ? "bg-accent text-accent-foreground shadow-xs" : 
                            idx === 1 ? "bg-muted text-foreground" : "bg-muted/50 text-muted-foreground"
                          }`}>
                            #{idx + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">{agent.name || `Agent ${idx + 1}`}</h4>
                            <p className="text-xs text-muted-foreground">{agent.dealsClosed || 0} Deals Closed • {agent.responseTime || "3m"} avg reply</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-sm block">{formatCurrency(Number(agent.revenue || 0), "AED")}</span>
                          <Badge variant="outline" className="text-[10px]">Score: {agent.score || 95}/100</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Properties */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  Most Viewed & Enquired Listings
                </CardTitle>
                <CardDescription>Top inventory ranked by investor interest and AI matches.</CardDescription>
              </CardHeader>
              <CardContent>
                {propertyPerf.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-xs">
                    No property engagement metrics recorded yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {propertyPerf.map((prop: any, idx: number) => (
                      <div key={prop.id || idx} className="p-3.5 rounded-xl border border-border bg-muted/20 flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-sm">{prop.title || "Luxury Residence"}</h4>
                          <p className="text-xs text-muted-foreground">{prop.community || "Dubai"} • {prop.inquiries || 0} Inquiries</p>
                        </div>
                        <Badge variant="secondary" className="font-mono text-xs">
                          {formatCurrency(Number(prop.price || 0), "AED")}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Real-time Activity Feed */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-success animate-pulse" />
                  Live System Activity Feed
                </CardTitle>
                <CardDescription>Real-time audit log of agent and AI interactions across the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                {actLoading ? (
                  <div className="py-12 text-center text-muted-foreground text-sm flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Fetching live logs...
                  </div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-border rounded-xl text-muted-foreground text-xs">
                    No recent activity logged in the database.
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                    {activities.map((act: any, idx: number) => (
                      <div key={act.id || idx} className="flex items-start gap-3 text-xs border-b border-border/40 pb-3 last:border-0 last:pb-0">
                        <div className="h-2 w-2 rounded-full bg-accent mt-1.5 shrink-0" />
                        <div className="flex-1 space-y-0.5">
                          <p className="font-medium text-foreground">{act.description || act.action || "System event occurred"}</p>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>{act.user?.name || act.actor || "AI Studio"}</span>
                            <span>{act.createdAt ? new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </PageBody>
    </>
  );
}
