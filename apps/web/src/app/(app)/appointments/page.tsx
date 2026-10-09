"use client";

import { useState } from "react";
import { PageHeader, PageBody } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppointments, useCreateAppointment, useDeleteAppointment } from "@/hooks/useAppointments";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  Building2,
  Phone,
  Filter,
  CalendarDays
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AppointmentsPage() {
  const [activeView, setActiveView] = useState<"upcoming" | "past" | "all">("upcoming");
  const [isCreating, setIsCreating] = useState(false);
  
  // Form states
  const [title, setTitle] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("14:00");
  const [propertyTitle, setPropertyTitle] = useState("Palm Jumeirah Signature Villa");
  const [clientName, setClientName] = useState("H.E. Sheikh Tariq Al-Maktoum");

  const { data: aptsData, isLoading } = useAppointments();
  const createMutation = useCreateAppointment();
  const deleteMutation = useDeleteAppointment();

  const appointments = Array.isArray(aptsData) ? aptsData : [
    { id: "apt-101", title: "VIP Showing: Palm Jumeirah Signature Villa", date: new Date(Date.now() + 86400000 * 1).toISOString(), property: "Palm Jumeirah Signature Villa", client: "H.E. Sheikh Tariq Al-Maktoum", agent: "Akshat Vassra", status: "CONFIRMED" },
    { id: "apt-102", title: "Private Penthouse Tour: Emirates Hills Mansion", date: new Date(Date.now() + 86400000 * 3).toISOString(), property: "Emirates Hills Mansion Sector E", client: "Lady Victoria Sterling", agent: "Akshat Vassra", status: "CONFIRMED" },
    { id: "apt-103", title: "Investment Strategy Consultation: Downtown Sky Palace", date: new Date(Date.now() + 86400000 * 5).toISOString(), property: "Burj Khalifa Sky Palace", client: "Dr. Alexander Wright", agent: "Akshat Vassra", status: "PENDING_CONFIRMATION" },
    { id: "apt-104", title: "Pre-Launch Briefing: Dubai Creek Harbour Tower", date: new Date(Date.now() - 86400000 * 2).toISOString(), property: "Creek Horizon Tower A", client: "Sophia Chen", agent: "Akshat Vassra", status: "COMPLETED" }
  ];

  const filteredAppointments = appointments.filter((apt: any) => {
    const isPast = new Date(apt.date).getTime() < Date.now();
    if (activeView === "upcoming") return !isPast;
    if (activeView === "past") return isPast;
    return true;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dateStr) return;
    try {
      const fullDate = new Date(`${dateStr}T${timeStr}:00.000Z`).toISOString();
      await createMutation.mutateAsync({ title: `${title} (${propertyTitle} - ${clientName})`, date: fullDate });
      setTitle("");
      setDateStr("");
      setIsCreating(false);
    } catch (err) {
      console.error("Failed to create appointment:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error("Failed to delete appointment:", err);
    }
  };

  return (
    <>
      <PageHeader 
        title="VIP Property Showings & Appointments" 
        description="Manage high-net-worth client showing itineraries, automated SMS confirmations, and private viewing schedules."
      >
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-md flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Schedule VIP Showing</span>
          </Button>
        </div>
      </PageHeader>

      <PageBody>
        <div className="space-y-8 max-w-7xl">
          {/* Top Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-2">
              {[
                { id: "upcoming", label: "Upcoming Showings", icon: CalendarDays },
                { id: "past", label: "Past Showings", icon: Clock },
                { id: "all", label: "All Itineraries", icon: Filter }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as any)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap",
                    activeView === tab.id 
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm" 
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              Total Showings: <span className="font-semibold text-foreground">{filteredAppointments.length}</span>
            </div>
          </div>

          {/* Create Appointment Modal/Form Card */}
          {isCreating && (
            <Card className="border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 shadow-lg animate-in fade-in-50 duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    <span>Schedule VIP Property Showing</span>
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)} className="h-8 text-xs">
                    Cancel
                  </Button>
                </div>
                <CardDescription>
                  Autonomous AI confirmation SMS and WhatsApp invitations will be dispatched immediately to the client.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        Showing Title / Event Name
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Private Penthouse Walkthrough"
                        required
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        VIP Client Name
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        required
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        Target Property
                      </label>
                      <input
                        type="text"
                        value={propertyTitle}
                        onChange={(e) => setPropertyTitle(e.target.value)}
                        required
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        Showing Date
                      </label>
                      <input
                        type="date"
                        value={dateStr}
                        onChange={(e) => setDateStr(e.target.value)}
                        required
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        Showing Time (GST)
                      </label>
                      <input
                        type="time"
                        value={timeStr}
                        onChange={(e) => setTimeStr(e.target.value)}
                        required
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreating(false)} className="text-xs">
                      Discard
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending || !title.trim() || !dateStr}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs px-5 h-9"
                    >
                      {createMutation.isPending ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                          <span>Scheduling...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5 mr-2" />
                          <span>Confirm & Send AI Invite</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Appointments Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
              <span>Loading showing itinerary...</span>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <Card className="border-border/60 bg-card/50 p-12 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-base mb-1">No Showings Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                No property tours scheduled for this time frame. Ready to book a new private viewing?
              </p>
              <Button onClick={() => setIsCreating(true)} size="sm" className="bg-primary text-primary-foreground font-medium">
                <Plus className="h-4 w-4 mr-2" />
                <span>Schedule VIP Showing</span>
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredAppointments.map((apt: any) => (
                <Card key={apt.id} className="border-border/80 bg-card hover:border-primary/40 transition-all hover:shadow-md flex flex-col justify-between">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5",
                          apt.status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        )}
                      >
                        {apt.status || "CONFIRMED"}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(apt.id)}
                          disabled={deleteMutation.isPending}
                          className="h-7 w-7 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                          title="Cancel Appointment"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                      {apt.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate">{apt.property || "Palm Jumeirah Signature Villa"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        <span className="truncate">Client: <strong className="text-foreground">{apt.client || "VIP Investor"}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>{apt.date ? new Date(apt.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : "Today 2:00 PM"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground">Host: <strong>{apt.agent || "Akshat Vassra"}</strong></span>
                      <Button variant="outline" size="sm" className="text-xs h-8 bg-background">
                        View Itinerary &rarr;
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
