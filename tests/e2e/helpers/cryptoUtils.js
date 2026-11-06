/**
 * tests/e2e/helpers/cryptoUtils.js
 * Cryptographic test helpers for Mercado Pago HMAC-SHA256 signature generation and verification.
 */

import crypto from 'node:crypto';

/**
 * Generates Mercado Pago x-signature header value conforming to MP specification:
 * Manifest: "id:<dataId>;request-id:<requestId>;ts:<ts>;"
 * HMAC-SHA256 with secret key, output as hex string.
 */
export function generateMPSignature({ dataId, requestId, ts, secret }) {
  if (!secret) throw new Error('Missing webhook secret');
  const timestamp = ts || Math.floor(Date.now() / 1000).toString();
  const manifest = `id:${dataId};request-id:${requestId};ts:${timestamp};`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(manifest);
  const hash = hmac.digest('hex');
  return {
    header: `ts=${timestamp},v1=${hash}`,
    ts: timestamp,
    hash,
    manifest,
  };
}

/**
 * Validates Mercado Pago x-signature header against request elements.
 */
export function verifyMPSignature({ xSignature, xRequestId, dataId, secret }) {
  if (!xSignature || !xRequestId || !dataId || !secret) {
    return { valid: false, reason: 'Missing required validation arguments' };
  }

  // Parse ts and v1 from header
  const parts = xSignature.split(',');
  let ts = null;
  let v1 = null;

  for (const part of parts) {
    const [key, val] = part.trim().split('=');
    if (key === 'ts') ts = val;
    if (key === 'v1') v1 = val;
  }

  if (!ts || !v1) {
    return { valid: false, reason: 'Malformed x-signature header format' };
  }

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(manifest);
  const expectedHash = hmac.digest('hex');

  const valid = crypto.timingSafeEqual(
    Buffer.from(v1, 'hex'),
    Buffer.from(expectedHash, 'hex')
  );

  return {
    valid,
    expectedHash,
    receivedHash: v1,
    manifest,
  };
}
