import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";

export function useLeads() {
  const api = useApiClient();

  return useQuery({
    queryKey: ["leads"],
    queryFn: () => api.get("/leads"),
  });
}

export function useLead(id: string) {
  const api = useApiClient();

  return useQuery({
    queryKey: ["leads", id],
    queryFn: () => api.get(`/leads/${id}`),
    enabled: !!id,
  });
}

export function useCreateLead() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => api.post("/leads", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}
