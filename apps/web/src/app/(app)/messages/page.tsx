"use client";

import { useState } from "react";
import { PageHeader, PageBody } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Bot, Phone, Search, Send, Loader2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useConversations, useSendMessage } from "@/hooks/useConversations";
import { useAiReply } from "@/hooks/useAiStudio";

export default function MessagesPage() {
  const { data: conversations, isLoading } = useConversations();
  const sendMessageMutation = useSendMessage();
  const aiReplyMutation = useAiReply();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const convList = Array.isArray(conversations) ? conversations : [];
  const filteredConvs = convList.filter((c: any) =>
    (c.lead?.name || "Client").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.channel || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConv = convList.find((c: any) => c.id === selectedId) || (filteredConvs.length > 0 ? filteredConvs[0] : null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedConv) return;
    await sendMessageMutation.mutateAsync({
      conversationId: selectedConv.id,
      content: inputMessage,
      senderType: "AGENT"
    });
    setInputMessage("");
  };

  const handleAiSuggest = async () => {
    if (!selectedConv) return;
    const res = await aiReplyMutation.mutateAsync({
      leadId: selectedConv.leadId || selectedConv.id,
      context: selectedConv.messages?.[selectedConv.messages.length - 1]?.content || "Inbound message"
    });
    if (res && (res.reply || res.content || typeof res === "string")) {
      setInputMessage(res.reply || res.content || res);
    }
  };

  return (
    <>
      <PageHeader 
        title="Unified Multi-Channel Inbox" 
        description="Manage live WhatsApp, Email, and In-App conversations with real-time AI reply suggestions." 
      />
      <PageBody>
        <div className="grid lg:grid-cols-3 gap-6 h-[650px] max-w-7xl">
          {/* Sidebar */}
          <Card className="lg:col-span-1 h-full flex flex-col overflow-hidden border-0 shadow-md">
            <div className="p-4 border-b border-border bg-muted/30">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search live conversations..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-background" 
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {isLoading && (
                <div className="flex items-center justify-center py-10 text-muted-foreground text-sm">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading inbox...
                </div>
              )}
              {!isLoading && filteredConvs.length === 0 && (
                <div className="text-center py-12 text-muted-foreground text-xs">
                  No active conversations found.
                </div>
              )}
              {filteredConvs.map((conv: any) => {
                const isSelected = selectedConv?.id === conv.id;
                const lastMsg = conv.messages && conv.messages.length > 0 ? conv.messages[conv.messages.length - 1] : null;
                return (
                  <div 
                    key={conv.id} 
                    onClick={() => setSelectedId(conv.id)}
                    className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                      isSelected 
                        ? 'bg-accent/15 border-accent shadow-sm' 
                        : 'border-transparent hover:bg-muted/60'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-foreground">{conv.lead?.name || "VIP Client"}</p>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 uppercase">
                          {conv.channel || "WhatsApp"}
                        </Badge>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "New"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate font-sans">
                      {lastMsg ? (lastMsg.body || lastMsg.content) : "No messages yet. Start the conversation."}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 h-full flex flex-col overflow-hidden border-0 shadow-md">
            {selectedConv ? (
              <>
                <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">
                      {(selectedConv.lead?.name || "C").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{selectedConv.lead?.name || "VIP Client"}</h3>
                        <Badge variant="success" className="text-[10px]">Live</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {selectedConv.channel || "WhatsApp"} • {selectedConv.lead?.phone || selectedConv.lead?.email || "Connected"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleAiSuggest} 
                      disabled={aiReplyMutation.isPending}
                      className="text-accent border-accent/40 hover:bg-accent/10"
                      title="Generate AI Reply Suggestion"
                    >
                      {aiReplyMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-1.5" />
                          AI Suggest Reply
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="icon"><Phone className="h-4 w-4" /></Button>
                  </div>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-background/50">
                  {(!selectedConv.messages || selectedConv.messages.length === 0) ? (
                    <div className="text-center py-20 text-muted-foreground text-xs">
                      No messages in this thread yet. Send a message or click &apos;AI Suggest Reply&apos;.
                    </div>
                  ) : (
                    selectedConv.messages.map((msg: any, idx: number) => {
                      const isAgent = msg.senderType === "AGENT" || msg.senderType === "SYSTEM" || msg.direction === "OUTBOUND";
                      return (
                        <div key={msg.id || idx} className={`flex ${isAgent ? "justify-end" : "justify-start"}`}>
                          <div className={`p-3.5 rounded-2xl max-w-[75%] shadow-sm ${
                            isAgent 
                              ? "bg-accent text-accent-foreground rounded-tr-xs font-sans" 
                              : "bg-muted text-foreground rounded-tl-xs font-sans border border-border"
                          }`}>
                            <p className="text-sm leading-relaxed">{msg.body || msg.content}</p>
                            <span className={`text-[9px] block mt-1.5 text-right ${isAgent ? "text-accent-foreground/75" : "text-muted-foreground"}`}>
                              {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="p-4 border-t border-border bg-muted/10">
                  <form onSubmit={handleSend} className="flex gap-2.5">
                    <Input 
                      placeholder="Type your message or click 'AI Suggest Reply'..." 
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      className="flex-1 bg-background" 
                    />
                    <Button type="submit" variant="accent" disabled={sendMessageMutation.isPending || !inputMessage.trim()}>
                      {sendMessageMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                <Bot className="h-12 w-12 text-muted-foreground/40 mb-3" />
                <p className="font-semibold text-foreground">No Conversation Selected</p>
                <p className="text-xs mt-1">Select a client thread from the sidebar to view live chat history.</p>
              </div>
            )}
          </Card>
        </div>
      </PageBody>
    </>
  );
}
