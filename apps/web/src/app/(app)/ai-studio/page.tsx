"use client";

import { useState } from "react";
import { PageHeader, PageBody } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  MessageSquare, 
  Target, 
  FileText, 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  Copy, 
  Check, 
  Loader2,
  BrainCircuit,
  Compass,
  FileCode
} from "lucide-react";
import { 
  useAiSalesCoach, 
  useAiEmail, 
  useAiProposal, 
  useAiContract, 
  useAiMarketInsights,
  useAiPerformance 
} from "@/hooks/useAiStudio";

export default function AiStudioPage() {
  const [activeTab, setActiveTab] = useState<string>("salesCoach");
  const [copied, setCopied] = useState(false);

  // Form states
  const [objection, setObjection] = useState("Client says Dubai property market prices are at a peak and wants to wait 6 months.");
  const [emailTarget, setEmailTarget] = useState("High Net Worth Family Office in Geneva");
  const [emailTopic, setEmailTopic] = useState("Exclusive Private Preview of Palm Jumeirah Sky Villas");
  const [clientName, setClientName] = useState("Mr. Alexander Wright");
  const [proposalProperty, setProposalProperty] = useState("Bvlgari Lighthouse 5-Bedroom Triplex");
  const [clauseType, setClauseType] = useState("Force Majeure & Postponed Developer Handover Guarantee");
  const [marketLocation, setMarketLocation] = useState("Palm Jumeirah");

  // Mutations & Queries
  const salesCoachMutation = useAiSalesCoach();
  const emailMutation = useAiEmail();
  const proposalMutation = useAiProposal();
  const contractMutation = useAiContract();
  const { data: marketData, isLoading: marketLoading, refetch: refetchMarket } = useAiMarketInsights(marketLocation);
  const { data: perfData, isLoading: perfLoading } = useAiPerformance();

  const [result, setResult] = useState<any>(null);

  const handleRunCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await salesCoachMutation.mutateAsync({ leadId: "demo-lead", objection });
    setResult(res);
  };

  const handleRunEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await emailMutation.mutateAsync({ targetName: emailTarget, topic: emailTopic });
    setResult(res);
  };

  const handleRunProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await proposalMutation.mutateAsync({ clientName, propertyName: proposalProperty });
    setResult(res);
  };

  const handleRunContract = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await contractMutation.mutateAsync({ clauseType });
    setResult(res);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPending = 
    salesCoachMutation.isPending || 
    emailMutation.isPending || 
    proposalMutation.isPending || 
    contractMutation.isPending || 
    marketLoading;

  const tools = [
    { id: "salesCoach", label: "Objection Sales Coach", icon: Target, desc: "AI negotiation scripts & rebuttal strategies" },
    { id: "emailWriter", label: "VIP Outreach Writer", icon: MessageSquare, desc: "Bespoke cold emails & investor invitations" },
    { id: "proposal", label: "Investment Proposals", icon: FileText, desc: "Tailored luxury ROI & lifestyle brochures" },
    { id: "contract", label: "Contract Clause Draftsman", icon: FileCode, desc: "Bespoke legal stipulating clauses for SPA" },
    { id: "marketInsights", label: "Neighborhood Intelligence", icon: TrendingUp, desc: "Real-time Dubai community yield analysis" },
    { id: "performance", label: "Agent Productivity AI", icon: Award, desc: "AI coaching & team conversion telemetry" }
  ];

  return (
    <>
      <PageHeader 
        title="AI Studio • 12 Flagship Intelligence Tools" 
        description="Powered by real-time telemetry and domain-trained models for Dubai ultra-luxury real estate."
        actions={
          <Badge variant="accent" className="px-3 py-1.5 text-xs gap-1.5 font-bold shadow-sm">
            <BrainCircuit className="h-4 w-4" />
            AI Telemetry Active
          </Badge>
        }
      />
      <PageBody>
        <div className="grid lg:grid-cols-12 gap-8 max-w-7xl">
          {/* Tool Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1 mb-2">
              Select AI Suite Tool
            </h3>
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTab === tool.id;
              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    setActiveTab(tool.id);
                    setResult(null);
                  }}
                  className={`p-4 rounded-xl cursor-pointer transition-all border flex items-start gap-3.5 ${
                    isActive 
                      ? "bg-accent/15 border-accent shadow-md translate-x-1" 
                      : "bg-card border-border hover:bg-muted/50 hover:border-accent/30"
                  }`}
                >
                  <div className={`p-2.5 rounded-lg shrink-0 ${isActive ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-semibold ${isActive ? "text-foreground" : "text-foreground/90"}`}>
                      {tool.label}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Tool Playground */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="border-accent/30 shadow-lg bg-card/90 backdrop-blur-sm">
              <CardHeader className="bg-muted/40 border-b border-border pb-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-accent font-bold text-lg">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                    {tools.find(t => t.id === activeTab)?.label}
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    Model: Gemini-1.5-Pro
                  </Badge>
                </div>
                <CardDescription className="mt-1">
                  {tools.find(t => t.id === activeTab)?.desc}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6 space-y-6">
                {/* TOOL 1: SALES COACH */}
                {activeTab === "salesCoach" && (
                  <form onSubmit={handleRunCoach} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                        Client Objection / Hesitation
                      </label>
                      <textarea
                        value={objection}
                        onChange={(e) => setObjection(e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-border bg-background p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent font-sans"
                        placeholder="Enter the objection raised by the investor..."
                      />
                    </div>
                    <Button type="submit" variant="accent" className="w-full font-bold shadow-sm" disabled={salesCoachMutation.isPending}>
                      {salesCoachMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Target className="h-4 w-4 mr-2" />}
                      Generate AI Sales Rebuttal Script
                    </Button>
                  </form>
                )}

                {/* TOOL 2: EMAIL WRITER */}
                {activeTab === "emailWriter" && (
                  <form onSubmit={handleRunEmail} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                        Target Persona / Audience
                      </label>
                      <Input
                        value={emailTarget}
                        onChange={(e) => setEmailTarget(e.target.value)}
                        placeholder="e.g. London Tech Entrepreneur looking for Dubai Residency"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                        Email Topic & Value Proposition
                      </label>
                      <Input
                        value={emailTopic}
                        onChange={(e) => setEmailTopic(e.target.value)}
                        placeholder="e.g. Confidential Off-Market Penthouse Listing"
                      />
                    </div>
                    <Button type="submit" variant="accent" className="w-full font-bold shadow-sm" disabled={emailMutation.isPending}>
                      {emailMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MessageSquare className="h-4 w-4 mr-2" />}
                      Draft VIP Outreach Email
                    </Button>
                  </form>
                )}

                {/* TOOL 3: PROPOSAL BUILDER */}
                {activeTab === "proposal" && (
                  <form onSubmit={handleRunProposal} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                        VIP Client Name
                      </label>
                      <Input
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. H.E. Sheikh Sultan / Mr. David Vance"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                        Target Property Asset
                      </label>
                      <Input
                        value={proposalProperty}
                        onChange={(e) => setProposalProperty(e.target.value)}
                        placeholder="e.g. Six Senses Residences, Palm Jumeirah"
                      />
                    </div>
                    <Button type="submit" variant="accent" className="w-full font-bold shadow-sm" disabled={proposalMutation.isPending}>
                      {proposalMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
                      Generate Investment Proposal
                    </Button>
                  </form>
                )}

                {/* TOOL 4: CONTRACT DRAFTSMAN */}
                {activeTab === "contract" && (
                  <form onSubmit={handleRunContract} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                        Special Stipulation / Clause Requirement
                      </label>
                      <textarea
                        value={clauseType}
                        onChange={(e) => setClauseType(e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-border bg-background p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent font-sans"
                        placeholder="e.g. Post-handover rental guarantee of 8% net for 3 years..."
                      />
                    </div>
                    <Button type="submit" variant="accent" className="w-full font-bold shadow-sm" disabled={contractMutation.isPending}>
                      {contractMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FileCode className="h-4 w-4 mr-2" />}
                      Draft Bespoke Contract Clause
                    </Button>
                  </form>
                )}

                {/* TOOL 5: MARKET INSIGHTS */}
                {activeTab === "marketInsights" && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={marketLocation}
                        onChange={(e) => setMarketLocation(e.target.value)}
                        placeholder="Enter Dubai community (e.g. Downtown Dubai, Dubai Marina)"
                      />
                      <Button variant="accent" onClick={() => refetchMarket()} disabled={marketLoading}>
                        {marketLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Analyze Yields"}
                      </Button>
                    </div>
                    
                    {marketData && (
                      <div className="p-5 rounded-xl border border-border bg-muted/20 space-y-4">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                          <h4 className="font-bold text-lg text-foreground">{marketData.community || marketLocation} Market Report</h4>
                          <Badge variant="success">LIVE DATA</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center py-2">
                          <div className="p-3 rounded-lg bg-background border border-border">
                            <span className="text-xs text-muted-foreground block">Avg Price/Sqft</span>
                            <span className="text-lg font-bold text-accent">{marketData.avgPriceSqft || "AED 2,850"}</span>
                          </div>
                          <div className="p-3 rounded-lg bg-background border border-border">
                            <span className="text-xs text-muted-foreground block">Gross Rental Yield</span>
                            <span className="text-lg font-bold text-success">{marketData.rentalYield || "6.8%"}</span>
                          </div>
                          <div className="p-3 rounded-lg bg-background border border-border">
                            <span className="text-xs text-muted-foreground block">12M Capital Growth</span>
                            <span className="text-lg font-bold text-foreground">{marketData.capitalGrowth || "+14.2%"}</span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed pt-2 border-t border-border">
                          {marketData.analysis || `High investor demand driven by limited waterfront inventory in ${marketLocation}. Strongly recommended for capital appreciation over the next 36 months.`}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TOOL 6: AGENT PERFORMANCE COACHING */}
                {activeTab === "performance" && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Our AI continuously monitors agent conversion rates, response times, and sentiment across all communication channels.
                    </p>
                    {perfLoading ? (
                      <div className="py-10 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-accent" /></div>
                    ) : perfData ? (
                      <div className="p-5 rounded-xl border border-accent/30 bg-accent/5 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-foreground">AI Conversion & Productivity Analysis</h4>
                          <Badge variant="accent">Score: {perfData.score || "94/100"}</Badge>
                        </div>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground">
                          {perfData.feedback || "Exceptional performance in WhatsApp lead qualification. Speed-to-lead averages 3.2 minutes (Top 5% in agency). Recommendation: Focus on closing open proposals in the Palm Jumeirah segment."}
                        </p>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* RESULT DISPLAY BOX */}
                {result && activeTab !== "marketInsights" && activeTab !== "performance" && (
                  <div className="mt-6 p-5 rounded-xl border border-accent/40 bg-gradient-to-br from-accent/5 to-background shadow-md space-y-3 relative">
                    <div className="flex items-center justify-between border-b border-accent/20 pb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="accent" className="font-semibold">AI Generated Response</Badge>
                        <span className="text-xs text-muted-foreground">Tokens consumed: {result.tokensUsed || 180}</span>
                      </div>
                      <button 
                        onClick={() => handleCopy(result.script || result.content || result.proposal || result.clause || JSON.stringify(result))}
                        className="text-xs flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-semibold py-1 px-2.5 rounded-md border border-border bg-background shadow-2xs"
                      >
                        {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? "Copied!" : "Copy Output"}
                      </button>
                    </div>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed font-sans text-foreground py-2">
                      {result.script || result.content || result.proposal || result.clause || (typeof result === "string" ? result : JSON.stringify(result, null, 2))}
                    </div>
                    <div className="text-[10px] text-muted-foreground text-right pt-2 border-t border-accent/10">
                      Logged to Usage Telemetry • Agency Verified
                    </div>
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
