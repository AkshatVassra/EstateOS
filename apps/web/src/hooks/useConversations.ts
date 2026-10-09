import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";

export function useConversations() {
  const api = useApiClient();

  return useQuery({
    queryKey: ["conversations"],
    queryFn: () => api.get("/communication/conversations"),
  });
}

export function useConversation(id: string) {
  const api = useApiClient();

  return useQuery({
    queryKey: ["conversation", id],
    queryFn: () => api.get(`/communication/conversations/${id}`),
    enabled: !!id,
  });
}

export function useSendMessage() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, content, senderType }: { conversationId: string; content: string; senderType?: string }) =>
      api.post(`/communication/conversations/${conversationId}/messages`, { content, senderType: senderType || "AGENT" }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["conversation", variables.conversationId] });
    },
  });
}
