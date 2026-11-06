declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

export const MP_ACCESS_TOKEN =
  Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN') ||
  Deno.env.get('MP_ACCESS_TOKEN') ||
  '';

export const MP_WEBHOOK_SECRET =
  Deno.env.get('MERCADO_PAGO_WEBHOOK_SECRET') ||
  Deno.env.get('MP_WEBHOOK_SECRET') ||
  '';

export const MP_PLANS = {
  pro_monthly: {
    id: 'pro_monthly',
    title: 'BaseRutina Pro Mensual',
    description: 'Suscripción mensual a BaseRutina para Entrenadores',
    priceARS: 15000,
    durationDays: 30,
  },
  pro_annual: {
    id: 'pro_annual',
    title: 'BaseRutina Pro Anual',
    description: 'Suscripción anual a BaseRutina para Entrenadores',
    priceARS: 120000,
    durationDays: 365,
  },
} as const;

export type PlanKey = keyof typeof MP_PLANS;

/**
 * Comparación en tiempo constante para mitigar ataques de temporización.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Calcula HMAC-SHA256 en formato hexadecimal usando Web Crypto API.
 */
export async function computeHmacSha256(secret: string, manifest: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(manifest);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Valida la firma del webhook de Mercado Pago a partir del encabezado x-signature.
 * Formato x-signature: ts=...,v1=...
 * Plantilla de manifiesto: id:[data.id];request-id:[x-request-id];ts:[ts];
 */
export async function verifyMpWebhookSignature(params: {
  xSignature: string;
  xRequestId: string;
  dataId: string;
  secret: string;
}): Promise<boolean> {
  const { xSignature, xRequestId, dataId, secret } = params;
  if (!secret) {
    // Si no hay secret configurado en el entorno, permitir continuar en desarrollo
    return true;
  }
  if (!xSignature || !xRequestId || !dataId) {
    return false;
  }

  let ts = '';
  let v1 = '';
  for (const part of xSignature.split(',')) {
    const [k, ...vParts] = part.split('=');
    const key = k?.trim();
    const val = vParts.join('=').trim();
    if (key === 'ts') ts = val;
    if (key === 'v1') v1 = val;
  }

  if (!ts || !v1) {
    return false;
  }

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const computedHash = await computeHmacSha256(secret, manifest);
  return timingSafeEqual(computedHash, v1);
}
