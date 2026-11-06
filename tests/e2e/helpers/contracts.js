/**
 * tests/e2e/helpers/contracts.js
 * Business logic contracts, schema validators, and simulation models
 * derived strictly from PROJECT.md, ORIGINAL_REQUEST.md, and docs/CAMPOS_VALIDACION.md.
 */

import { verifyMPSignature } from './cryptoUtils.js';

/**
 * Contract: White-Label Coach Brand Name Resolution
 * Precedence: plan.metadata.brandName -> plan.metadata.author -> user.name -> "Mock"
 */
export function resolveBrandName({ brandName, author, userName } = {}) {
  if (typeof brandName === 'string' && brandName.trim().length > 0) {
    return brandName.trim();
  }
  if (typeof author === 'string' && author.trim().length > 0) {
    return author.trim();
  }
  if (typeof userName === 'string' && userName.trim().length > 0) {
    return userName.trim();
  }
  return 'Mock';
}

/**
 * Contract: Workout Routine Schema Validation conforming to docs/CAMPOS_VALIDACION.md
 */
export function validateWorkoutRoutine(plan) {
  const errors = [];

  if (!plan || typeof plan !== 'object') {
    return { valid: false, errors: ['Plan must be a valid non-null object'] };
  }

  // Metadata checks
  if (!plan.metadata || typeof plan.metadata !== 'object') {
    errors.push('Plan must contain a metadata object');
  } else {
    if (!plan.metadata.title || typeof plan.metadata.title !== 'string') {
      errors.push('metadata.title is required and must be a string');
    }
  }

  // Weeks checks
  if (!Array.isArray(plan.weeks) || plan.weeks.length === 0) {
    errors.push('Plan must contain a non-empty weeks array');
  } else {
    plan.weeks.forEach((week, wIdx) => {
      if (!Array.isArray(week.days) || week.days.length === 0) {
        errors.push(`Week ${wIdx + 1} must contain a non-empty days array`);
        return;
      }

      week.days.forEach((day, dIdx) => {
        if (!day.name || typeof day.name !== 'string') {
          errors.push(`Week ${wIdx + 1}, Day ${dIdx + 1} must have a name`);
        }

        const exercises = Array.isArray(day.exercises) ? day.exercises : [];
        if (exercises.length === 0) {
          errors.push(`Week ${wIdx + 1}, Day ${dIdx + 1} must contain at least one exercise`);
        }

        exercises.forEach((ex, eIdx) => {
          const loc = `Week ${wIdx + 1}, Day ${dIdx + 1}, Exercise ${eIdx + 1}`;

          if (!ex.name || typeof ex.name !== 'string') {
            errors.push(`${loc}: name is required and must be a string`);
          }

          // Forbidden fields check according to CAMPOS_VALIDACION.md
          if ('cadencia' in ex) {
            errors.push(`${loc}: forbidden key 'cadencia' found (must use 'tempo')`);
          }
          if ('duration' in ex || 'duracion' in ex) {
            errors.push(`${loc}: forbidden key 'duration' / 'duracion' found`);
          }

          // Required fields
          if (ex.sets === undefined || ex.sets === null || Number(ex.sets) <= 0) {
            errors.push(`${loc}: sets must be a positive number`);
          }
          if (ex.reps === undefined || ex.reps === null || Number(ex.reps) <= 0) {
            errors.push(`${loc}: reps must be a positive number`);
          }
          if (ex.rest === undefined || ex.rest === null || Number(ex.rest) < 0) {
            errors.push(`${loc}: rest must be a non-negative number`);
          }
          if (ex.tempo === undefined || ex.tempo === null || typeof ex.tempo !== 'string') {
            errors.push(`${loc}: tempo must be a string`);
          }
        });
      });
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Contract: Transparent Pricing Savings Calculation
 */
export function calculatePricingSavings(monthlyPrice = 15000, annualPrice = 120000) {
  const fullAnnualCost = monthlyPrice * 12;
  const savingsARS = fullAnnualCost - annualPrice;
  const discountPercent = Math.round((savingsARS / fullAnnualCost) * 100);
  const monthlyEquivalent = Math.round(annualPrice / 12);
  const freeMonthsEquivalent = Math.round(savingsARS / monthlyPrice);

  return {
    monthlyPrice,
    annualPrice,
    fullAnnualCost,
    savingsARS,
    discountPercent,
    monthlyEquivalent,
    freeMonthsEquivalent,
  };
}

/**
 * Contract: Mercado Pago Preference Builder
 */
export function buildMercadoPagoPreference({ plan, userId, userEmail, appUrl = 'https://baserutina.com' }) {
  const PRICING = {
    pro_monthly: { price: 15000, title: 'Mock Pro Mensual', days: 30 },
    pro_annual: { price: 120000, title: 'Mock Pro Anual', days: 365 },
  };

  const planConfig = PRICING[plan];
  if (!planConfig) {
    throw new Error(`Invalid plan ID: ${plan}. Allowed: pro_monthly, pro_annual`);
  }
  if (!userId) {
    throw new Error('User ID is required for Mercado Pago checkout preference');
  }

  return {
    items: [
      {
        id: plan,
        title: planConfig.title,
        description: 'Suscripción a Mock para Entrenadores y Coaches',
        quantity: 1,
        currency_id: 'ARS',
        unit_price: planConfig.price,
      },
    ],
    payer: {
      email: userEmail || 'coach@ejemplo.com',
    },
    external_reference: `${userId}:${plan}`,
    notification_url: `${appUrl}/functions/v1/mercado-pago-webhook`,
    back_urls: {
      success: `${appUrl}/dashboard?payment=success&plan=${plan}`,
      pending: `${appUrl}/dashboard?payment=pending`,
      failure: `${appUrl}/dashboard?payment=failure`,
    },
    auto_return: 'approved',
  };
}

/**
 * Contract: Webhook Processing Simulator
 * Simulates complete Mercado Pago Webhook handling pipeline:
 * 1. Signature validation
 * 2. Idempotency check
 * 3. Status lookup
 * 4. Subscription period activation
 */
export function simulateWebhookProcessing({
  headers = {},
  dataId,
  paymentStatus = 'approved',
  externalReference,
  processedEvents = new Set(),
  currentSubscription = null,
  secret = 'test-mp-secret-key-12345',
}) {
  const xSignature = headers['x-signature'];
  const xRequestId = headers['x-request-id'];

  // 1. Signature check
  const sigCheck = verifyMPSignature({
    xSignature,
    xRequestId,
    dataId,
    secret,
  });

  if (!sigCheck.valid) {
    return {
      status: 401,
      body: { error: 'Invalid HMAC signature', reason: sigCheck.reason },
      updated: false,
    };
  }

  // 2. Idempotency check
  if (processedEvents.has(dataId)) {
    return {
      status: 200,
      body: { status: 'already_processed', eventId: dataId },
      updated: false,
      replayed: true,
    };
  }

  // 3. Status check
  if (paymentStatus !== 'approved') {
    processedEvents.add(dataId);
    return {
      status: 200,
      body: { status: 'ignored_unapproved_payment', paymentStatus },
      updated: false,
    };
  }

  // 4. Parse user and plan
  const [userId, plan] = (externalReference || '').split(':');
  if (!userId || !['pro_monthly', 'pro_annual'].includes(plan)) {
    return {
      status: 400,
      body: { error: 'Invalid external_reference format' },
      updated: false,
    };
  }

  const durationDays = plan === 'pro_annual' ? 365 : 30;
  const now = new Date();
  const currentEnd = currentSubscription?.currentPeriodEnd
    ? new Date(Math.max(now.getTime(), new Date(currentSubscription.currentPeriodEnd).getTime()))
    : now;

  const newPeriodEnd = new Date(currentEnd.getTime() + durationDays * 24 * 60 * 60 * 1000);

  // Mark event as processed
  processedEvents.add(dataId);

  return {
    status: 200,
    body: { received: true, activated: true },
    updated: true,
    subscription: {
      userId,
      plan,
      status: 'active',
      paymentMethod: 'mercado_pago',
      currentPeriodEnd: newPeriodEnd.toISOString(),
      daysAdded: durationDays,
    },
  };
}

/**
 * Contract: Freemium Quota Policy Check
 * Allows creating a routine if user has active subscription OR admin OR existing routine count < 3.
 */
export function checkFreemiumRoutineCreationQuota({ userRoutinesCount, hasActiveSub, isAdmin }) {
  if (isAdmin) return { allowed: true, reason: 'admin_bypass' };
  if (hasActiveSub) return { allowed: true, reason: 'active_subscription' };
  if (userRoutinesCount < 3) return { allowed: true, reason: 'freemium_quota_available', remaining: 3 - userRoutinesCount };
  return { allowed: false, reason: 'freemium_quota_exceeded', limit: 3 };
}
