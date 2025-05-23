/**
 * API utility functions to ensure consistent API URL handling
 */

// Get the base URL for API requests
export function getApiBaseUrl(): string {
  // Use the current origin to build API URLs
  return window.location.origin;
}

// Build a full API URL from a path
export function getApiUrl(path: string): string {
  const baseUrl = import.meta.env.DEV ? 'http://0.0.0.0:5000' : '';
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
