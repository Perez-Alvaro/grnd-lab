/**
 * src/lib/session.js
 * Session lifecycle management — restore, watch, and expire sessions.
 */

import { validateToken, logout, getCurrentUser } from './auth.js';

const TOKEN_KEY = 'auth_token';

/**
 * Call on app mount to restore a previously stored session.
 * Performs full async token validation (HMAC + expiry).
 * Returns the user payload if valid, null otherwise.
 */
export async function initializeSession() {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  const result = await validateToken(token);

  if (!result.valid) {
    // Token invalid or expired — clean up silently
    sessionStorage.removeItem(TOKEN_KEY);
    return null;
  }

  return result.payload;
}

/**
 * Start a background watcher that checks token expiry every 60 seconds.
 * Calls onExpiry() when the token becomes invalid while the tab is open.
 * Returns the interval ID so the caller can clear it on unmount.
 */
export function startSessionWatcher(onExpiry) {
  return setInterval(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);

    // No token — nothing to watch
    if (!token) return;

    // Quick sync expiry check (no crypto)
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        sessionStorage.removeItem(TOKEN_KEY);
        onExpiry();
        return;
      }

      const pad = parts[1].length % 4;
      const padded = pad ? parts[1] + '='.repeat(4 - pad) : parts[1];
      const payload = JSON.parse(
        decodeURIComponent(
          escape(atob(padded.replace(/-/g, '+').replace(/_/g, '/')))
        )
      );

      if (payload.exp <= Math.floor(Date.now() / 1000)) {
        logout();
        onExpiry();
      }
    } catch {
      logout();
      onExpiry();
    }
  }, 60_000);
}
