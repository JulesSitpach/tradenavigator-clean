/**
 * Navigation utility functions to standardize routing across the application
 */

/**
 * Creates a properly formatted hash URL without leading slashes
 * 
 * @param path The path to navigate to (without # prefix)
 * @returns A properly formatted hash URL
 */
export function createHashUrl(path: string): string {
  // Remove any hash symbols and leading slashes
  const cleanPath = path.replace(/^[#/]+/, '');
  // Return with just the hash symbol
  return '#' + cleanPath;
}

/**
 * Navigate to a route using hash-based navigation
 * 
 * @param path The path to navigate to
 */
export function navigateToRoute(path: string): void {
  // Remove any hash symbols and leading slashes
  const cleanPath = path.replace(/^[#/]+/, '');
  // Set the hash properly
  window.location.hash = cleanPath;
}

/**
 * Standardize navigate() function calls to work with the hash router
 * 
 * @param navigate The navigate function from wouter
 * @param path The path to navigate to
 */
export function standardNavigate(navigate: (to: string, opts?: any) => void, path: string): void {
  // Remove any hash symbols and leading slashes
  const cleanPath = path.replace(/^[#/]+/, '');
  navigate(cleanPath, { replace: true });
}
