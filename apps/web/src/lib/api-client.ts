import { useAuth } from "@clerk/nextjs";

export function useApiClient() {
  const { getToken } = useAuth();

  const fetchWithToken = async (endpoint: string, options: RequestInit = {}) => {
    const token = await getToken();
    const headers = new Headers(options.headers || {});
    
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");

    // Make request to the proxy we setup in next.config.ts
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "An error occurred");
    }

    return data.data || data; // Return the 'data' field from our ApiResponse wrapper
  };

  return {
    get: (endpoint: string) => fetchWithToken(endpoint),
    post: (endpoint: string, body: any) => fetchWithToken(endpoint, { method: "POST", body: JSON.stringify(body) }),
    put: (endpoint: string, body: any) => fetchWithToken(endpoint, { method: "PUT", body: JSON.stringify(body) }),
    delete: (endpoint: string) => fetchWithToken(endpoint, { method: "DELETE" }),
  };
}
