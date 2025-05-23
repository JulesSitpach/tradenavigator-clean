/**
 * URL Sanitizer for TradeNavigator
 * This utility specifically addresses the "Repeated forward slashes" and "backslashes" errors
 * by properly formatting and cleaning URLs throughout the application
 */

/**
 * Sanitizes a URL to prevent issues with repeated forward slashes and backslashes
 * @param url The URL to sanitize
 * @returns A sanitized URL
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  // Remove any backslashes
  let sanitized = url.replace(/\\/g, '');
  
  // Handle the case where we might have a protocol
  const hasProtocol = sanitized.includes('://');
  
  if (hasProtocol) {
    const [protocol, ...rest] = sanitized.split('://');
    const path = rest.join('://').replace(/([^:]\/)\/+/g, '$1');
    sanitized = `${protocol}://${path}`;
  } else {
    // No protocol, just clean up multiple slashes
    sanitized = sanitized.replace(/\/+/g, '/');
  }
  
  return sanitized;
}

/**
 * Creates a sanitized hash URL from a path
 * @param path The path to convert to a hash URL
 * @returns A properly formatted and sanitized hash URL
 */
export function createHashUrl(path: string): string {
  // Remove any hash symbols
  let cleanPath = path.replace(/^#+/, '');
  
  // Remove any backslashes
  cleanPath = cleanPath.replace(/\\/g, '');
  
  // Clean up repeated slashes
  cleanPath = cleanPath.replace(/\/+/g, '/');
  
  // Ensure leading slash if not empty
  if (cleanPath && !cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }
  
  // Return with hash
  return '#' + cleanPath;
}

/**
 * Navigates to a path using the sanitized hash URL format
 * @param path The path to navigate to
 */
export function navigateToClean(path: string): void {
  const hashUrl = createHashUrl(path);
  
  // Only update the hash part, not the full URL
  window.location.hash = hashUrl.substring(1);
}
