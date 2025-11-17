/**
 * Validation Utilities
 *
 * Funciones de validación para:
 * - Emails
 * - Datos de pago
 * - Sanitización de inputs
 * - Validación de formularios
 */

/**
 * Validar formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} - True si es válido
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;

  // Regex robusta para validar emails
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(email.trim());
};

/**
 * Validar que un email sea de un dominio específico
 * @param {string} email - Email a validar
 * @param {string[]} allowedDomains - Dominios permitidos
 * @returns {boolean}
 */
export const validateEmailDomain = (email, allowedDomains = []) => {
  if (!validateEmail(email)) return false;
  if (allowedDomains.length === 0) return true;

  const domain = email.split('@')[1]?.toLowerCase();
  return allowedDomains.some(allowed => domain === allowed.toLowerCase());
};

/**
 * Validar datos de pago de Mercado Pago
 * @param {Object} paymentData - Datos del pago desde MP
 * @returns {{valid: boolean, errors: string[]}}
 */
export const validatePaymentData = (paymentData) => {
  const errors = [];

  if (!paymentData) {
    errors.push('Datos de pago vacíos');
    return { valid: false, errors };
  }

  // Validar campos requeridos
  if (!paymentData.id) {
    errors.push('ID de pago faltante');
  }

  if (!paymentData.status) {
    errors.push('Estado de pago faltante');
  }

  if (!paymentData.payer?.email) {
    errors.push('Email del pagador faltante');
  } else if (!validateEmail(paymentData.payer.email)) {
    errors.push('Email del pagador inválido');
  }

  if (paymentData.transaction_amount === undefined || paymentData.transaction_amount === null) {
    errors.push('Monto de transacción faltante');
  } else if (paymentData.transaction_amount <= 0) {
    errors.push('Monto de transacción inválido');
  }

  // Validar estados conocidos
  const validStatuses = ['approved', 'pending', 'in_process', 'rejected', 'cancelled', 'refunded', 'charged_back'];
  if (paymentData.status && !validStatuses.includes(paymentData.status)) {
    errors.push(`Estado de pago desconocido: ${paymentData.status}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Sanitizar input de usuario (prevenir XSS)
 * @param {string} input - Input del usuario
 * @returns {string} - Input sanitizado
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';

  return input
    .trim()
    .replace(/[<>]/g, '') // Eliminar tags HTML básicos
    .replace(/['"]/g, '') // Eliminar comillas
    .slice(0, 500); // Limitar longitud
};

/**
 * Sanitizar nombre (solo letras, espacios, guiones)
 * @param {string} name - Nombre a sanitizar
 * @returns {string} - Nombre sanitizado
 */
export const sanitizeName = (name) => {
  if (!name || typeof name !== 'string') return '';

  return name
    .trim()
    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]/g, '') // Solo letras, espacios y guiones
    .replace(/\s+/g, ' ') // Normalizar espacios múltiples
    .slice(0, 100); // Limitar longitud
};

/**
 * Validar que un string no esté vacío
 * @param {string} value - Valor a validar
 * @param {string} fieldName - Nombre del campo (para error)
 * @returns {{valid: boolean, error: string|null}}
 */
export const validateRequired = (value, fieldName = 'Campo') => {
  const trimmed = String(value || '').trim();

  if (!trimmed) {
    return {
      valid: false,
      error: `${fieldName} es requerido`
    };
  }

  return { valid: true, error: null };
};

/**
 * Validar longitud mínima
 * @param {string} value - Valor a validar
 * @param {number} minLength - Longitud mínima
 * @param {string} fieldName - Nombre del campo
 * @returns {{valid: boolean, error: string|null}}
 */
export const validateMinLength = (value, minLength, fieldName = 'Campo') => {
  const str = String(value || '');

  if (str.length < minLength) {
    return {
      valid: false,
      error: `${fieldName} debe tener al menos ${minLength} caracteres`
    };
  }

  return { valid: true, error: null };
};

/**
 * Validar longitud máxima
 * @param {string} value - Valor a validar
 * @param {number} maxLength - Longitud máxima
 * @param {string} fieldName - Nombre del campo
 * @returns {{valid: boolean, error: string|null}}
 */
export const validateMaxLength = (value, maxLength, fieldName = 'Campo') => {
  const str = String(value || '');

  if (str.length > maxLength) {
    return {
      valid: false,
      error: `${fieldName} no puede tener más de ${maxLength} caracteres`
    };
  }

  return { valid: true, error: null };
};

/**
 * Validar formulario de checkout
 * @param {Object} formData - Datos del formulario
 * @returns {{valid: boolean, errors: Object}}
 */
export const validateCheckoutForm = (formData) => {
  const errors = {};

  // Email
  if (!formData.email) {
    errors.email = 'Email es requerido';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Email inválido';
  }

  // Nombre
  if (!formData.firstName) {
    errors.firstName = 'Nombre es requerido';
  } else if (formData.firstName.trim().length < 2) {
    errors.firstName = 'Nombre debe tener al menos 2 caracteres';
  }

  // Apellido
  if (!formData.lastName) {
    errors.lastName = 'Apellido es requerido';
  } else if (formData.lastName.trim().length < 2) {
    errors.lastName = 'Apellido debe tener al menos 2 caracteres';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validar UUID
 * @param {string} uuid - UUID a validar
 * @returns {boolean}
 */
export const validateUUID = (uuid) => {
  if (!uuid || typeof uuid !== 'string') return false;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Validar monto (precio)
 * @param {number|string} amount - Monto a validar
 * @param {number} min - Monto mínimo (default: 0)
 * @param {number} max - Monto máximo (default: 1000000)
 * @returns {{valid: boolean, error: string|null}}
 */
export const validateAmount = (amount, min = 0, max = 1000000) => {
  const num = parseFloat(amount);

  if (isNaN(num)) {
    return { valid: false, error: 'Monto inválido' };
  }

  if (num < min) {
    return { valid: false, error: `Monto debe ser mayor o igual a ${min}` };
  }

  if (num > max) {
    return { valid: false, error: `Monto debe ser menor o igual a ${max}` };
  }

  return { valid: true, error: null };
};

/**
 * Validar URL
 * @param {string} url - URL a validar
 * @returns {boolean}
 */
export const validateURL = (url) => {
  if (!url || typeof url !== 'string') return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Escapar HTML (prevenir XSS)
 * @param {string} str - String a escapar
 * @returns {string}
 */
export const escapeHTML = (str) => {
  if (!str || typeof str !== 'string') return '';

  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return str.replace(/[&<>"']/g, m => map[m]);
};

export default {
  validateEmail,
  validateEmailDomain,
  validatePaymentData,
  sanitizeInput,
  sanitizeName,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateCheckoutForm,
  validateUUID,
  validateAmount,
  validateURL,
  escapeHTML
};
