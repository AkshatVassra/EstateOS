import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";

export function useDashboardOverview() {
  const api = useApiClient();
  return useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: () => api.get("/dashboard/overview"),
  });
}

export function useDashboardLeaderboard() {
  const api = useApiClient();
  return useQuery({
    queryKey: ["dashboard-leaderboard"],
    queryFn: () => api.get("/dashboard/leaderboard"),
  });
}

export function useDashboardActivity() {
  const api = useApiClient();
  return useQuery({
    queryKey: ["dashboard-activity"],
    queryFn: () => api.get("/dashboard/activity"),
  });
}
