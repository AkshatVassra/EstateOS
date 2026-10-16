// @ts-nocheck
import { supabase } from "./supabase";

const SUPABASE_FUNCTIONS_URL = process.env.NEXT_PUBLIC_SUPABASE_URL + '/functions/v1';

export function useApiClient() {
  const fetchWithToken = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
    try {
      // Map endpoints to Supabase Edge Functions
      const functionMap: Record<string, string> = {
        '/leads': 'leads',
        '/properties': 'properties',
        '/dashboard': 'dashboard',
        '/api/leads': 'leads',
        '/api/properties': 'properties',
        '/api/dashboard': 'dashboard',
      };

      // Check if this endpoint maps to an Edge Function
      const functionName = functionMap[endpoint] || functionMap[endpoint.replace('/api', '')];

      if (functionName) {
        const url = `${SUPABASE_FUNCTIONS_URL}/${functionName}`;
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabase.auth.session()?.access_token || ''}`,
            ...options.headers,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.data || data;
      }

      // For endpoints not yet migrated, return empty array
      console.log('Endpoint not yet migrated to Edge Functions:', endpoint);
      return [];
    } catch (error) {
      console.error('API call failed:', error);
      // Return empty array on error
      return [];
    }
  };

  return {
    get: (endpoint: string) => fetchWithToken(endpoint),
    post: (endpoint: string, body: any) => fetchWithToken(endpoint, { method: "POST", body: JSON.stringify(body) }),
    put: (endpoint: string, body: any) => fetchWithToken(endpoint, { method: "PUT", body: JSON.stringify(body) }),
    delete: (endpoint: string) => fetchWithToken(endpoint, { method: "DELETE" }),
  };
}
