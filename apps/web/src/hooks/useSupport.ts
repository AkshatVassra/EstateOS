import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";

export function useSupportTickets() {
  const api = useApiClient();
  return useQuery({
    queryKey: ["support-tickets"],
    queryFn: () => api.get("/support"),
  });
}

export function useKnowledgeBase(query?: string) {
  const api = useApiClient();
  return useQuery({
    queryKey: ["support-kb", query],
    queryFn: () => api.get(query ? `/support/kb?q=${encodeURIComponent(query)}` : "/support/kb"),
  });
}

export function useSystemStatus() {
  const api = useApiClient();
  return useQuery({
    queryKey: ["support-status"],
    queryFn: () => api.get("/support/status"),
    refetchInterval: 10000, // Real-time telemetry poll every 10s
  });
}

export function useCreateTicket() {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { subject: string }) => api.post("/support", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
  });
}
