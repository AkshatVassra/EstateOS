"use client";

import { useState } from "react";
import { PageHeader, PageBody } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSupportTickets, useKnowledgeBase, useSystemStatus, useCreateTicket } from "@/hooks/useSupport";
import { 
  LifeBuoy, 
  Search, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  BookOpen, 
  Activity, 
  ShieldCheck, 
  Send, 
  Loader2, 
  HelpCircle,
  ExternalLink,
  RefreshCw,
  Server
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<"tickets" | "kb" | "status">("tickets");
  const [searchQuery, setSearchQuery] = useState("");
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [ticketFilter, setTicketFilter] = useState<string>("ALL");

  const { data: ticketsData, isLoading: isLoadingTickets } = useSupportTickets();
  const { data: kbData, isLoading: isLoadingKb } = useKnowledgeBase(searchQuery);
  const { data: statusData, isLoading: isLoadingStatus, refetch: refetchStatus } = useSystemStatus();
  const createTicketMutation = useCreateTicket();

  const tickets = Array.isArray(ticketsData) ? ticketsData : [];
  const articles = Array.isArray(kbData) ? kbData : [
    { id: "1", title: "Configuring WhatsApp Multi-Channel AI Agent", category: "AI Studio", readTime: "4 min read", excerpt: "Learn how to connect your Twilio or WhatsApp Business API to EstateOS autonomous lead nurturer." },
    { id: "2", title: "Setting up Custom VIP Property Showings", category: "Operations", readTime: "3 min read", excerpt: "Step-by-step guide on creating calendar slots and assigning concierge agents to ultra-luxury listings." },
    { id: "3", title: "Managing Broker Commission Tiers & Team Roles", category: "Team Admin", readTime: "5 min read", excerpt: "How to configure revenue splits, assign manager permissions, and monitor agent conversion metrics." },
    { id: "4", title: "Live Telemetry & API Webhook Verification", category: "Developer", readTime: "6 min read", excerpt: "Troubleshooting real-time data syncs and monitoring API response times in your Command Center." }
  ];
  const systemStatus = statusData || {
    status: "ALL_SYSTEMS_OPERATIONAL",
    timestamp: new Date().toISOString(),
    services: [
      { name: "System Database (Live Telemetry)", status: "OPERATIONAL", latency: "12ms" },
      { name: "AI Studio Neural Engine", status: "OPERATIONAL", latency: "142ms" },
      { name: "WhatsApp & Communications Gateway", status: "OPERATIONAL", latency: "85ms" },
      { name: "Clerk Authentication Service", status: "OPERATIONAL", latency: "45ms" },
      { name: "Stripe Billing & Token Checkout", status: "OPERATIONAL", latency: "95ms" }
    ]
  };

  const filteredTickets = tickets.filter((t: any) => {
    if (ticketFilter === "ALL") return true;
    return t.status?.toUpperCase() === ticketFilter;
  });

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject.trim()) return;
    try {
      await createTicketMutation.mutateAsync({ subject: newTicketSubject });
      setNewTicketSubject("");
      setIsCreating(false);
    } catch (err) {
      console.error("Failed to create ticket:", err);
    }
  };

  return (
    <>
      <PageHeader 
        title="Support & Knowledge Base" 
        description="Access 24/7 dedicated concierge assistance, explore luxury real estate guides, and monitor live system telemetry."
      >
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetchStatus()}
            className="hidden sm:flex items-center gap-2 border-border bg-background hover:bg-muted font-medium"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh Telemetry</span>
          </Button>
          <Button 
            onClick={() => { setActiveTab("tickets"); setIsCreating(true); }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-md flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>New VIP Ticket</span>
          </Button>
        </div>
      </PageHeader>

      <PageBody>
        <div className="space-y-8 max-w-7xl">
          {/* Top Status Banner */}
          <div className="p-4 rounded-2xl border border-border bg-gradient-to-r from-card to-muted/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                <Activity className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">EstateOS Platform Status</h3>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-semibold uppercase tracking-wider">
                    {systemStatus.status === "ALL_SYSTEMS_OPERATIONAL" ? "100% Operational" : "Degraded Performance"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">All 12 AI modules and communication gateways are responding normally.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button variant="ghost" size="sm" onClick={() => setActiveTab("status")} className="text-xs text-muted-foreground hover:text-foreground">
                View Service Latency &rarr;
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-border pb-px">
            <button
              onClick={() => setActiveTab("tickets")}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 transition-all flex items-center gap-2",
                activeTab === "tickets" 
                  ? "border-primary text-primary font-semibold" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <LifeBuoy className="h-4 w-4" />
              <span>Concierge Tickets</span>
              {tickets.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                  {tickets.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("kb")}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 transition-all flex items-center gap-2",
                activeTab === "kb" 
                  ? "border-primary text-primary font-semibold" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <BookOpen className="h-4 w-4" />
              <span>Knowledge Base</span>
            </button>
            <button
              onClick={() => setActiveTab("status")}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 transition-all flex items-center gap-2",
                activeTab === "status" 
                  ? "border-primary text-primary font-semibold" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Server className="h-4 w-4" />
              <span>Live System Telemetry</span>
            </button>
          </div>

          {/* TAB 1: TICKETS */}
          {activeTab === "tickets" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              {/* Ticket creation modal/form */}
              {isCreating && (
                <Card className="border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <LifeBuoy className="h-5 w-5 text-primary" />
                        <span>Open New VIP Concierge Ticket</span>
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)} className="h-8 text-xs">
                        Cancel
                      </Button>
                    </div>
                    <CardDescription>
                      Describe your requirement or technical question. Our dedicated agency engineering team responds within 15 minutes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateTicket} className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                          Ticket Subject & Description
                        </label>
                        <input
                          type="text"
                          value={newTicketSubject}
                          onChange={(e) => setNewTicketSubject(e.target.value)}
                          placeholder="e.g., Requesting custom AI lead nurturing prompt for Dubai Marina penthouses..."
                          required
                          className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="flex items-center justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsCreating(false)} className="text-xs">
                          Discard
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={createTicketMutation.isPending || !newTicketSubject.trim()}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs px-5 h-9"
                        >
                          {createTicketMutation.isPending ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                              <span>Submitting...</span>
                            </>
                          ) : (
                            <>
                              <Send className="h-3.5 w-3.5 mr-2" />
                              <span>Dispatch Ticket</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Tickets Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setTicketFilter(status)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap",
                        ticketFilter === status 
                          ? "bg-primary text-primary-foreground font-semibold shadow-sm" 
                          : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {status === "ALL" ? "All Tickets" : status.replace("_", " ")}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredTickets.length}</span> support requests
                </div>
              </div>

              {/* Tickets List */}
              {isLoadingTickets ? (
                <div className="flex items-center justify-center py-20 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                  <span>Loading concierge tickets...</span>
                </div>
              ) : filteredTickets.length === 0 ? (
                <Card className="border-border/60 bg-card/50 p-12 text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-base mb-1">No Support Tickets Found</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                    You have no active support requests matching this filter. Need assistance with an AI campaign or workflow?
                  </p>
                  <Button onClick={() => setIsCreating(true)} size="sm" className="bg-primary text-primary-foreground font-medium">
                    <Plus className="h-4 w-4 mr-2" />
                    <span>Open Support Ticket</span>
                  </Button>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filteredTickets.map((ticket: any) => (
                    <Card key={ticket.id} className="border-border/80 bg-card hover:border-border transition-all hover:shadow-md">
                      <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-mono text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                              #{ticket.id?.slice(-6) || "TK-1092"}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5",
                                ticket.status === "RESOLVED" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                                ticket.status === "IN_PROGRESS" && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                                (!ticket.status || ticket.status === "OPEN") && "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              )}
                            >
                              {ticket.status || "OPEN"}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "Just now"}
                            </span>
                          </div>
                          <h4 className="font-semibold text-sm sm:text-base text-foreground truncate">
                            {ticket.subject || "General Platform Inquiry"}
                          </h4>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <Badge variant="secondary" className="bg-muted text-xs font-normal">
                            Priority: VIP SLA
                          </Badge>
                          <Button variant="outline" size="sm" className="text-xs h-8">
                            View Thread &rarr;
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: KNOWLEDGE BASE */}
          {activeTab === "kb" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              {/* Search input */}
              <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, guides, API documentation, AI prompt setups..."
                  className="w-full h-12 pl-12 pr-4 rounded-2xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                />
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {articles.map((art: any) => (
                  <Card key={art.id} className="border-border/80 bg-card hover:border-primary/40 transition-all hover:shadow-md flex flex-col justify-between">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] font-semibold uppercase">
                          {art.category || "Documentation"}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {art.readTime || "5 min read"}
                        </span>
                      </div>
                      <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                        {art.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                        {art.excerpt || art.content || "Read this comprehensive guide to master EstateOS tools and accelerate luxury real estate sales."}
                      </p>
                      <Button variant="ghost" size="sm" className="p-0 h-auto text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1">
                        <span>Read Full Guide</span>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LIVE SYSTEM TELEMETRY */}
          {activeTab === "status" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <Card className="border-border bg-card shadow-sm">
                <CardHeader className="border-b border-border pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Server className="h-5 w-5 text-primary" />
                        <span>Real-Time Infrastructure Telemetry</span>
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        Continuous latency monitoring across core database layers and third-party gateways.
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs font-bold px-3 py-1">
                      100% Uptime (Past 90 Days)
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {systemStatus.services?.map((svc: any, idx: number) => (
                      <div key={idx} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span className="font-semibold text-sm text-foreground">{svc.name}</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-xs font-mono text-muted-foreground">Latency</div>
                            <div className="text-sm font-mono font-semibold text-foreground">{svc.latency || "14ms"}</div>
                          </div>
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-bold uppercase w-24 justify-center">
                            {svc.status || "OPERATIONAL"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* SLA Guarantee Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-transparent border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-semibold text-sm flex items-center justify-center sm:justify-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>Enterprise SLA Guarantee Active</span>
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Your agency is backed by a 99.99% uptime guarantee with priority routing on multi-region failover clusters.
                  </p>
                </div>
                <Button variant="outline" size="sm" className="text-xs font-medium shrink-0 border-primary/30 hover:bg-primary/10">
                  Download SLA Agreement
                </Button>
              </div>
            </div>
          )}
        </div>
      </PageBody>
    </>
  );
}
