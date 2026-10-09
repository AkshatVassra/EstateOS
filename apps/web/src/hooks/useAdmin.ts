import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";

export function useAdminOverview() {
  const api = useApiClient();
  return useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => api.get("/admin/overview"),
  });
}

export function useAdminAgencies() {
  const api = useApiClient();
  return useQuery({
    queryKey: ["admin-agencies"],
    queryFn: () => api.get("/admin/agencies"),
  });
}

export function useAdminUsers(agencyId?: string) {
  const api = useApiClient();
  return useQuery({
    queryKey: ["admin-users", agencyId],
    queryFn: () => api.get(agencyId ? `/admin/users?agencyId=${agencyId}` : "/admin/users"),
  });
}

export function useAdminAuditLogs(agencyId?: string) {
  const api = useApiClient();
  return useQuery({
    queryKey: ["admin-audit-logs", agencyId],
    queryFn: () => api.get(agencyId ? `/admin/audit-logs?agencyId=${agencyId}` : "/admin/audit-logs"),
  });
}
