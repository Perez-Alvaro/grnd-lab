/**
 * src/lib/routeObfuscator.js
 * Derives the protected editor path at runtime from a salt + segment.
 * The exact path is never visible as a plain string in source code.
 *
 * Even if someone discovers the obfuscated URL, ProtectedRoute still
 * blocks unauthenticated access — this is defense-in-depth.
 */

const ROUTE_SALT = 'c04ch-r0ut1ne-s4lt-2024';
const APP_SEGMENT = 'editor';

/**
 * Base64url-encode a UTF-8 string.
 * No native modules — uses btoa() which is available in all modern browsers and Node ≥16.
 */
function base64url(str) {
  // Encode to UTF-8 bytes first, then to base64url
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Compute the segment once and memoize
const PROTECTED_SEGMENT = base64url(`${APP_SEGMENT}-${ROUTE_SALT}`);

/**
 * Returns the obfuscated path for the protected editor route.
 * Example: /app/ZWRpdG9yLWMwNGNoLXIwdXQxbmUtczR0LTIwMjQ
 */
export function getProtectedPath() {
  return `/app/${PROTECTED_SEGMENT}`;
}

/**
 * Returns the full route config object for React Router.
 * Import this in App.jsx — never hardcode the path.
 */
export function getRouteConfig() {
  return {
    path: getProtectedPath(),
    segment: PROTECTED_SEGMENT,
  };
}

/**
 * React hook — returns the protected path for use in <Link> or navigate().
 * Usage: const editorPath = useProtectedLink();
 */
export function useProtectedLink() {
  return getProtectedPath();
}
