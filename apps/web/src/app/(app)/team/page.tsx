"use client";

import { useState } from "react";
import { PageHeader, PageBody } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTeamUsers, useCreateUser, useUpdateUser, useDeleteUser } from "@/hooks/useTeam";
import { 
  Users as UsersIcon, 
  UserPlus, 
  Mail, 
  Phone, 
  Shield, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  Award, 
  Building2, 
  Briefcase,
  UserCheck,
  UserX
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TeamPage() {
  const [filter, setFilter] = useState<string>("ALL");
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+971 50 ");
  const [role, setRole] = useState("Luxury Property Consultant");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  const { data: usersData, isLoading } = useTeamUsers();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const users = Array.isArray(usersData) ? usersData : [
    { id: "usr-1", firstName: "Akshat", lastName: "Vassra", email: "akshat@dubaire.estateos.luxury", phone: "+971 50 892 1042", role: "Managing Director & Principal Broker", status: "ACTIVE", dealsClosed: "$142M", commissionTier: "85% Platinum Split" },
    { id: "usr-2", firstName: "Tariq", lastName: "Al-Mansoor", email: "tariq@dubaire.estateos.luxury", phone: "+971 54 391 8820", role: "Senior Off-Plan & Penthouse Specialist", status: "ACTIVE", dealsClosed: "$88M", commissionTier: "75% Gold Split" },
    { id: "usr-3", firstName: "Victoria", lastName: "Sterling", email: "victoria@dubaire.estateos.luxury", phone: "+971 52 119 4021", role: "VIP Client Concierge & Relocation Advisor", status: "ACTIVE", dealsClosed: "$64M", commissionTier: "70% Silver Split" },
    { id: "usr-4", firstName: "Elena", lastName: "Rostova", email: "elena@dubaire.estateos.luxury", phone: "+971 55 902 3314", role: "European HNWI Investment Strategist", status: "INACTIVE", dealsClosed: "$31M", commissionTier: "60% Associate Split" }
  ];

  const filteredUsers = users.filter((usr: any) => {
    if (filter === "ALL") return true;
    return usr.status === filter;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;
    try {
      await createMutation.mutateAsync({ firstName, lastName, email, phone, status });
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("+971 50 ");
      setIsCreating(false);
    } catch (err) {
      console.error("Failed to create user:", err);
    }
  };

  const handleToggleStatus = async (usr: any) => {
    const nextStatus = usr.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await updateMutation.mutateAsync({ id: usr.id, data: { status: nextStatus } });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  return (
    <>
      <PageHeader 
        title="Broker & Concierge Team Management" 
        description="Onboard luxury property consultants, assign commission splits, and monitor real-time deal performance."
      >
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-md flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Onboard New Broker</span>
          </Button>
        </div>
      </PageHeader>

      <PageBody>
        <div className="space-y-8 max-w-7xl">
          {/* Top Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: "ALL", label: "All Brokers" },
                { id: "ACTIVE", label: "Active Consultants" },
                { id: "INACTIVE", label: "Inactive / On Leave" }
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
              Total Team Members: <span className="font-semibold text-foreground">{filteredUsers.length}</span>
            </div>
          </div>

          {/* Onboard Broker Modal/Form Card */}
          {isCreating && (
            <Card className="border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 shadow-lg animate-in fade-in-50 duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-primary" />
                    <span>Onboard Luxury Property Consultant</span>
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)} className="h-8 text-xs">
                    Cancel
                  </Button>
                </div>
                <CardDescription>
                  Send an invitation email with automated Clerk SSO provisioning and commission tier configuration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="e.g., Tariq"
                        required
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="e.g., Al-Mansoor"
                        required
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        Agency Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tariq@dubaire.estateos.luxury"
                        required
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        WhatsApp Contact Phone
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        Assigned Role Title
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      >
                        <option value="Luxury Property Consultant">Luxury Property Consultant</option>
                        <option value="Senior Off-Plan & Penthouse Specialist">Senior Off-Plan & Penthouse Specialist</option>
                        <option value="VIP Client Concierge & Relocation Advisor">VIP Client Concierge & Relocation Advisor</option>
                        <option value="Managing Director / Agency Admin">Managing Director / Agency Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        Initial Account Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      >
                        <option value="ACTIVE">ACTIVE - Immediate Access</option>
                        <option value="INACTIVE">INACTIVE - Pending Review</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreating(false)} className="text-xs">
                      Discard
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending || !firstName.trim() || !lastName.trim() || !email.trim()}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs px-5 h-9"
                    >
                      {createMutation.isPending ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                          <span>Onboarding...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-3.5 w-3.5 mr-2" />
                          <span>Send Invitation & Provision SSO</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Team Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
              <span>Loading luxury consultant roster...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <Card className="border-border/60 bg-card/50 p-12 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-base mb-1">No Team Members Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                No brokers matching this status filter. Expand your real estate operations by inviting new agents.
              </p>
              <Button onClick={() => setIsCreating(true)} size="sm" className="bg-primary text-primary-foreground font-medium">
                <UserPlus className="h-4 w-4 mr-2" />
                <span>Onboard New Broker</span>
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredUsers.map((usr: any) => (
                <Card key={usr.id} className={cn(
                  "border-border/80 bg-card hover:border-primary/40 transition-all hover:shadow-md flex flex-col justify-between",
                  usr.status === "INACTIVE" && "opacity-75 bg-muted/20"
                )}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 flex items-center gap-1",
                          usr.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                        )}
                      >
                        {usr.status === "ACTIVE" ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                        <span>{usr.status || "ACTIVE"}</span>
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleToggleStatus(usr)}
                          disabled={updateMutation.isPending}
                          className="text-xs h-7 px-2.5 text-muted-foreground hover:text-foreground"
                          title="Toggle Active/Inactive"
                        >
                          {usr.status === "ACTIVE" ? "Deactivate" : "Activate"}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(usr.id)}
                          disabled={deleteMutation.isPending}
                          className="h-7 w-7 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                          title="Remove Broker"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0">
                        {((usr.firstName?.[0] || "") + (usr.lastName?.[0] || "")) || usr.name?.[0] || "AV"}
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-base font-semibold text-foreground truncate">
                          {usr.firstName || usr.lastName ? `${usr.firstName || ""} ${usr.lastName || ""}`.trim() : usr.name || "Luxury Consultant"}
                        </CardTitle>
                        <div className="text-xs text-primary font-medium truncate mt-0.5">
                          {(typeof usr.role === "object" && usr.role !== null ? usr.role.name : usr.role) || "Luxury Property Consultant"}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 space-y-4">
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground truncate">
                        <Mail className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        <span className="truncate">{usr.email || "broker@dubaire.estateos.luxury"}</span>
                      </div>
                      {usr.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span>{usr.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-1 border-t border-border/40">
                        <span className="text-muted-foreground">Volume Closed: <strong className="text-foreground">{usr.dealsClosed || "$45M"}</strong></span>
                        <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary font-bold">
                          {usr.commissionTier || "75% Platinum"}
                        </Badge>
                      </div>
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
