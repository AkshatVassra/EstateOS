"use client";

import { useState } from "react";
import Link from "next/link";
import { PageBody, PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles, AlertCircle, CheckCircle2, Plus, Loader2, BrainCircuit } from "lucide-react";
import { useTasks, useCreateTask } from "@/hooks/useTasks";
import { useDashboardOverview } from "@/hooks/useDashboard";

export default function CommandCenterPage() {
  const { data: tasksData, isLoading: tasksLoading, isError: tasksError } = useTasks();
  const { data: overviewData, isLoading: overviewLoading } = useDashboardOverview();
  const createTaskMutation = useCreateTask();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("HIGH");
  const [isCreating, setIsCreating] = useState(false);

  const tasks = Array.isArray(tasksData) ? tasksData : [];
  const overview = overviewData?.overview || {};
  const hotLeads = Array.isArray(overview.hotLeadRecords) ? overview.hotLeadRecords : [];
  const messagesAwaitingReply = Array.isArray(overview.messagesAwaitingReply) ? overview.messagesAwaitingReply : [];
  const overdueTasks = Array.isArray(overview.overdueTasks) ? overview.overdueTasks : [];
  const aiPriorities = Array.isArray(overviewData?.aiPriorities) ? overviewData.aiPriorities : [];
  const aiInsights = overviewData?.aiInsights || {
    summary: "AI Pipeline Telemetry Active. Scanning live lead data for high-conversion opportunities.",
    recommendation: "Focus on contacting Hot Leads within 15 minutes to maximize close rates."
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await createTaskMutation.mutateAsync({
      title: newTaskTitle,
      priority: newTaskPriority,
      status: "TODO"
    });
    setNewTaskTitle("");
    setIsCreating(false);
  };

  return (
    <>
      <PageHeader
        title="AI Command Center"
        description="Your intelligent operating system prioritizing critical deals, tasks, and real-time alerts."
        actions={
          <Button variant="accent" onClick={() => setIsCreating(!isCreating)}>
            <Plus className="h-4 w-4 mr-2" />
            {isCreating ? "Cancel" : "New Task"}
          </Button>
        }
      />
      <PageBody>
        {/* AI Executive Insight Banner */}
        <Card className="mb-8 border-accent/40 bg-linear-to-r from-accent/10 via-background to-background shadow-md">
          <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-accent/20 text-accent shrink-0 mt-0.5">
                <BrainCircuit className="h-6 w-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="accent" className="text-[10px] uppercase font-extrabold tracking-wider">
                    AI Strategic Advisory
                  </Badge>
                  <span className="text-xs text-muted-foreground">• Live Telemetry Active</span>
                </div>
                <h3 className="font-bold text-base text-foreground">{aiInsights.summary}</h3>
                <p className="text-sm text-muted-foreground">{aiInsights.recommendation}</p>
              </div>
            </div>
            <Link href="/ai-studio">
              <Button variant="outline" size="sm" className="gap-2 border-accent/40 text-accent hover:bg-accent/10 shrink-0">
                <Sparkles className="h-4 w-4" />
                Launch AI Studio
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Inline Task Creator */}
        {isCreating && (
          <Card className="mb-8 border-accent/30 bg-accent/5">
            <CardContent className="pt-6">
              <form onSubmit={handleCreateTask} className="flex flex-col sm:flex-row gap-4 items-center">
                <Input
                  placeholder="e.g. Schedule private penthouse viewing for H.E. Sheikh Sultan..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 bg-background"
                  autoFocus
                />
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                  className="rounded-md border border-border bg-background p-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="HIGH">HIGH PRIORITY</option>
                  <option value="MEDIUM">MEDIUM PRIORITY</option>
                  <option value="LOW">LOW PRIORITY</option>
                </select>
                <Button type="submit" variant="accent" disabled={createTaskMutation.isPending || !newTaskTitle.trim()}>
                  {createTaskMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Add Priority Task
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Hot leads</CardTitle><CardDescription>Highest intent right now</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              {hotLeads.length === 0 ? <p className="text-sm text-muted-foreground">No hot leads yet.</p> : hotLeads.map((lead: any) => (
                <Link key={lead.id} href={`/leads/${lead.id}`} className="flex items-center justify-between gap-3 rounded-md border p-3 hover:border-accent">
                  <span className="truncate text-sm font-medium">{lead.name}</span><Badge variant="danger">{lead.score}</Badge>
                </Link>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Awaiting reply</CardTitle><CardDescription>Inbound messages from the last 24 hours</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              {messagesAwaitingReply.length === 0 ? <p className="text-sm text-muted-foreground">Inbox is clear.</p> : messagesAwaitingReply.map((message: any) => (
                <Link key={message.id} href="/messages" className="block truncate rounded-md border p-3 text-sm hover:border-accent">{message.conversation?.lead?.name || message.sender}: {message.body}</Link>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Overdue tasks</CardTitle><CardDescription>Work that needs attention</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              {overdueTasks.length === 0 ? <p className="text-sm text-muted-foreground">Nothing overdue.</p> : overdueTasks.map((task: any) => (
                <Link key={task.id} href={`/tasks/${task.id}`} className="block truncate rounded-md border p-3 text-sm hover:border-accent">{task.title}</Link>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 max-w-7xl">
          {/* AI Prioritized Action Feed */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                AI Priority Actions
              </h3>
              <span className="text-xs text-muted-foreground">Generated from live lead metrics</span>
            </div>

            {overviewLoading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
                <Loader2 className="h-5 w-5 animate-spin mr-2 text-accent" />
                Analyzing pipeline data...
              </div>
            ) : aiPriorities.length === 0 ? (
              <Card className="p-8 text-center border-dashed">
                <CheckCircle2 className="h-10 w-10 text-success/60 mx-auto mb-2" />
                <p className="font-semibold text-sm">No critical alerts detected.</p>
                <p className="text-xs text-muted-foreground mt-1">Your real estate pipeline is clean and on track.</p>
              </Card>
            ) : (
              aiPriorities.map((item: any) => (
                <Card 
                  key={item.id} 
                  className="border-l-4 overflow-hidden transition-all hover:shadow-md"
                  style={{
                    borderLeftColor: item.priority === 'HIGH' ? 'hsl(var(--danger))' : 
                                     item.priority === 'MEDIUM' ? 'hsl(var(--warning))' : 
                                     'hsl(var(--accent))'
                  }}
                >
                  <CardContent className="p-5 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          item.priority === 'HIGH' ? 'danger' :
                          item.priority === 'MEDIUM' ? 'warning' : 'secondary'
                        } className="text-[10px] px-1.5 py-0 uppercase">
                          {item.priority}
                        </Badge>
                        <h4 className="font-semibold text-sm text-foreground">{item.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                    {item.actionUrl && (
                      <Link href={item.actionUrl} className={buttonVariants({ variant: item.priority === 'HIGH' ? 'default' : 'outline', size: 'sm' })}>
                        Take Action
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Database Task List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                Scheduled Agent Tasks
              </h3>
              <span className="text-xs text-muted-foreground">System Database</span>
            </div>

            {tasksLoading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Loading tasks...
              </div>
            ) : tasksError ? (
              <Card className="p-6 text-center border-danger/30 bg-danger/5 text-danger">
                <p className="text-sm font-semibold">Failed to load tasks.</p>
                <p className="text-xs mt-1">Check API server connection.</p>
              </Card>
            ) : tasks.length === 0 ? (
              <Card className="p-8 text-center border-dashed">
                <p className="text-sm font-semibold">No tasks scheduled.</p>
                <p className="text-xs text-muted-foreground mt-1">Click &apos;New Task&apos; above to assign work.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {tasks.map((task: any) => (
                  <Card key={task.id} className="p-4 flex items-center justify-between gap-3 shadow-2xs hover:border-accent/40 transition-all">
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          task.priority === 'HIGH' ? 'danger' :
                          task.priority === 'MEDIUM' ? 'warning' : 'secondary'
                        } className="text-[9px] px-1 py-0 uppercase">
                          {task.priority || "NORMAL"}
                        </Badge>
                        <h4 className="font-semibold text-xs truncate text-foreground">{task.title}</h4>
                      </div>
                      {task.description && (
                        <p className="text-[11px] text-muted-foreground truncate">{task.description}</p>
                      )}
                    </div>
                    <Link href={`/tasks/${task.id}`} className="text-xs font-medium text-accent hover:underline shrink-0">
                      View →
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageBody>
    </>
  );
}
