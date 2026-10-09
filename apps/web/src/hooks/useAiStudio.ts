import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";

export function useAiReply() {
  const api = useApiClient();
  return useMutation({
    mutationFn: ({ leadId, context }: { leadId: string; context?: string }) =>
      api.post("/ai/reply", { leadId, context }),
  });
}

export function useAiSummary() {
  const api = useApiClient();
  return useMutation({
    mutationFn: ({ leadId }: { leadId: string }) =>
      api.post("/ai/summary", { leadId }),
  });
}

export function useAiRecommend() {
  const api = useApiClient();
  return useMutation({
    mutationFn: ({ leadId, preferences }: { leadId: string; preferences?: any }) =>
      api.post("/ai/recommend", { leadId, preferences }),
  });
}

export function useAiSalesCoach() {
  const api = useApiClient();
  return useMutation({
    mutationFn: ({ leadId, objection }: { leadId: string; objection?: string }) =>
      api.post("/ai/sales-coach", { leadId, objection }),
  });
}

export function useAiCaption() {
  const api = useApiClient();
  return useMutation({
    mutationFn: ({ propertyId, platform, tone }: { propertyId: string; platform?: string; tone?: string }) =>
      api.post("/ai/caption", { propertyId, platform, tone }),
  });
}

export function useAiFollowup() {
  const api = useApiClient();
  return useMutation({
    mutationFn: ({ leadId, stage }: { leadId: string; stage?: string }) =>
      api.post("/ai/followup", { leadId, stage }),
  });
}

export function useAiQualify() {
  const api = useApiClient();
  return useMutation({
    mutationFn: ({ leadId }: { leadId: string }) =>
      api.post("/ai/qualify", { leadId }),
  });
}

export function useAiEmail() {
  const api = useApiClient();
  return useMutation({
    mutationFn: ({ targetName, topic }: { targetName?: string; topic?: string }) =>
      api.post("/ai/email", { targetName, topic }),
  });
}

export function useAiProposal() {
  const api = useApiClient();
  return useMutation({
    mutationFn: ({ clientName, propertyName }: { clientName?: string; propertyName?: string }) =>
      api.post("/ai/proposal", { clientName, propertyName }),
  });
}

export function useAiContract() {
  const api = useApiClient();
  return useMutation({
    mutationFn: ({ clauseType }: { clauseType?: string }) =>
      api.post("/ai/contract", { clauseType }),
  });
}

export function useAiMarketInsights(location?: string) {
  const api = useApiClient();
  const queryString = location ? `?location=${encodeURIComponent(location)}` : "";
  return useQuery({
    queryKey: ["ai-market-insights", location],
    queryFn: () => api.get(`/ai/market-insights${queryString}`),
    enabled: !!location,
  });
}

export function useAiPerformance(agentId?: string) {
  const api = useApiClient();
  const queryString = agentId ? `?agentId=${encodeURIComponent(agentId)}` : "";
  return useQuery({
    queryKey: ["ai-performance", agentId],
    queryFn: () => api.get(`/ai/performance${queryString}`),
  });
}
