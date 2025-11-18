/**
 * Mercado Pago Service
 *
 * Servicio para interactuar con la API de Mercado Pago:
 * - Crear preferencias de pago
 * - Consultar estado de pagos
 * - Validar webhooks
 *
 * IMPORTANTE: Este servicio solo se ejecuta en el FRONTEND.
 * El Access Token se usa solo en el backend (Edge Functions).
 */

import { MP_CONFIG, PAYMENT_STATUS, getErrorMessage } from '@/config/mercadopago.config';
import { bundleService } from './bundleService';

/**
 * Esperar un tiempo (para retry con backoff)
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry logic con exponential backoff
 */
const retry = async (fn, options = {}) => {
  const maxAttempts = options.maxAttempts || MP_CONFIG.retry.maxAttempts;
  const delayMs = options.delayMs || MP_CONFIG.retry.delayMs;
  const backoffMultiplier = options.backoffMultiplier || MP_CONFIG.retry.backoffMultiplier;

  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt}/${maxAttempts} failed:`, error.message);

      if (attempt < maxAttempts) {
        const waitTime = delayMs * Math.pow(backoffMultiplier, attempt - 1);
        console.log(`Retrying in ${waitTime}ms...`);
        await delay(waitTime);
      }
    }
  }

  throw lastError;
};

/**
 * Crear preferencia de pago en Mercado Pago
 *
 * @param {Object} product - Producto a comprar (rutina o bundle)
 * @param {Object} userData - Datos del usuario
 * @param {string} userData.email - Email del comprador
 * @param {string} userData.firstName - Nombre
 * @param {string} userData.lastName - Apellido
 * @returns {Promise<Object>} - { preferenceId, initPoint }
 */
export const createPreference = async (product, userData) => {
  try {
    console.log('Creating preference for product:', product.id);

    // Validar datos
    if (!product || !product.id) {
      throw new Error('Producto inválido');
    }

    if (!userData || !userData.email) {
      throw new Error('Email del usuario requerido');
    }

    // Detectar tipo de producto y obtener items
    let items = [];
    let isBundle = false;
    let isDynamic = false;

    // Caso 1: Bundle dinámico (creado on-the-fly, ej: rutina + libro)
    if (product.isDynamic && product.products) {
      console.log('Product is a dynamic bundle (created on-the-fly)');
      isDynamic = true;
      isBundle = true;

      items = product.products.map(p => ({
        id: p.id,
        title: p.name,
        description: p.description || `${p.type === 'routine' ? 'Rutina' : 'Libro'} digital`,
        category_id: p.type === 'routine' ? 'sports' : 'books',
        quantity: 1,
        unit_price: parseFloat(p.price),
        currency_id: 'ARS'
      }));

      console.log(`Dynamic bundle contains ${items.length} items`);
    }
    // Caso 2: Bundle persistente (guardado en DB)
    else if (await bundleService.isBundleProduct(product.id)) {
      console.log('Product is a persistent bundle, getting included products...');
      isBundle = true;
      const bundleInfo = await bundleService.getBundleInfo(product.id);

      // Validar bundle
      const validation = await bundleService.validateBundle(product.id);
      if (!validation.valid) {
        throw new Error(`Bundle inválido: ${validation.errors.join(', ')}`);
      }

      // Crear items del bundle
      items = bundleInfo.products.map(p => ({
        id: p.id,
        title: p.name,
        description: p.description || `${p.type === 'routine' ? 'Rutina' : 'Libro'} digital`,
        category_id: p.type === 'routine' ? 'sports' : 'books',
        quantity: 1,
        unit_price: parseFloat(p.price),
        currency_id: 'ARS'
      }));

      console.log(`Persistent bundle contains ${items.length} items`);
    }
    // Caso 3: Producto individual
    else {
      items = [{
        id: product.id,
        title: product.name || product.title,
        description: product.description || 'Rutina de entrenamiento digital',
        category_id: 'sports',
        quantity: 1,
        unit_price: parseFloat(product.price),
        currency_id: 'ARS'
      }];
    }

    // Construir preferencia
    const preference = {
      items,
      payer: {
        name: userData.firstName,
        surname: userData.lastName,
        email: userData.email
      },
      back_urls: MP_CONFIG.back_urls,
      auto_return: MP_CONFIG.auto_return,
      notification_url: MP_CONFIG.notification_url,
      statement_descriptor: MP_CONFIG.preferenceDefaults.statement_descriptor,
      payment_methods: MP_CONFIG.preferenceDefaults.payment_methods,
      metadata: {
        product_id: product.id,
        product_type: isBundle ? 'bundle' : product.type || 'routine',
        user_email: userData.email,
        is_bundle: isBundle,
        is_dynamic: isDynamic,
        // Si es bundle dinámico, incluir IDs de los productos
        ...(isDynamic && product.metadata ? product.metadata : {})
      }
    };

    console.log('Preference data:', {
      items: items.length,
      total: items.reduce((sum, item) => sum + item.unit_price, 0),
      payer: userData.email
    });

    // Llamar a la API de Mercado Pago con retry
    const result = await retry(async () => {
      // Aquí se llamaría a la API de MP, pero como el SDK necesita
      // el Access Token que es secreto, debemos crear una Edge Function
      // que reciba estos datos y cree la preferencia server-side

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-mp-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(preference)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP ${response.status}`);
      }

      return await response.json();
    });

    console.log('Preference created successfully:', result.preferenceId);

    return {
      preferenceId: result.preferenceId,
      initPoint: result.initPoint,
      isBundle
    };

  } catch (error) {
    console.error('Error creating preference:', error);
    throw new Error(getErrorMessage(error.code) || 'Error al crear la preferencia de pago');
  }
};

/**
 * Obtener información de un pago (solo para frontend, información pública)
 *
 * NOTA: La consulta completa del pago se hace server-side en el webhook
 * Esta función es solo para verificaciones básicas en el frontend
 *
 * @param {string} paymentId - ID del pago de Mercado Pago
 * @returns {Promise<Object>} - Información del pago
 */
export const getPaymentInfo = async (paymentId) => {
  try {
    if (!paymentId) {
      throw new Error('Payment ID requerido');
    }

    // Consultar el pago desde nuestro backend (Edge Function)
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-mp-payment/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      status: data.status,
      statusDetail: data.status_detail,
      paymentType: data.payment_type_id,
      amount: data.transaction_amount,
      dateApproved: data.date_approved,
      dateCreated: data.date_created
    };

  } catch (error) {
    console.error('Error getting payment info:', error);
    throw error;
  }
};

/**
 * Verificar el estado de un pago desde la base de datos
 * (Alternativa más rápida que consultar a MP)
 *
 * @param {string} paymentId - ID del pago de Mercado Pago
 * @returns {Promise<Object>} - Estado del pago desde nuestra DB
 */
export const getPaymentStatusFromDB = async (paymentId) => {
  try {
    const { supabase } = await import('@/lib/supabase');

    const { data, error } = await supabase
      .from('sales')
      .select('id, status, payment_id, total_amount, created_at, completed_at')
      .eq('payment_id', paymentId)
      .single();

    if (error) throw error;

    return {
      found: !!data,
      status: data?.status,
      saleId: data?.id,
      amount: data?.total_amount,
      completedAt: data?.completed_at
    };

  } catch (error) {
    console.error('Error getting payment from DB:', error);
    return { found: false, error: error.message };
  }
};

/**
 * Formatear error de Mercado Pago para mostrar al usuario
 */
export const formatMPError = (error) => {
  if (error.cause && Array.isArray(error.cause)) {
    // Error de validación de MP
    const messages = error.cause.map(e => e.description || e.message);
    return messages.join('. ');
  }

  if (error.message) {
    return error.message;
  }

  return 'Error desconocido al procesar el pago';
};

/**
 * Validar configuración de Mercado Pago
 */
export const validateMPConfig = () => {
  const errors = [];

  if (!MP_CONFIG.publicKey || MP_CONFIG.publicKey.includes('tu-public-key')) {
    errors.push('Public Key de Mercado Pago no configurada');
  }

  if (!MP_CONFIG.back_urls.success) {
    errors.push('URL de éxito no configurada');
  }

  if (!MP_CONFIG.back_urls.failure) {
    errors.push('URL de fallo no configurada');
  }

  if (!MP_CONFIG.back_urls.pending) {
    errors.push('URL de pendiente no configurada');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export const mercadoPagoService = {
  createPreference,
  getPaymentInfo,
  getPaymentStatusFromDB,
  formatMPError,
  validateMPConfig
};

export default mercadoPagoService;
