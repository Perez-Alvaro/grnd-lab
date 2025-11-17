/**
 * Logger Utility
 *
 * Sistema de logging centralizado para:
 * - Logs en consola (development)
 * - Logs en Supabase (production)
 * - Diferentes niveles: debug, info, warn, error
 * - Contexto adicional (user_id, payment_id, etc.)
 */

import { supabase } from '@/lib/supabase';

const IS_DEVELOPMENT = import.meta.env.MODE === 'development';
const IS_PRODUCTION = import.meta.env.MODE === 'production';

/**
 * Niveles de log
 */
export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

/**
 * Colores para consola
 */
const COLORS = {
  debug: '\x1b[36m', // Cyan
  info: '\x1b[32m', // Green
  warn: '\x1b[33m', // Yellow
  error: '\x1b[31m', // Red
  reset: '\x1b[0m'
};

/**
 * Formatear timestamp
 */
const getTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Log a consola (solo en development)
 */
const logToConsole = (level, message, context = {}) => {
  if (!IS_DEVELOPMENT) return;

  const color = COLORS[level] || COLORS.reset;
  const prefix = `${color}[${level.toUpperCase()}]${COLORS.reset}`;
  const timestamp = getTimestamp();

  console.log(`${prefix} ${timestamp} - ${message}`);

  if (Object.keys(context).length > 0) {
    console.log('  Context:', context);
  }
};

/**
 * Log a Supabase (solo en production)
 */
const logToSupabase = async (level, message, context = {}) => {
  if (!IS_PRODUCTION) return;

  try {
    // Insertar en tabla activity_logs
    await supabase.from('activity_logs').insert({
      action: 'sale_completed', // Reusamos el enum existente
      entity_type: 'system_log',
      details: {
        level,
        message,
        context,
        timestamp: getTimestamp(),
        environment: 'production'
      }
    });
  } catch (error) {
    // Si falla el log a Supabase, al menos loguearlo en consola
    console.error('Failed to log to Supabase:', error);
  }
};

/**
 * Log genérico
 */
const log = (level, message, context = {}) => {
  logToConsole(level, message, context);
  logToSupabase(level, message, context);
};

/**
 * Debug log (solo en development)
 */
export const debug = (message, context = {}) => {
  if (IS_DEVELOPMENT) {
    log(LOG_LEVELS.DEBUG, message, context);
  }
};

/**
 * Info log
 */
export const info = (message, context = {}) => {
  log(LOG_LEVELS.INFO, message, context);
};

/**
 * Warning log
 */
export const warn = (message, context = {}) => {
  log(LOG_LEVELS.WARN, message, context);
};

/**
 * Error log
 */
export const error = (message, errorObj, context = {}) => {
  const errorContext = {
    ...context,
    error: {
      message: errorObj?.message,
      stack: errorObj?.stack,
      code: errorObj?.code,
      name: errorObj?.name
    }
  };

  log(LOG_LEVELS.ERROR, message, errorContext);
};

/**
 * Log específico para webhooks
 */
export const webhook = (paymentId, event, data = {}) => {
  info(`Webhook received: ${event}`, {
    paymentId,
    event,
    ...data
  });
};

/**
 * Log específico para pagos
 */
export const payment = (paymentId, status, data = {}) => {
  info(`Payment ${status}`, {
    paymentId,
    status,
    ...data
  });
};

/**
 * Log específico para errores de pago
 */
export const paymentError = (paymentId, errorMessage, data = {}) => {
  error(`Payment error: ${errorMessage}`, new Error(errorMessage), {
    paymentId,
    ...data
  });
};

/**
 * Log para inicio de operación
 */
export const operationStart = (operation, context = {}) => {
  debug(`Operation started: ${operation}`, context);
};

/**
 * Log para fin de operación
 */
export const operationEnd = (operation, duration, context = {}) => {
  debug(`Operation completed: ${operation} (${duration}ms)`, context);
};

/**
 * Timer para medir duración de operaciones
 */
export const createTimer = (operation) => {
  const startTime = Date.now();

  return {
    end: (context = {}) => {
      const duration = Date.now() - startTime;
      operationEnd(operation, duration, context);
      return duration;
    }
  };
};

/**
 * Log para auditoría de ventas
 */
export const saleCompleted = async (saleId, userId, amount, context = {}) => {
  try {
    await supabase.from('activity_logs').insert({
      user_id: userId,
      action: 'sale_completed',
      entity_type: 'sale',
      entity_id: saleId,
      details: {
        amount,
        ...context,
        timestamp: getTimestamp()
      }
    });

    info('Sale completed', {
      saleId,
      userId,
      amount,
      ...context
    });
  } catch (err) {
    error('Failed to log sale completion', err, { saleId, userId });
  }
};

/**
 * Log para descarga de archivos
 */
export const fileDownloaded = async (fileId, userId, context = {}) => {
  try {
    await supabase.from('activity_logs').insert({
      user_id: userId,
      action: 'download',
      entity_type: 'file',
      entity_id: fileId,
      details: {
        ...context,
        timestamp: getTimestamp()
      }
    });

    info('File downloaded', {
      fileId,
      userId,
      ...context
    });
  } catch (err) {
    error('Failed to log file download', err, { fileId, userId });
  }
};

/**
 * Formatear error para logging
 */
export const formatError = (err) => {
  return {
    message: err?.message || 'Unknown error',
    stack: err?.stack,
    code: err?.code,
    name: err?.name,
    cause: err?.cause
  };
};

export const logger = {
  debug,
  info,
  warn,
  error,
  webhook,
  payment,
  paymentError,
  operationStart,
  operationEnd,
  createTimer,
  saleCompleted,
  fileDownloaded,
  formatError
};

export default logger;
