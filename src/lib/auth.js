/**
 * src/lib/auth.js
 * Core authentication utilities — mock production-level patterns
 *
 * Passwords: bcryptjs (pure JS, browser-safe, 10 salt rounds)
 * Tokens:    JWT-like structure signed with HMAC-SHA256 via Web Crypto API
 * Storage:   sessionStorage only (cleared when tab closes)
 */

import bcrypt from 'bcryptjs';

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */

// In a real app this comes from an environment variable, never hardcoded.
const SECRET = 'MOCK_SECRET_DO_NOT_USE_IN_PROD_REPLACE_WITH_ENV_VAR';
const TOKEN_KEY = 'auth_token';
const TOKEN_TTL = 15 * 60; // 15 minutes in seconds

/* ─────────────────────────────────────────────
   USER STORE (lazy-loaded, cached in module scope)
───────────────────────────────────────────── */

let usersCache = null;

/**
 * Dynamically imports users.db.json so it ends up in a separate Vite chunk.
 * In DEV mode, auto-hashes __devPassword entries so the app works immediately.
 */
async function loadUsers() {
  if (usersCache) return usersCache;

  const db = (await import('../data/users.db.json')).default;

  if (import.meta.env.DEV) {
    // Hash __devPassword fields on first load — never stored, only in memory
    usersCache = await Promise.all(
      db.users.map(async (user) => {
        if (user.__devPassword) {
          const hash = await bcrypt.hash(user.__devPassword, 10);
          // Destructure out the plain-text field — never let it escape
          // eslint-disable-next-line no-unused-vars
          const { __devPassword, passwordHash: _placeholder, ...safeUser } = user;
          return { ...safeUser, passwordHash: hash };
        }
        return user;
      })
    );
  } else {
    // In production, skip users that still have placeholder hashes
    usersCache = db.users.filter(
      (u) => u.passwordHash && !u.passwordHash.startsWith('REPLACE')
    );
  }

  return usersCache;
}

/* ─────────────────────────────────────────────
   BASE64URL HELPERS
───────────────────────────────────────────── */

function toBase64url(str) {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function uint8ToBase64url(bytes) {
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function fromBase64url(str) {
  const pad = str.length % 4;
  const padded = pad ? str + '='.repeat(4 - pad) : str;
  return decodeURIComponent(
    escape(atob(padded.replace(/-/g, '+').replace(/_/g, '/')))
  );
}

function fromBase64urlBytes(str) {
  const pad = str.length % 4;
  const padded = pad ? str + '='.repeat(4 - pad) : str;
  return Uint8Array.from(
    atob(padded.replace(/-/g, '+').replace(/_/g, '/')),
    (c) => c.charCodeAt(0)
  );
}

/* ─────────────────────────────────────────────
   WEB CRYPTO — HMAC-SHA256
───────────────────────────────────────────── */

async function importHmacKey(usage) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    [usage]
  );
}

async function signHmac(data) {
  const key = await importHmacKey('sign');
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return uint8ToBase64url(new Uint8Array(sig));
}

async function verifyHmac(data, signatureBase64url) {
  const key = await importHmacKey('verify');
  const sigBytes = fromBase64urlBytes(signatureBase64url);
  return crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(data));
}

/* ─────────────────────────────────────────────
   PASSWORD UTILITIES
───────────────────────────────────────────── */

/**
 * Hash a plain-text password.
 * Use this to generate entries for users.db.json via createUser.js
 */
export async function hashPassword(plainText) {
  return bcrypt.hash(plainText, 10);
}

/**
 * Verify a plain-text password against a stored bcrypt hash.
 */
export async function verifyPassword(plainText, hash) {
  return bcrypt.compare(plainText, hash);
}

/* ─────────────────────────────────────────────
   USER LOOKUP
───────────────────────────────────────────── */

/**
 * Find a user by email (case-insensitive).
 * Returns the user object or null.
 */
export async function findUserByEmail(email) {
  const users = await loadUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

/* ─────────────────────────────────────────────
   TOKEN LIFECYCLE
───────────────────────────────────────────── */

/**
 * Generate a signed session token and store it in sessionStorage.
 * Structure: base64url(header).base64url(payload).base64url(signature)
 */
export async function generateToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const header = toBase64url(JSON.stringify({ alg: 'HS256', typ: 'MOCK' }));
  const payload = toBase64url(
    JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      iat: now,
      exp: now + TOKEN_TTL,
    })
  );

  const toSign = `${header}.${payload}`;
  const signature = await signHmac(toSign);
  const token = `${toSign}.${signature}`;

  sessionStorage.setItem(TOKEN_KEY, token);
  return token;
}

/**
 * Fully validate a token: structure, expiry AND HMAC signature.
 * Returns { valid: true, payload } or { valid: false, expired?: true }
 */
export async function validateToken(token) {
  if (!token) return { valid: false };

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false };

    const [headerB64, payloadB64, sigB64] = parts;

    // Decode and parse payload
    const payload = JSON.parse(fromBase64url(payloadB64));

    // Check expiry first (cheap operation)
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false, expired: true };
    }

    // Verify HMAC signature
    const signatureValid = await verifyHmac(`${headerB64}.${payloadB64}`, sigB64);
    if (!signatureValid) return { valid: false };

    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

/**
 * Quick synchronous check — verifies structure and expiry only, no crypto.
 * Use for UI guards; use validateToken() for security-critical paths.
 */
export function isAuthenticated() {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(fromBase64url(parts[1]));
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

/**
 * Get the current user from the stored token payload (no crypto check).
 * Returns the payload object or null.
 */
export function getCurrentUser() {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(fromBase64url(parts[1]));
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────────
   LOGIN / LOGOUT
───────────────────────────────────────────── */

/**
 * Attempt login with email + password.
 * Returns { success: true, user, token } or { success: false, error: string }
 * All error messages are in Spanish.
 */
export async function attemptLogin(email, password) {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return { success: false, error: 'Email no encontrado' };
    }

    if (!user.active) {
      return { success: false, error: 'Tu cuenta está desactivada' };
    }

    const passwordMatch = await verifyPassword(password, user.passwordHash);
    if (!passwordMatch) {
      return { success: false, error: 'Contraseña incorrecta' };
    }

    // Generate token — also stores it in sessionStorage
    const token = await generateToken(user);

    // Return safe user object (no hash)
    const { passwordHash: _hash, ...safeUser } = user;
    return { success: true, user: safeUser, token };
  } catch {
    return { success: false, error: 'Ocurrió un error inesperado' };
  }
}

/**
 * Destroy the current session completely.
 */
export function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
}
