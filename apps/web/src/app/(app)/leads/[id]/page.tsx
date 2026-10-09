"use client";

import { use } from "react";
import { PageHeader, PageBody } from "@/components/layout/page-header";
import { mockLeads } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MapPin, Wallet, Calendar, User, Activity } from "lucide-react";

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const lead = mockLeads.find((l) => l.id === resolvedParams.id);

  if (!lead) {
    notFound();
  }

  return (
    <>
      <PageHeader 
        title={lead.name} 
        description="AI Lead Qualification Profile"
      />
      <PageBody>
        <div className="space-y-8 max-w-5xl">
           <div className="flex flex-wrap gap-2">
             <Badge variant={lead.temperature === "HOT" ? "danger" : lead.temperature === "WARM" ? "warning" : "secondary"}>
               {lead.temperature}
             </Badge>
             <Badge variant="outline">{lead.status}</Badge>
           </div>
           
           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
             <Card>
               <CardContent className="p-6 flex items-start gap-4">
                 <div className="p-3 bg-muted rounded-lg">
                   <Phone className="h-5 w-5 text-foreground" />
                 </div>
                 <div>
                   <p className="text-sm text-muted-foreground">Contact</p>
                   <p className="font-semibold text-lg">{lead.phone}</p>
                 </div>
               </CardContent>
             </Card>
             
             <Card>
               <CardContent className="p-6 flex items-start gap-4">
                 <div className="p-3 bg-muted rounded-lg">
                   <Wallet className="h-5 w-5 text-foreground" />
                 </div>
                 <div>
                   <p className="text-sm text-muted-foreground">Budget</p>
                   <p className="font-semibold text-lg">{lead.budget}</p>
                 </div>
               </CardContent>
             </Card>

             <Card>
               <CardContent className="p-6 flex items-start gap-4">
                 <div className="p-3 bg-muted rounded-lg">
                   <MapPin className="h-5 w-5 text-foreground" />
                 </div>
                 <div>
                   <p className="text-sm text-muted-foreground">Preferred Area</p>
                   <p className="font-semibold text-lg">{lead.area}</p>
                 </div>
               </CardContent>
             </Card>

             <Card>
               <CardContent className="p-6 flex items-start gap-4">
                 <div className="p-3 bg-muted rounded-lg">
                   <Calendar className="h-5 w-5 text-foreground" />
                 </div>
                 <div>
                   <p className="text-sm text-muted-foreground">Timeline</p>
                   <p className="font-semibold text-lg">{lead.timeline}</p>
                 </div>
               </CardContent>
             </Card>

             <Card>
               <CardContent className="p-6 flex items-start gap-4">
                 <div className="p-3 bg-muted rounded-lg">
                   <Activity className="h-5 w-5 text-foreground" />
                 </div>
                 <div>
                   <p className="text-sm text-muted-foreground">AI Score</p>
                   <p className="font-semibold text-lg">{lead.score}%</p>
                 </div>
               </CardContent>
             </Card>

             <Card>
               <CardContent className="p-6 flex items-start gap-4">
                 <div className="p-3 bg-muted rounded-lg">
                   <User className="h-5 w-5 text-foreground" />
                 </div>
                 <div>
                   <p className="text-sm text-muted-foreground">Assigned Agent</p>
                   <p className="font-semibold text-lg">{lead.agent}</p>
                 </div>
               </CardContent>
             </Card>
           </div>
        </div>
      </PageBody>
    </>
  );
}
