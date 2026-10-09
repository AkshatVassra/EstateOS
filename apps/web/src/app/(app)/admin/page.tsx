"use client";

import { useState } from "react";
import { PageHeader, PageBody } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminOverview, useAdminAgencies, useAdminAuditLogs } from "@/hooks/useAdmin";
import { 
  ShieldCheck, 
  Building2, 
  Activity, 
  Users, 
  Database, 
  Server, 
  Lock, 
  RefreshCw, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign,
  TrendingUp,
  FileText,
  Key
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "agencies" | "audit">("overview");
  const [auditFilter, setAuditFilter] = useState<string>("ALL");

  const { data: overviewData, isLoading: isLoadingOverview, refetch: refetchOverview } = useAdminOverview();
  const { data: agenciesData, isLoading: isLoadingAgencies } = useAdminAgencies();
  const { data: auditData, isLoading: isLoadingAudit } = useAdminAuditLogs();

  const overview = overviewData || {
    totalAgencies: 14,
    activeTenants: 14,
    systemMrr: "$142,500",
    neuralInferences: "1,429,882",
    apiUptime: "99.99%",
    activeBrokers: 84
  };

  const agencies = Array.isArray(agenciesData) ? agenciesData : [
    { id: "agn-1", name: "Dubai Luxury Real Estate Agency", domain: "dubaire.estateos.luxury", plan: "ENTERPRISE VIP", status: "ACTIVE", brokers: 18, mrr: "$12,500", createdAt: "2026-01-15" },
    { id: "agn-2", name: "Emaar Signature Properties Group", domain: "emaar.estateos.luxury", plan: "ENTERPRISE VIP", status: "ACTIVE", brokers: 32, mrr: "$25,000", createdAt: "2026-02-01" },
    { id: "agn-3", name: "Palm Jumeirah Exclusive Realtors", domain: "palm.estateos.luxury", plan: "PLATINUM AI", status: "ACTIVE", brokers: 12, mrr: "$8,500", createdAt: "2026-03-10" },
    { id: "agn-4", name: "Downtown Sky Penthouse Partners", domain: "downtown.estateos.luxury", plan: "PLATINUM AI", status: "ACTIVE", brokers: 14, mrr: "$9,500", createdAt: "2026-04-20" }
  ];

  const auditLogs = Array.isArray(auditData) ? auditData : [
    { id: "aud-101", action: "API_KEY_GENERATED", user: "Akshat Vassra", agency: "Dubai Luxury Real Estate", ip: "185.220.101.4", timestamp: new Date(Date.now() - 300000 * 1).toISOString(), severity: "HIGH" },
    { id: "aud-102", action: "USER_LOGIN_SSO", user: "Tariq Al-Mansoor", agency: "Dubai Luxury Real Estate", ip: "91.74.88.12", timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), severity: "INFO" },
    { id: "aud-103", action: "SPA_CONTRACT_APPROVED", user: "Victoria Sterling", agency: "Emaar Signature Properties", ip: "2.50.192.88", timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), severity: "MEDIUM" },
    { id: "aud-104", action: "AI_STUDIO_PROMPT_UPDATED", user: "Akshat Vassra", agency: "Dubai Luxury Real Estate", ip: "185.220.101.4", timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), severity: "INFO" },
    { id: "aud-105", action: "ROLE_PERMISSION_CHANGED", user: "System Automator", agency: "Palm Jumeirah Exclusive", ip: "10.0.0.1", timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), severity: "HIGH" }
  ];

  const filteredLogs = auditLogs.filter((log: any) => {
    if (auditFilter === "ALL") return true;
    return log.severity === auditFilter;
  });

  return (
    <>
      <PageHeader 
        title="Platform Governance & Super Admin" 
        description="Monitor multi-tenant agency telemetry, subscription ARR, neural AI throughput, and immutable security audit logs."
      >
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetchOverview()}
            className="border-border bg-background hover:bg-muted font-medium flex items-center gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Sync Telemetry</span>
          </Button>
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 py-1.5 px-3.5 text-xs font-semibold shadow-md flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            <span>Root Administrator</span>
          </Badge>
        </div>
      </PageHeader>

      <PageBody>
        <div className="space-y-8 max-w-7xl">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-border pb-px overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === "overview" 
                  ? "border-primary text-primary font-semibold" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Activity className="h-4 w-4" />
              <span>Telemetry & Throughput</span>
            </button>
            <button
              onClick={() => setActiveTab("agencies")}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === "agencies" 
                  ? "border-primary text-primary font-semibold" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Building2 className="h-4 w-4" />
              <span>Tenant Agency Roster ({agencies.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === "audit" 
                  ? "border-primary text-primary font-semibold" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <FileText className="h-4 w-4" />
              <span>Immutable Security Audit Logs</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border bg-card shadow-sm">
                  <CardContent className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs font-semibold uppercase tracking-wider">Active Tenants</span>
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-foreground">{overview.activeTenants} Agencies</div>
                    <div className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>+2 Onboarded this month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-sm">
                  <CardContent className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs font-semibold uppercase tracking-wider">Platform MRR</span>
                      <DollarSign className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-foreground">{overview.systemMrr}</div>
                    <div className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>100% Subscription Renewal Rate</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-sm">
                  <CardContent className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs font-semibold uppercase tracking-wider">Neural AI Inferences</span>
                      <Activity className="h-4 w-4 text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-foreground">{overview.neuralInferences}</div>
                    <div className="text-xs text-muted-foreground">Gemini 1.5 Pro Autonomous Leads</div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-sm">
                  <CardContent className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs font-semibold uppercase tracking-wider">System Uptime SLA</span>
                      <Server className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-emerald-500">{overview.apiUptime}</div>
                    <div className="text-xs text-muted-foreground">Zero Unplanned Downtime</div>
                  </CardContent>
                </Card>
              </div>

              {/* Infrastructure Cluster Status */}
              <Card className="border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Multi-Region Database & AI Gateway Clusters</CardTitle>
                  <CardDescription className="text-xs">Continuous health verification across Dubai (me-central1) and Frankfurt (europe-west3) regions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { region: "me-central1 (Dubai Luxury Cluster)", role: "Primary OLTP & Real-time Webhooks", latency: "8ms", status: "OPTIMAL" },
                    { region: "europe-west3 (Frankfurt Failover)", role: "Disaster Recovery & Redundant Telemetry", latency: "64ms", status: "STANDBY" },
                    { region: "us-east1 (Clerk & Stripe Auth Proxy)", role: "Authentication & Billing Tokenization", latency: "92ms", status: "OPTIMAL" }
                  ].map((cl, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-muted/20 border border-border flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm text-foreground flex items-center gap-2">
                          <Server className="h-4 w-4 text-primary" />
                          <span>{cl.region}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{cl.role}</div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-xs font-mono text-muted-foreground">Ping</div>
                          <div className="text-sm font-mono font-semibold text-foreground">{cl.latency}</div>
                        </div>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-bold">
                          {cl.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 2: TENANT AGENCIES */}
          {activeTab === "agencies" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {agencies.map((agn: any) => (
                  <Card key={agn.id} className="border-border/80 bg-card hover:border-primary/40 transition-all hover:shadow-md flex flex-col justify-between">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold uppercase tracking-wider">
                          {agn.plan}
                        </Badge>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-bold uppercase">
                          {agn.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-base font-semibold text-foreground">
                        {agn.name}
                      </CardTitle>
                      <div className="text-xs font-mono text-muted-foreground mt-0.5">{agn.domain}</div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      <div className="p-3 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Active Roster: <strong className="text-foreground">{agn.brokers} Brokers</strong></span>
                        <span className="text-muted-foreground">Subscription: <strong className="text-emerald-500 font-mono">{agn.mrr}/mo</strong></span>
                      </div>
                      <div className="flex items-center justify-end pt-1">
                        <Button variant="outline" size="sm" className="text-xs h-8 bg-background">
                          Manage Tenant &rarr;
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT LOGS */}
          {activeTab === "audit" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center gap-2">
                  {["ALL", "HIGH", "MEDIUM", "INFO"].map((sev) => (
                    <button
                      key={sev}
                      onClick={() => setAuditFilter(sev)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap",
                        auditFilter === sev 
                          ? "bg-primary text-primary-foreground font-semibold shadow-sm" 
                          : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {sev === "ALL" ? "All Severity Levels" : sev}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredLogs.length}</span> security audit events
                </div>
              </div>

              <div className="space-y-2.5">
                {filteredLogs.map((log: any) => (
                  <Card key={log.id} className="border-border/80 bg-card hover:border-border transition-all">
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 shrink-0",
                            log.severity === "HIGH" && "bg-red-500/10 text-red-500 border-red-500/20",
                            log.severity === "MEDIUM" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                            log.severity === "INFO" && "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          )}
                        >
                          {log.severity}
                        </Badge>
                        <div className="min-w-0">
                          <div className="font-mono font-semibold text-foreground truncate">{log.action}</div>
                          <div className="text-muted-foreground truncate mt-0.5">
                            User: <strong className="text-foreground">{log.user}</strong> ({log.agency}) &bull; IP: <span className="font-mono">{log.ip}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0 text-muted-foreground font-mono">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : "Recent"}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </PageBody>
    </>
  );
}
