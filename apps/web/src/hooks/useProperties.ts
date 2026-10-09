import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";

export function useProperties(params?: Record<string, string>) {
  const api = useApiClient();
  const queryString = params ? "?" + new URLSearchParams(params).toString() : "";

  return useQuery({
    queryKey: ["properties", params],
    queryFn: () => api.get(`/properties${queryString}`),
  });
}

export function useProperty(id: string) {
  const api = useApiClient();

  return useQuery({
    queryKey: ["property", id],
    queryFn: () => api.get(`/properties/${id}`),
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => api.post("/properties", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}

export function useUpdateProperty() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/properties/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property", variables.id] });
    },
  });
}

export function useDeleteProperty() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/properties/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}
