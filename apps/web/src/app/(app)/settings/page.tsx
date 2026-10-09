"use client";

import { useState } from "react";
import { PageHeader, PageBody } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAgencies, useUpdateAgencySettings } from "@/hooks/useSettings";
import { 
  Settings as SettingsIcon, 
  Building2, 
  Sparkles, 
  Key, 
  Globe, 
  Shield, 
  Save, 
  Loader2, 
  CheckCircle2, 
  Copy, 
  RefreshCw,
  Bell,
  Smartphone,
  Lock,
  Palette,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"agency" | "ai" | "integrations" | "security">("agency");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [agencyName, setAgencyName] = useState("Dubai Luxury Real Estate Agency");
  const [agencyDomain, setAgencyDomain] = useState("dubaire.estateos.luxury");
  const [currency, setCurrency] = useState("USD ($)");
  const [aiTone, setAiTone] = useState("Ultra-Luxury Authoritative & Consultative");
  const [aiModel, setAiModel] = useState("gemini-1.5-pro");
  const [autoRespond, setAutoRespond] = useState(true);
  const [apiKey, setApiKey] = useState("eos_live_9f82a7c4e1b3d609281734a65b129c8e");

  const { data: agenciesData, isLoading } = useAgencies();
  const updateSettingsMutation = useUpdateAgencySettings();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      // simulate network or execute save
      await new Promise(r => setTimeout(r, 800));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <PageHeader 
        title="Agency & Platform Settings" 
        description="Configure your white-label branding, AI studio neural parameters, communication gateways, and API keys."
      >
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5 py-1.5 px-3">
              <CheckCircle2 className="h-4 w-4" />
              <span>Settings Saved</span>
            </Badge>
          )}
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-md flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save All Configurations</span>
              </>
            )}
          </Button>
        </div>
      </PageHeader>

      <PageBody>
        <div className="space-y-8 max-w-7xl">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-border pb-px overflow-x-auto">
            <button
              onClick={() => setActiveTab("agency")}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === "agency" 
                  ? "border-primary text-primary font-semibold" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Building2 className="h-4 w-4" />
              <span>Agency Profile & White-label</span>
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === "ai" 
                  ? "border-primary text-primary font-semibold" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Sparkles className="h-4 w-4" />
              <span>AI Studio & Neural Models</span>
            </button>
            <button
              onClick={() => setActiveTab("integrations")}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === "integrations" 
                  ? "border-primary text-primary font-semibold" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Key className="h-4 w-4" />
              <span>API Keys & Webhooks</span>
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === "security" 
                  ? "border-primary text-primary font-semibold" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Shield className="h-4 w-4" />
              <span>Security & Access Control</span>
            </button>
          </div>

          {/* TAB 1: AGENCY PROFILE */}
          {activeTab === "agency" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in-50 duration-200">
              <div className="md:col-span-2 space-y-6">
                <Card className="border-border bg-card shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">General Agency Branding</CardTitle>
                    <CardDescription className="text-xs">
                      Customize how your brand appears across client proposals, PDF brochures, and AI communications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        Agency Legal Name
                      </label>
                      <input
                        type="text"
                        value={agencyName}
                        onChange={(e) => setAgencyName(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                          White-Label Subdomain
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={agencyDomain}
                            onChange={(e) => setAgencyDomain(e.target.value)}
                            className="w-full h-11 pl-4 pr-10 rounded-xl border border-border bg-background font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          />
                          <Globe className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                          Primary Operating Currency
                        </label>
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        >
                          <option value="USD ($)">USD ($) - United States Dollar</option>
                          <option value="AED (د.إ)">AED (د.إ) - UAE Dirham</option>
                          <option value="EUR (€)">EUR (€) - Euro</option>
                          <option value="GBP (£)">GBP (£) - British Pound</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        Agency Headquarters Address
                      </label>
                      <input
                        type="text"
                        defaultValue="Level 42, Boulevard Plaza Tower 1, Downtown Dubai, UAE"
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* White-Label Preview Card */}
              <div className="space-y-6">
                <Card className="border-primary/30 bg-gradient-to-br from-card to-primary/5 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Palette className="h-4 w-4 text-primary" />
                      <span>Live Theme Preview</span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Active visual theme applied to client portals.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl mx-auto shadow-md">
                      {agencyName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{agencyName}</h4>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">{agencyDomain}</p>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold uppercase w-full justify-center py-1">
                      White-Label License Active
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 2: AI STUDIO PARAMS */}
          {activeTab === "ai" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <Card className="border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>Autonomous AI Nurturing Preferences</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Fine-tune the neural models processing inbound lead inquiries and automated SMS/WhatsApp replies.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        Default LLM Inference Engine
                      </label>
                      <select
                        value={aiModel}
                        onChange={(e) => setAiModel(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      >
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro (Max Reasoning & Multi-Modal)</option>
                        <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra-Low Latency SMS/Chat)</option>
                        <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-Gen Real-Time Inference)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        AI Conversational Tone
                      </label>
                      <select
                        value={aiTone}
                        onChange={(e) => setAiTone(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      >
                        <option value="Ultra-Luxury Authoritative & Consultative">Ultra-Luxury Authoritative & Consultative</option>
                        <option value="Warm, Empathetic & Relational">Warm, Empathetic & Relational</option>
                        <option value="Direct, Concise & Data-Driven">Direct, Concise & Data-Driven</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">Autonomous WhatsApp Nurturing</h4>
                      <p className="text-xs text-muted-foreground">Allow AI to reply instantly to new portal leads without human intervention.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoRespond(!autoRespond)}
                      className={cn(
                        "w-12 h-6 rounded-full transition-colors relative focus:outline-none",
                        autoRespond ? "bg-primary" : "bg-muted"
                      )}
                    >
                      <span className={cn(
                        "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform",
                        autoRespond ? "translate-x-6" : "translate-x-0"
                      )} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 3: INTEGRATIONS & API KEYS */}
          {activeTab === "integrations" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <Card className="border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" />
                    <span>EstateOS Live API Keys</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Use this production API key to authenticate requests from custom web forms, mobile apps, or Zapier integrations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                      Production Secret API Key
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={apiKey}
                        className="w-full h-11 px-4 rounded-xl border border-border bg-muted/40 font-mono text-xs text-foreground focus:outline-none"
                      />
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(apiKey)} className="h-11 px-4 shrink-0 flex items-center gap-1.5 font-medium">
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Key</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setApiKey(`eos_live_${Math.random().toString(36).substring(2, 15)}`)} className="h-11 w-11 shrink-0" title="Regenerate Key">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dedicated WhatsApp Business Gateway Config */}
              <Card className="border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-emerald-500" />
                    <span>Dedicated Agency WhatsApp Business Gateway</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Configure your official company WhatsApp number for 24/7 autonomous Gemini AI lead capture & auto-replies.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                    <span>Status: <strong>Autonomous Gemini AI 24/7 Lead Capture Active</strong></span>
                    <Badge variant="outline" className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30 text-[10px] font-bold">CONNECTED</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        Official Agency WhatsApp Number
                      </label>
                      <input
                        type="text"
                        defaultValue="+971 4 800 9000"
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        Webhook Security Verification Token
                      </label>
                      <input
                        type="text"
                        readOnly
                        value="estateos_live_whatsapp_webhook_2026"
                        className="w-full h-11 px-4 rounded-xl border border-border bg-muted/40 font-mono text-xs text-foreground focus:outline-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Webhooks Config */}
              <Card className="border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Active Webhook Endpoints</CardTitle>
                  <CardDescription className="text-xs">Configure where EstateOS dispatches real-time event payloads.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border flex items-center justify-between">
                    <div>
                      <div className="font-mono text-xs font-semibold text-foreground">https://api.clerk.com/v1/webhooks</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">Events: user.created, user.updated, user.deleted</div>
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-bold">ACTIVE</Badge>
                  </div>
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border flex items-center justify-between">
                    <div>
                      <div className="font-mono text-xs font-semibold text-foreground">https://api.stripe.com/v1/webhooks</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">Events: invoice.paid, customer.subscription.updated</div>
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-bold">ACTIVE</Badge>
                  </div>
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border flex items-center justify-between">
                    <div>
                      <div className="font-mono text-xs font-semibold text-foreground">https://sweet-rings-dance.loca.lt/api/webhooks/whatsapp</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">Events: whatsapp.message.received, whatsapp.status.updated</div>
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-bold">ACTIVE</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 4: SECURITY */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <Card className="border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>Platform Access Control & Security</span>
                  </CardTitle>
                  <CardDescription className="text-xs">Manage enterprise authentication policies and session persistence.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm font-semibold">Enforce 2-Factor Authentication (2FA)</div>
                        <div className="text-xs text-muted-foreground">Require all brokers and agents to authenticate via SMS or authenticator app.</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold px-3 py-1">Enforced by Clerk</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </PageBody>
    </>
  );
}
