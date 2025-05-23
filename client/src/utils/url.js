/**
 * Normalizes URL paths to prevent double slashes
 * @param {string} base - The base URL (e.g., domain)
 * @param {string} path - The path to append
 * @returns {string} - Properly joined URL without double slashes
 */
export function normalizePath(base, path) {
  // Remove trailing slash from base if present
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  // Ensure path starts with a slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

/**
 * Fixes a URL that might have double slashes
 * @param {string} url - The potentially problematic URL
 * @returns {string} - Fixed URL without double slashes
 */
export function fixUrl(url) {
  // Replace any instance of double slashes with a single slash
  // but preserve the protocol's double slash
  return url.replace(/:\/\//, '___PROTOCOL___')
            .replace(/\/\//g, '/')
            .replace(/___PROTOCOL___/, '://');
}

/**
 * Creates a proper hash URL without double slashes
 * @param {string} path - The path for hash navigation
 * @returns {string} - Properly formatted hash URL
 */
export function createHashUrl(path) {
  // Remove any leading slashes and hash symbols
  let cleanPath = path.replace(/^[#\/]+/, '');
  // Return with just the hash
  return '#' + cleanPath;
}

/**
 * Sets the hash for navigation without causing duplicate slashes
 * @param {string} path - The path to navigate to
 */
export function navigateToHash(path) {
  // Remove any hash symbols and leading slashes
  let cleanPath = path.replace(/^[#\/]+/, '');
  // Set the hash properly
  window.location.hash = cleanPath;
}
