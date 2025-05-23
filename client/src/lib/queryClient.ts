import { QueryClient } from "@tanstack/react-query";

// Create the query client for React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// Base URL for API requests
const API_BASE_URL = import.meta.env.PROD 
  ? '/.netlify/functions/api' // Use Netlify Functions in production
  : ''; // Use relative URLs in development

// Helper function for API requests
export async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  try {
    console.log(`API request: ${options.method || 'GET'} ${url}`);
    
    // Get the authentication token from localStorage
    const token = localStorage.getItem('trade_navigator_token');
    
    // Prepare the headers
    const headers = new Headers(options.headers || {});
    
    // Set content type if not already set
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    
    // Set auth token if available
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    // Prepare the final URL (add API base URL if needed)
    const fullUrl = url.startsWith('/api/') 
      ? `${API_BASE_URL}${url}` // Add API base URL for API routes
      : url; // Use as is for other URLs

    // Make the request
    const response = await fetch(fullUrl, {
      ...options,
      headers
    });
    
    return response;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// Add a typed version of the API request
export async function apiRequestJson<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null; status: number }> {
  try {
    const response = await apiRequest(url, options);
    const status = response.status;
    
    // Try to parse the response as JSON
    const data = await response.json().catch(() => null);
    
    if (!response.ok) {
      // Handle authentication errors
      if (status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('trade_navigator_token');
        window.location.href = '/auth/login';
      }
      
      return {
        data: null,
        error: data?.error || 'An error occurred',
        status
      };
    }
    
    return {
      data,
      error: null,
      status
    };
  } catch (error) {
    return {
      data: null,
      error: 'Network error',
      status: 0
    };
  }
}
