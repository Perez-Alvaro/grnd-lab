/**
 * Nutrition Book Service
 *
 * Servicio para manejar ebooks y su integración
 * con rutinas para crear bundles premium dinámicos.
 *
 * Los ebooks se agregan desde el dashboard de administrador,
 * no desde migraciones.
 */

import { supabase } from '@/lib/supabase';

/**
 * Obtener todos los ebooks activos y destacados
 * (para usar como addons premium)
 * @returns {Promise<Array>} - Lista de ebooks disponibles
 */
export const getAvailableBooks = async () => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        books (*)
      `)
      .eq('type', 'book')
      .eq('active', true)
      .eq('featured', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching books:', error);
      return [];
    }

    if (!products || products.length === 0) {
      console.warn('No featured books found in database');
      return [];
    }

    return products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: parseFloat(product.price),
      image_url: product.image_url,
      author: product.books?.author,
      pages: product.books?.pages,
      format: product.books?.format,
      type: 'book'
    }));

  } catch (error) {
    console.error('Error in getAvailableBooks:', error);
    return [];
  }
};

/**
 * Obtener el primer ebook activo (para usar como addon premium principal)
 * @returns {Promise<Object|null>} - Primer ebook disponible
 */
export const getPrimaryBook = async () => {
  const books = await getAvailableBooks();
  return books.length > 0 ? books[0] : null;
};

/**
 * Crear un bundle dinámico (rutina + libro de nutrición)
 * NOTA: Este bundle es temporal, solo para el checkout
 * No se guarda en la DB, se crea on-the-fly
 *
 * @param {Object} routine - Rutina seleccionada
 * @param {Object} nutritionBook - Libro de nutrición
 * @returns {Object} - Bundle dinámico para Mercado Pago
 */
export const createDynamicBundle = (routine, nutritionBook) => {
  if (!routine || !nutritionBook) {
    throw new Error('Routine and nutrition book are required');
  }

  const bundlePrice = parseFloat(routine.price) + parseFloat(nutritionBook.price);

  return {
    id: `bundle-${routine.id}-${nutritionBook.id}`,
    name: `${routine.name} + ${nutritionBook.name}`,
    description: `Bundle premium: Incluye la rutina "${routine.name}" más el libro de nutrición oficial de Matías Ortiz`,
    price: bundlePrice,
    type: 'bundle',
    isDynamic: true, // Flag para indicar que es un bundle temporal
    products: [
      {
        id: routine.id,
        name: routine.name,
        type: 'routine',
        price: parseFloat(routine.price),
        description: routine.description
      },
      {
        id: nutritionBook.id,
        name: nutritionBook.name,
        type: 'book',
        price: parseFloat(nutritionBook.price),
        description: nutritionBook.description
      }
    ],
    // Metadata para Mercado Pago
    metadata: {
      routine_id: routine.id,
      book_id: nutritionBook.id,
      bundle_type: 'premium',
      is_dynamic: true
    }
  };
};

/**
 * Verificar si hay ebooks disponibles
 * @returns {Promise<boolean>}
 */
export const areBooksAvailable = async () => {
  const books = await getAvailableBooks();
  return books.length > 0;
};

/**
 * Obtener el precio del addon premium
 * (precio del primer ebook disponible)
 * @returns {Promise<number>}
 */
export const getPremiumAddonPrice = async () => {
  const book = await getPrimaryBook();
  return book ? book.price : 0;
};

export const nutritionBookService = {
  getAvailableBooks,
  getPrimaryBook,
  createDynamicBundle,
  areBooksAvailable,
  getPremiumAddonPrice
};

export default nutritionBookService;
