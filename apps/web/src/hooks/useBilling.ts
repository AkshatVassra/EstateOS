import { useQuery, useMutation } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";

export function useBilling() {
  const api = useApiClient();

  return useQuery({
    queryKey: ["billing"],
    queryFn: () => api.get("/billing"),
  });
}

export function useCreateCheckout() {
  const api = useApiClient();

  return useMutation({
    mutationFn: ({ priceId }: { priceId: string }) => api.post("/billing", { priceId }),
  });
}
