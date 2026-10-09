import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";

export function useAgencies() {
  const api = useApiClient();
  return useQuery({
    queryKey: ["agencies"],
    queryFn: () => api.get("/agencies"),
  });
}

export function useAgency(id: string) {
  const api = useApiClient();
  return useQuery({
    queryKey: ["agency", id],
    queryFn: () => api.get(`/agencies/${id}`),
    enabled: !!id,
  });
}

export function useUpdateAgency() {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/agencies/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["agency", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
    },
  });
}

export function useUpdateAgencySettings() {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/agencies/${id}/settings`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["agency", variables.id] });
    },
  });
}
