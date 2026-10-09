"use client";

import { useState } from "react";
import { PageHeader, PageBody } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Megaphone, Target, BarChart, Zap, Plus, Sparkles, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCampaigns, useCreateCampaign, useGenerateMarketingCopy } from "@/hooks/useMarketing";

export default function MarketingPage() {
  const { data: marketingData, isLoading, isError } = useCampaigns();
  const createCampaignMutation = useCreateCampaign();
  const generateCopyMutation = useGenerateMarketingCopy();

  const [newCampaignName, setNewCampaignName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // AI Copy Generator State
  const [platform, setPlatform] = useState("Instagram");
  const [topic, setTopic] = useState("Palm Jumeirah Luxury Penthouse");
  const [tone, setTone] = useState("Luxury & Exclusive");
  const [copied, setCopied] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);

  const stats = marketingData?.stats || {
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalGeneratedPosts: 0
  };

  const campaigns = Array.isArray(marketingData?.campaigns) ? marketingData.campaigns : [];
  const generatedPosts = Array.isArray(marketingData?.generatedPosts) ? marketingData.generatedPosts : [];

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignName.trim()) return;
    await createCampaignMutation.mutateAsync({ name: newCampaignName });
    setNewCampaignName("");
    setIsCreating(false);
  };

  const handleGenerateCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    const res = await generateCopyMutation.mutateAsync({
      platform,
      topic,
      tone
    });
    setGeneratedResult(res);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <PageHeader 
        title="Marketing & Campaign Hub" 
        description="Manage live campaigns and generate high-converting luxury real estate copy with AI Studio." 
        actions={
          <Button variant="accent" onClick={() => setIsCreating(!isCreating)}>
            <Plus className="h-4 w-4 mr-2" />
            {isCreating ? "Cancel" : "New Campaign"}
          </Button>
        }
      />
      <PageBody>
        {isCreating && (
          <Card className="mb-8 border-accent/40 bg-accent/5">
            <CardContent className="pt-6">
              <form onSubmit={handleCreateCampaign} className="flex flex-col sm:flex-row gap-4 items-center">
                <Input
                  placeholder="e.g. Q3 Waterfront Residences Launch..."
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  className="flex-1 bg-background"
                  autoFocus
                />
                <Button type="submit" variant="accent" disabled={createCampaignMutation.isPending || !newCampaignName.trim()}>
                  {createCampaignMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Launch Campaign
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : stats.activeCampaigns}</div>
              <p className="text-xs text-muted-foreground mt-1">Active across channels</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">AI Generated Posts</CardTitle>
              <Sparkles className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : stats.totalGeneratedPosts}</div>
              <p className="text-xs text-muted-foreground mt-1">Saved copywriting assets</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Target Reach</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Multi-Channel</div>
              <p className="text-xs text-muted-foreground mt-1">Instagram, WhatsApp, Email</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">AI Optimization</CardTitle>
              <Zap className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">Active</div>
              <p className="text-xs text-muted-foreground mt-1">Token telemetry enabled</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Copywriting Suite & Live Campaigns */}
        <div className="grid lg:grid-cols-12 gap-8 max-w-7xl">
          {/* AI Copy Generator */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="border-accent/30 shadow-md">
              <CardHeader className="bg-muted/40 border-b border-border">
                <div className="flex items-center gap-2 text-accent font-semibold">
                  <Sparkles className="h-5 w-5" />
                  AI Studio Copywriting Suite
                </div>
                <CardDescription>
                  Generate high-converting ads, brochures, and WhatsApp blasts instantly.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <form onSubmit={handleGenerateCopy} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                      Target Platform
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {["Instagram", "WhatsApp", "LinkedIn", "Email"].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPlatform(p)}
                          className={`text-xs py-2 px-3 rounded-lg border font-medium transition-all ${
                            platform === p 
                              ? "bg-accent text-accent-foreground border-accent shadow-sm" 
                              : "bg-background border-border hover:bg-muted"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                      Tone of Voice
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Luxury & Exclusive", "Urgent & Investor", "Informative"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTone(t)}
                          className={`text-xs py-2 px-2 rounded-lg border font-medium transition-all ${
                            tone === t 
                              ? "bg-foreground text-background border-foreground shadow-sm" 
                              : "bg-background border-border hover:bg-muted"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                      Property / Community Topic
                    </label>
                    <Input
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. Emaar Beachfront 4-Bed Penthouse"
                    />
                  </div>

                  <Button type="submit" variant="accent" className="w-full" disabled={generateCopyMutation.isPending}>
                    {generateCopyMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating AI Luxury Copy...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Live Marketing Copy
                      </>
                    )}
                  </Button>
                </form>

                {generatedResult && (
                  <div className="mt-6 p-4 rounded-xl border border-accent/40 bg-accent/5 space-y-3 relative">
                    <div className="flex items-center justify-between border-b border-accent/20 pb-2">
                      <Badge variant="accent">{generatedResult.platform} • {generatedResult.tone}</Badge>
                      <button 
                        onClick={() => handleCopyText(generatedResult.content)}
                        className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground font-medium"
                      >
                        {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed font-sans text-foreground">
                      {generatedResult.content}
                    </div>
                    <div className="text-[10px] text-muted-foreground text-right pt-2 border-t border-accent/10">
                      Tokens consumed: {generatedResult.tokensUsed || 150} • Logged to Telemetry
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Active Campaigns & Generated History */}
          <div className="lg:col-span-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Campaigns</CardTitle>
                <CardDescription>Live marketing initiatives and multi-channel performance.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading && <p className="text-sm text-muted-foreground py-4">Loading campaigns...</p>}
                {!isLoading && campaigns.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                    <p className="text-sm text-muted-foreground">No campaigns launched yet.</p>
                    <p className="text-xs text-muted-foreground mt-1">Click &apos;New Campaign&apos; above to get started.</p>
                  </div>
                )}
                <div className="space-y-3">
                  {campaigns.map((c: any) => (
                    <div key={c.id} className="p-4 rounded-xl border border-border bg-background flex items-center justify-between shadow-sm">
                      <div>
                        <h4 className="font-semibold text-sm">{c.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Created {new Date(c.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="success">ACTIVE</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Copywriting Vault</CardTitle>
                <CardDescription>Recently generated posts saved to database.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading && <p className="text-sm text-muted-foreground py-4">Loading saved posts...</p>}
                {!isLoading && generatedPosts.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                    <p className="text-sm text-muted-foreground">No copywriting assets saved.</p>
                    <p className="text-xs text-muted-foreground mt-1">Use the AI Studio generator to create your first post.</p>
                  </div>
                )}
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {generatedPosts.map((post: any) => (
                    <div key={post.id} className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{post.channel || "AI Post"}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs line-clamp-3 text-muted-foreground whitespace-pre-line">
                        {post.content}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageBody>
    </>
  );
}
