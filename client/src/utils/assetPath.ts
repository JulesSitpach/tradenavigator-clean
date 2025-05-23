/**
 * Helper function to handle asset paths correctly in Replit environment
 * This works around Vite config restrictions
 */
export function getAssetPath(relativePath: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}${relativePath.startsWith('/') ? relativePath : `/${relativePath}`}`;
}
