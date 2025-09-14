import { QueryClient } from "@tanstack/react-query";

const API_BASE_URL = "";

// Configure query client with proper defaults for ESG data
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }: { queryKey: readonly unknown[] }) => {
        const [endpoint] = queryKey as [string];
        
        if (!endpoint) {
          throw new Error('Query key must contain an endpoint');
        }
        
        const fullUrl = `${API_BASE_URL}${endpoint}`;
        console.log("Fetching:", endpoint);
        const response = await fetch(fullUrl);
        
        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status} for ${fullUrl}`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Received data:", data);
        return data;
      },
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes for ESG data
      cacheTime: 10 * 60 * 1000, // 10 minutes cache
    },
    mutations: {
      retry: 1,
    },
  },
});

// Generic API request function for mutations
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `${response.status}: ${response.statusText}`;
    
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    
    throw new Error(errorMessage);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response.text();
}

export default queryClient;
