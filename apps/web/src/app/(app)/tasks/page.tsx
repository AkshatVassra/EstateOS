"use client";

import { useState } from "react";
import { PageHeader, PageBody } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle, 
  Loader2, 
  User, 
  Calendar, 
  Filter, 
  ArrowRight,
  Flame
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TasksPage() {
  const [filter, setFilter] = useState<string>("ALL");
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("HIGH");
  const [status, setStatus] = useState<"TODO" | "IN_PROGRESS" | "DONE">("TODO");

  const { data: tasksData, isLoading } = useTasks();
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();

  const tasks = Array.isArray(tasksData) ? tasksData : [
    { id: "tsk-1", title: "Prepare SPA Contract for Burj Khalifa Sky Palace", description: "Verify passport documentation and coordinate escrow transfer with Emirates NBD.", status: "TODO", priority: "HIGH", createdAt: new Date(Date.now() - 3600000 * 4).toISOString() },
    { id: "tsk-2", title: "Dispatch 3D Virtual VR Tour to Sheikh Tariq", description: "Send custom branded Matterport link via autonomous WhatsApp gateway.", status: "IN_PROGRESS", priority: "HIGH", createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: "tsk-3", title: "Review AI Lead Qualification Criteria for Q3", description: "Adjust minimum budget threshold in AI Studio from $2M to $5M.", status: "TODO", priority: "MEDIUM", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: "tsk-4", title: "Schedule Private Helipad Tour at Palm Jumeirah", description: "Confirm helicopter availability and concierge refreshments for client arrival.", status: "DONE", priority: "LOW", createdAt: new Date(Date.now() - 86400000 * 3).toISOString() }
  ];

  const filteredTasks = tasks.filter((tsk: any) => {
    if (filter === "ALL") return true;
    return tsk.status === filter;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await createMutation.mutateAsync({ title, description, priority, status });
      setTitle("");
      setDescription("");
      setIsCreating(false);
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  const handleToggleStatus = async (tsk: any) => {
    const nextStatus = tsk.status === "DONE" ? "TODO" : tsk.status === "TODO" ? "IN_PROGRESS" : "DONE";
    try {
      await updateMutation.mutateAsync({ id: tsk.id, data: { status: nextStatus } });
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  return (
    <>
      <PageHeader 
        title="Luxury Concierge Operations & Tasks" 
        description="Track high-priority agent checklists, SPA contract drafting, and automated workflow action items."
      >
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-md flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Concierge Task</span>
          </Button>
        </div>
      </PageHeader>

      <PageBody>
        <div className="space-y-8 max-w-7xl">
          {/* Top Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: "ALL", label: "All Tasks" },
                { id: "TODO", label: "To Do" },
                { id: "IN_PROGRESS", label: "In Progress" },
                { id: "DONE", label: "Completed" }
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
              Showing <span className="font-semibold text-foreground">{filteredTasks.length}</span> operational items
            </div>
          </div>

          {/* Create Task Modal/Form */}
          {isCreating && (
            <Card className="border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 shadow-lg animate-in fade-in-50 duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-primary" />
                    <span>Create New Operations Task</span>
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)} className="h-8 text-xs">
                    Cancel
                  </Button>
                </div>
                <CardDescription>
                  Assign action items to brokers or link them directly to ongoing luxury deal negotiations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                      Task Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Verify KYC and Proof of Funds for Marina Penthouse offer"
                      required
                      className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                      Description / Instructions
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide additional details or link to legal documents..."
                      rows={2}
                      className="w-full p-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        Priority Tier
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as any)}
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      >
                        <option value="HIGH">HIGH - Urgent VIP Priority</option>
                        <option value="MEDIUM">MEDIUM - Standard Operations</option>
                        <option value="LOW">LOW - Routine Follow-up</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        Initial Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      >
                        <option value="TODO">To Do (Pending Start)</option>
                        <option value="IN_PROGRESS">In Progress (Active)</option>
                        <option value="DONE">Completed</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreating(false)} className="text-xs">
                      Discard
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending || !title.trim()}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs px-5 h-9"
                    >
                      {createMutation.isPending ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5 mr-2" />
                          <span>Add to Task Board</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Tasks List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
              <span>Loading concierge task board...</span>
            </div>
          ) : filteredTasks.length === 0 ? (
            <Card className="border-border/60 bg-card/50 p-12 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-base mb-1">No Tasks Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                No tasks currently in this status column. Keep your real estate pipeline running smoothly by adding action items.
              </p>
              <Button onClick={() => setIsCreating(true)} size="sm" className="bg-primary text-primary-foreground font-medium">
                <Plus className="h-4 w-4 mr-2" />
                <span>Create Concierge Task</span>
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((tsk: any) => (
                <Card key={tsk.id} className={cn(
                  "border-border/80 bg-card hover:border-primary/40 transition-all hover:shadow-md",
                  tsk.status === "DONE" && "opacity-60 bg-muted/20"
                )}>
                  <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5 min-w-0">
                      <button
                        onClick={() => handleToggleStatus(tsk)}
                        disabled={updateMutation.isPending}
                        className={cn(
                          "mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center transition-colors shrink-0",
                          tsk.status === "DONE" 
                            ? "bg-emerald-500 border-emerald-500 text-white" 
                            : "border-muted-foreground/40 hover:border-primary"
                        )}
                        title="Toggle status"
                      >
                        {tsk.status === "DONE" && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </button>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={cn(
                            "font-semibold text-sm sm:text-base text-foreground truncate",
                            tsk.status === "DONE" && "line-through text-muted-foreground"
                          )}>
                            {tsk.title}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5",
                              tsk.priority === "HIGH" && "bg-red-500/10 text-red-500 border-red-500/20",
                              tsk.priority === "MEDIUM" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                              tsk.priority === "LOW" && "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            )}
                          >
                            {tsk.priority || "MEDIUM"}
                          </Badge>
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "text-[10px] font-semibold uppercase px-2 py-0.5",
                              tsk.status === "IN_PROGRESS" && "bg-purple-500/10 text-purple-500",
                              tsk.status === "TODO" && "bg-muted text-muted-foreground"
                            )}
                          >
                            {tsk.status === "DONE" ? "Completed" : tsk.status === "IN_PROGRESS" ? "In Progress" : "To Do"}
                          </Badge>
                        </div>
                        {tsk.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {tsk.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleToggleStatus(tsk)}
                        className="text-xs font-medium h-8 bg-muted/40 hover:bg-muted"
                      >
                        {tsk.status === "DONE" ? "Reopen" : "Mark Done"}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(tsk.id)}
                        disabled={deleteMutation.isPending}
                        className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                        title="Delete task"
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
