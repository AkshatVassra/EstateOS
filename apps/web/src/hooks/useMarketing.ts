import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";

export function useCampaigns() {
  const api = useApiClient();

  return useQuery({
    queryKey: ["campaigns"],
    queryFn: () => api.get("/marketing"),
  });
}

export function useCreateCampaign() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => api.post("/marketing", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useGenerateMarketingCopy() {
  const api = useApiClient();

  return useMutation({
    mutationFn: (data: any) => api.post("/marketing/generate", data),
  });
}
