/**
 * Bundle Service
 *
 * Servicio para manejar la lógica de bundles (paquetes de productos):
 * - Rutina + Libro
 * - Detección de bundles
 * - Cálculo de precios con descuento
 * - Obtención de productos incluidos
 */

import { supabase } from '@/lib/supabase';

/**
 * Verificar si un producto es un bundle
 * @param {string} productId - ID del producto
 * @returns {Promise<boolean>} - True si es bundle
 */
export const isBundleProduct = async (productId) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('type')
      .eq('id', productId)
      .single();

    if (error) throw error;

    return product?.type === 'bundle';
  } catch (error) {
    console.error('Error checking if product is bundle:', error);
    return false;
  }
};

/**
 * Obtener los productos incluidos en un bundle
 * @param {string} bundleId - ID del producto bundle
 * @returns {Promise<Array>} - Array de productos incluidos con sus detalles
 */
export const getBundleProducts = async (bundleId) => {
  try {
    // 1. Obtener las relaciones del bundle
    const { data: relations, error: relError } = await supabase
      .from('product_bundles')
      .select('included_product_id, discount_percentage')
      .eq('bundle_product_id', bundleId);

    if (relError) throw relError;

    if (!relations || relations.length === 0) {
      console.warn(`Bundle ${bundleId} has no products`);
      return [];
    }

    // 2. Obtener los detalles de cada producto incluido
    const productIds = relations.map(r => r.included_product_id);

    const { data: products, error: prodError } = await supabase
      .from('products')
      .select(`
        id,
        type,
        name,
        slug,
        description,
        price,
        image_url,
        routines (*),
        books (*)
      `)
      .in('id', productIds);

    if (prodError) throw prodError;

    // 3. Combinar productos con descuentos
    return products.map(product => {
      const relation = relations.find(r => r.included_product_id === product.id);
      return {
        ...product,
        discountPercentage: relation?.discount_percentage || 0
      };
    });

  } catch (error) {
    console.error('Error getting bundle products:', error);
    throw error;
  }
};

/**
 * Calcular el precio total de un bundle con descuentos
 * @param {string} bundleId - ID del producto bundle
 * @returns {Promise<Object>} - { originalPrice, discountedPrice, savings, items }
 */
export const calculateBundlePrice = async (bundleId) => {
  try {
    // Obtener el bundle principal
    const { data: bundle, error: bundleError } = await supabase
      .from('products')
      .select('price')
      .eq('id', bundleId)
      .single();

    if (bundleError) throw bundleError;

    // Obtener productos incluidos
    const products = await getBundleProducts(bundleId);

    // Calcular precio original (suma de precios individuales)
    const originalPrice = products.reduce((sum, product) => {
      return sum + parseFloat(product.price || 0);
    }, 0);

    // El precio del bundle es el precio configurado en la DB
    const discountedPrice = parseFloat(bundle.price);

    // Calcular ahorro
    const savings = originalPrice - discountedPrice;
    const savingsPercentage = originalPrice > 0
      ? Math.round((savings / originalPrice) * 100)
      : 0;

    return {
      originalPrice,
      discountedPrice,
      savings,
      savingsPercentage,
      items: products.map(p => ({
        id: p.id,
        name: p.name,
        type: p.type,
        price: parseFloat(p.price),
        discountPercentage: p.discountPercentage
      }))
    };

  } catch (error) {
    console.error('Error calculating bundle price:', error);
    throw error;
  }
};

/**
 * Obtener información completa de un bundle para mostrar en el checkout
 * @param {string} bundleId - ID del producto bundle
 * @returns {Promise<Object>} - Información del bundle
 */
export const getBundleInfo = async (bundleId) => {
  try {
    const [bundle, products, pricing] = await Promise.all([
      supabase
        .from('products')
        .select('*')
        .eq('id', bundleId)
        .single(),
      getBundleProducts(bundleId),
      calculateBundlePrice(bundleId)
    ]);

    if (bundle.error) throw bundle.error;

    return {
      id: bundle.data.id,
      name: bundle.data.name,
      description: bundle.data.description,
      image_url: bundle.data.image_url,
      ...pricing,
      products
    };

  } catch (error) {
    console.error('Error getting bundle info:', error);
    throw error;
  }
};

/**
 * Validar si un bundle está completo y activo
 * @param {string} bundleId - ID del producto bundle
 * @returns {Promise<{valid: boolean, errors: Array}>}
 */
export const validateBundle = async (bundleId) => {
  const errors = [];

  try {
    // 1. Verificar que el bundle exista y esté activo
    const { data: bundle, error: bundleError } = await supabase
      .from('products')
      .select('type, active')
      .eq('id', bundleId)
      .single();

    if (bundleError || !bundle) {
      errors.push('Bundle no encontrado');
      return { valid: false, errors };
    }

    if (bundle.type !== 'bundle') {
      errors.push('El producto no es un bundle');
      return { valid: false, errors };
    }

    if (!bundle.active) {
      errors.push('El bundle no está activo');
      return { valid: false, errors };
    }

    // 2. Verificar que tenga productos incluidos
    const products = await getBundleProducts(bundleId);

    if (products.length === 0) {
      errors.push('El bundle no tiene productos');
      return { valid: false, errors };
    }

    // 3. Verificar que todos los productos incluidos estén activos
    const inactiveProducts = products.filter(p => !p.active);
    if (inactiveProducts.length > 0) {
      errors.push(`Productos inactivos en el bundle: ${inactiveProducts.map(p => p.name).join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };

  } catch (error) {
    console.error('Error validating bundle:', error);
    errors.push('Error al validar el bundle');
    return { valid: false, errors };
  }
};

export const bundleService = {
  isBundleProduct,
  getBundleProducts,
  calculateBundlePrice,
  getBundleInfo,
  validateBundle
};

export default bundleService;
