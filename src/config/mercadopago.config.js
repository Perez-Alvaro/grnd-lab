/**
 * Configuración de Mercado Pago
 *
 * Este archivo centraliza toda la configuración relacionada con Mercado Pago
 */

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const MP_CONFIG = {
  // Public Key para el frontend (visible al cliente)
  publicKey: import.meta.env.VITE_MP_PUBLIC_KEY,

  // URLs de notificación (webhook)
  notification_url: `${SUPABASE_URL}/functions/v1/mercadopago-webhook`,

  // URLs de retorno después del pago
  back_urls: {
    success: `${FRONTEND_URL}/payment/success`,
    failure: `${FRONTEND_URL}/payment/failure`,
    pending: `${FRONTEND_URL}/payment/pending`
  },

  // Auto return: redirige automáticamente cuando el pago es aprobado
  auto_return: 'approved',

  // Configuración de la preferencia de pago
  preferenceDefaults: {
    // Métodos de pago excluidos (opcional)
    payment_methods: {
      excluded_payment_types: [],
      excluded_payment_methods: [],
      installments: 12 // Máximo de cuotas
    },

    // Información adicional
    statement_descriptor: 'FITTER ROUTINES', // Aparece en el resumen de tarjeta

    // Expiración de la preferencia (7 días)
    expiration_date_from: null,
    expiration_date_to: null,
  },

  // Configuración para retry de llamadas a la API
  retry: {
    maxAttempts: 3,
    delayMs: 1000, // delay inicial
    backoffMultiplier: 2 // multiplicador exponencial
  },

  // Timeout para llamadas a la API (10 segundos)
  timeout: 10000,
};

/**
 * Mensajes de error amigables para el usuario
 */
export const MP_ERROR_MESSAGES = {
  // Errores de tarjeta
  cc_rejected_bad_filled_card_number: 'El número de tarjeta es inválido',
  cc_rejected_bad_filled_date: 'La fecha de vencimiento es inválida',
  cc_rejected_bad_filled_security_code: 'El código de seguridad es inválido',
  cc_rejected_bad_filled_other: 'Revisa los datos de tu tarjeta',

  // Errores de fondos
  cc_rejected_insufficient_amount: 'Tu tarjeta no tiene fondos suficientes',
  cc_rejected_high_risk: 'Tu pago fue rechazado. Contacta a tu banco',

  // Errores de autorización
  cc_rejected_call_for_authorize: 'Debes autorizar el pago con tu banco',
  cc_rejected_card_disabled: 'Tu tarjeta está deshabilitada. Contacta a tu banco',
  cc_rejected_duplicated_payment: 'Ya realizaste un pago similar recientemente',

  // Errores genéricos
  cc_rejected_other_reason: 'Tu tarjeta no procesó el pago',
  invalid_card: 'Los datos de tu tarjeta son inválidos',

  // Errores del sistema
  internal_server_error: 'Error del servidor. Intenta nuevamente',
  network_error: 'Error de conexión. Verifica tu internet',
  timeout: 'La operación tardó demasiado. Intenta nuevamente',

  // Default
  default: 'Ocurrió un error procesando tu pago. Intenta nuevamente'
};

/**
 * Obtener mensaje de error amigable
 */
export const getErrorMessage = (errorCode) => {
  return MP_ERROR_MESSAGES[errorCode] || MP_ERROR_MESSAGES.default;
};

/**
 * Estados de pago de Mercado Pago
 */
export const PAYMENT_STATUS = {
  APPROVED: 'approved',
  PENDING: 'pending',
  IN_PROCESS: 'in_process',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  CHARGED_BACK: 'charged_back'
};

/**
 * Tipos de pago
 */
export const PAYMENT_TYPE = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  TICKET: 'ticket', // Boleto, Rapipago, etc.
  BANK_TRANSFER: 'bank_transfer'
};

export default MP_CONFIG;
