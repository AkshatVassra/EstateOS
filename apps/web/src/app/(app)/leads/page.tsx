"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader, PageBody } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLeads, useCreateLead } from "@/hooks/useLeads";
import { Plus, UserPlus, Phone, Mail, DollarSign, Loader2 } from "lucide-react";

export default function LeadsPage() {
  const { data: leads, isLoading, isError } = useLeads();
  const createLeadMutation = useCreateLead();

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    budget: "",
    source: "WEBSITE",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone) return;
    try {
      await createLeadMutation.mutateAsync({
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
      });
      setFormData({ firstName: "", lastName: "", phone: "", email: "", budget: "", source: "WEBSITE" });
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <PageHeader 
        title="Leads Pipeline" 
        description="Manage your incoming leads and AI qualifications."
        actions={
          <Button onClick={() => setIsOpen(true)} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm">
            <Plus className="w-4 h-4" /> Add Lead
          </Button>
        }
      />
      <PageBody>
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground p-4">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading leads...
          </div>
        )}
        
        {isError && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
            Failed to load leads. Make sure the API server is running.
          </div>
        )}

        {!isLoading && !isError && leads?.length === 0 && (
          <div className="p-8 text-center border border-dashed rounded-xl">
            <UserPlus className="w-10 h-10 mx-auto text-muted-foreground mb-3 opacity-50" />
            <h3 className="font-semibold text-lg">No leads found</h3>
            <p className="text-sm text-muted-foreground mt-1">Get started by creating your first lead or sending a WhatsApp message.</p>
            <Button onClick={() => setIsOpen(true)} className="mt-4 gap-2" variant="outline">
              <Plus className="w-4 h-4" /> Add Lead
            </Button>
          </div>
        )}
        
        <div className="grid gap-4 max-w-4xl">
          {leads?.map((lead: any) => (
            <Link key={lead.id} href={`/leads/${lead.id}`}>
              <div className="p-6 rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-accent/50 transition-all">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{lead.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                      <span>{lead.phone}</span>
                      {lead.email && <span>• {lead.email}</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold text-foreground">
                        {lead.budget ? `${lead.currency || 'AED'} ${Number(lead.budget).toLocaleString()}` : 'Budget TBD'}
                      </p>
                      <p className="text-xs text-muted-foreground">Source: {lead.source || 'Manual'}</p>
                    </div>
                    <Badge variant={lead.temperature === "HOT" ? "danger" : lead.temperature === "WARM" ? "warning" : "secondary"}>
                      {lead.temperature || "NEW"}
                    </Badge>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Add Lead Modal */}
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-background border border-border rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-xl font-bold mb-1">Add New Lead</h2>
              <p className="text-xs text-muted-foreground mb-4">Enter client contact details to trigger AI scoring & follow-ups.</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">First Name</label>
                    <Input 
                      placeholder="Sultan"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Last Name</label>
                    <Input 
                      placeholder="Al-Mansoor"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Phone Number *</label>
                  <div className="relative">
                    <Input 
                      placeholder="+971 50 123 4567"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Email Address</label>
                  <Input 
                    type="email"
                    placeholder="client@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Target Budget (AED)</label>
                  <Input 
                    type="number"
                    placeholder="5000000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createLeadMutation.isPending}>
                    {createLeadMutation.isPending ? "Creating..." : "Save & Score Lead"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </PageBody>
    </>
  );
}
