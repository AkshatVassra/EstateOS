"use client";

import { useState } from "react";
import { PageHeader, PageBody } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  useNotifications, 
  useDispatchNotification, 
  useMarkNotificationRead, 
  useMarkAllNotificationsRead, 
  useDeleteNotification 
} from "@/hooks/useNotifications";
import { 
  Bell, 
  Send, 
  CheckCircle2, 
  Trash2, 
  AlertTriangle, 
  Clock, 
  Smartphone, 
  Mail, 
  Radio, 
  Loader2, 
  CheckCheck, 
  ShieldAlert,
  Sparkles,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<string>("ALL");
  const [isDispatching, setIsDispatching] = useState(false);

  // Form states
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState<"IN_APP" | "EMAIL" | "WHATSAPP" | "ALL">("ALL");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("HIGH");

  const { data: notifsData, isLoading } = useNotifications();
  const dispatchMutation = useDispatchNotification();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const deleteMutation = useDeleteNotification();

  const notifications = Array.isArray(notifsData) ? notifsData : [
    { id: "ntf-1", message: "🔥 URGENT: New VIP Lead Inquiry ($15M budget) for Palm Jumeirah Signature Villa assigned to your queue.", channel: "WHATSAPP", priority: "URGENT", read: false, createdAt: new Date(Date.now() - 60000 * 12).toISOString() },
    { id: "ntf-2", message: "📄 SPA Contract #SPA-8821 for Burj Khalifa penthouse approved by Emirates NBD escrow team.", channel: "EMAIL", priority: "HIGH", read: false, createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
    { id: "ntf-3", message: "🤖 AI Studio generated 24 tailored property brochures for Dubai Marina Q3 investment presentation.", channel: "IN_APP", priority: "MEDIUM", read: true, createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: "ntf-4", message: "⚠️ System Telemetry Notice: Twilio WhatsApp Gateway re-authenticated successfully with zero packet loss.", channel: "ALL", priority: "LOW", read: true, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() }
  ];

  const filteredNotifications = notifications.filter((ntf: any) => {
    if (filter === "UNREAD") return !ntf.read;
    if (filter === "READ") return ntf.read;
    return true;
  });

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await dispatchMutation.mutateAsync({ message, channel, priority });
      setMessage("");
      setIsDispatching(false);
    } catch (err) {
      console.error("Failed to dispatch notification:", err);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markReadMutation.mutateAsync(id);
    } catch (err) {
      console.error("Failed to mark read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllReadMutation.mutateAsync();
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <>
      <PageHeader 
        title="Live Telemetry Alerts & Broadcast Center" 
        description="Monitor real-time system alerts, automated AI nurturing triggers, and broadcast announcements across channels."
      >
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleMarkAllRead}
              disabled={markAllReadMutation.isPending}
              className="border-border bg-background hover:bg-muted font-medium flex items-center gap-2"
            >
              <CheckCheck className="h-4 w-4 text-emerald-500" />
              <span>Mark All {unreadCount} Read</span>
            </Button>
          )}
          <Button 
            onClick={() => setIsDispatching(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-md flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            <span>Dispatch Broadcast Alert</span>
          </Button>
        </div>
      </PageHeader>

      <PageBody>
        <div className="space-y-8 max-w-7xl">
          {/* Top Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: "ALL", label: "All Alerts" },
                { id: "UNREAD", label: `Unread (${unreadCount})` },
                { id: "READ", label: "Archived / Read" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap",
                    filter === tab.id 
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm" 
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredNotifications.length}</span> live alerts
            </div>
          </div>

          {/* Dispatch Alert Modal/Form */}
          {isDispatching && (
            <Card className="border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 shadow-lg animate-in fade-in-50 duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Radio className="h-5 w-5 text-primary animate-pulse" />
                    <span>Dispatch Real-Time Broadcast Alert</span>
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setIsDispatching(false)} className="h-8 text-xs">
                    Cancel
                  </Button>
                </div>
                <CardDescription>
                  Send high-priority notifications to brokers via In-App Dashboard, Email, or WhatsApp Business API.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDispatch} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                      Alert Message Body
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g., Q3 Luxury Incentive Commission Bonus pool is now active for all properties above $10M..."
                      rows={3}
                      required
                      className="w-full p-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        Target Communication Channel
                      </label>
                      <select
                        value={channel}
                        onChange={(e) => setChannel(e.target.value as any)}
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      >
                        <option value="ALL">ALL CHANNELS (In-App + WhatsApp + Email)</option>
                        <option value="IN_APP">In-App Command Center Dashboard Only</option>
                        <option value="WHATSAPP">WhatsApp Business API Direct SMS</option>
                        <option value="EMAIL">Email Notification Gateway</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        Alert Priority Level
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as any)}
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      >
                        <option value="URGENT">🚨 URGENT (Immediate Sound & Push)</option>
                        <option value="HIGH">🔥 HIGH (Top of Alert Queue)</option>
                        <option value="MEDIUM">⚡ MEDIUM (Standard Alert)</option>
                        <option value="LOW">ℹ️ LOW (Informational Notice)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => setIsDispatching(false)} className="text-xs">
                      Discard
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={dispatchMutation.isPending || !message.trim()}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs px-5 h-9"
                    >
                      {dispatchMutation.isPending ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                          <span>Dispatching...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5 mr-2" />
                          <span>Broadcast Alert Now</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Notifications List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
              <span>Loading telemetry alerts...</span>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <Card className="border-border/60 bg-card/50 p-12 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-base mb-1">No Alerts Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                Your notification queue is clean. You're up to date with all AI lead activities and telemetry events.
              </p>
              <Button onClick={() => setIsDispatching(true)} size="sm" className="bg-primary text-primary-foreground font-medium">
                <Send className="h-4 w-4 mr-2" />
                <span>Dispatch Broadcast Alert</span>
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((ntf: any) => (
                <Card key={ntf.id} className={cn(
                  "border-border/80 bg-card hover:border-primary/40 transition-all hover:shadow-md",
                  !ntf.read && "border-l-4 border-l-primary bg-primary/5"
                )}>
                  <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                        ntf.priority === "URGENT" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                        ntf.priority === "HIGH" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                        "bg-primary/10 text-primary border border-primary/20"
                      )}>
                        {ntf.channel === "WHATSAPP" ? <Smartphone className="h-5 w-5" /> :
                         ntf.channel === "EMAIL" ? <Mail className="h-5 w-5" /> :
                         <Bell className="h-5 w-5" />}
                      </div>
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5",
                              ntf.priority === "URGENT" && "bg-red-500/10 text-red-500 border-red-500/20",
                              ntf.priority === "HIGH" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                              (!ntf.priority || ntf.priority === "MEDIUM" || ntf.priority === "LOW") && "bg-primary/10 text-primary border-primary/20"
                            )}
                          >
                            {ntf.priority || "MEDIUM"}
                          </Badge>
                          <Badge variant="secondary" className="bg-muted text-[10px] uppercase font-mono">
                            Channel: {ntf.channel || "IN_APP"}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {ntf.createdAt ? new Date(ntf.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "10m ago"}
                          </span>
                          {!ntf.read && (
                            <span className="px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold uppercase">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-foreground leading-snug">
                          {ntf.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {!ntf.read && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleMarkRead(ntf.id)}
                          disabled={markReadMutation.isPending}
                          className="text-xs font-medium h-8 bg-background hover:bg-muted flex items-center gap-1.5 text-primary"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Mark Read</span>
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(ntf.id)}
                        disabled={deleteMutation.isPending}
                        className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                        title="Delete Alert"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </PageBody>
    </>
  );
}
