import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";

export function useAnalytics(range: string = "30d") {
  const api = useApiClient();
  return useQuery({
    queryKey: ["analytics", range],
    queryFn: () => api.get(`/analytics?range=${encodeURIComponent(range)}`),
  });
}
