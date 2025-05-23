/**
 * Centralized navigation utility to ensure consistent routing throughout the application
 */

export function formatLinkHref(path: string): string {
  return getHashUrl(path);
}

export function navigateTo(path: string): void {
  const cleanPath = cleanHashPath(path);
  window.location.href = window.location.origin + '#' + cleanPath;
}

export function getHashUrl(path: string): string {
  return '#' + cleanHashPath(path);
}

export function isActivePath(path: string): boolean {
  const cleanPath = cleanHashPath(path);
  const currentHash = window.location.hash.replace('#', '');
  return cleanPath === currentHash;
}

function cleanHashPath(path: string): string {
  return path
    .replace(/^[#/]+/, '') // Remove leading hash and slashes
    .replace(/\/+/g, '/') // Replace multiple slashes with single slash
    .replace(/\/+$/, ''); // Remove trailing slashes
}
