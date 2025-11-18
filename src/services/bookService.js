/**
 * Book Service
 *
 * Servicio para gestionar libros (ebooks) en Supabase:
 * - Upload de PDFs al storage "Libros"
 * - Upload de portadas al storage "public"
 * - Creación de productos tipo 'book'
 * - CRUD completo de libros
 */

import { supabase } from '@/lib/supabase';

/**
 * Subir archivo PDF al storage "Libros"
 * @param {File} file - Archivo PDF
 * @param {string} fileName - Nombre personalizado (opcional)
 * @returns {Promise<{path: string, url: string}>}
 */
export const uploadBookPDF = async (file, fileName = null) => {
  try {
    // Validar que sea PDF
    if (file.type !== 'application/pdf') {
      throw new Error('El archivo debe ser PDF');
    }

    // Generar nombre único si no se provee
    const fileExt = 'pdf';
    const finalFileName = fileName || `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${finalFileName}`;

    console.log('📤 Uploading PDF to Libros bucket:', filePath);

    // Subir a Supabase Storage bucket "Libros"
    const { data, error } = await supabase.storage
      .from('Libros')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Obtener URL pública (si el bucket es público) o generar URL firmada
    const { data: { publicUrl } } = supabase.storage
      .from('Libros')
      .getPublicUrl(filePath);

    console.log('✅ PDF uploaded successfully:', filePath);

    return {
      path: filePath,
      url: publicUrl,
      size: file.size
    };

  } catch (error) {
    console.error('❌ Error uploading book PDF:', error);
    throw new Error(`Error al subir el PDF: ${error.message}`);
  }
};

/**
 * Subir imagen de portada al storage "public"
 * @param {File} file - Archivo de imagen
 * @returns {Promise<{path: string, url: string}>}
 */
export const uploadBookCover = async (file) => {
  try {
    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `book-covers/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

    console.log('📤 Uploading cover image:', fileName);

    const { data, error } = await supabase.storage
      .from('public')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('public')
      .getPublicUrl(fileName);

    console.log('✅ Cover image uploaded successfully');

    return {
      path: fileName,
      url: publicUrl
    };

  } catch (error) {
    console.error('❌ Error uploading book cover:', error);
    throw new Error(`Error al subir la portada: ${error.message}`);
  }
};

/**
 * Crear un libro completo (producto + detalles de libro)
 * @param {Object} bookData - Datos del libro
 * @param {File} pdfFile - Archivo PDF
 * @param {File} coverFile - Archivo de portada (opcional)
 * @returns {Promise<Object>} - Libro creado
 */
export const createBook = async (bookData, pdfFile, coverFile = null) => {
  try {
    console.log('📚 Creating new book:', bookData.name);

    // 1. Subir PDF al storage "Libros"
    const pdfUpload = await uploadBookPDF(pdfFile, `${bookData.slug}.pdf`);

    // 2. Subir portada si existe
    let coverUrl = bookData.image_url || null;
    if (coverFile) {
      const coverUpload = await uploadBookCover(coverFile);
      coverUrl = coverUpload.url;
    }

    // 3. Crear producto
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([{
        type: 'book',
        name: bookData.name,
        slug: bookData.slug,
        description: bookData.description || '',
        price: parseFloat(bookData.price) || 0,
        active: bookData.active !== undefined ? bookData.active : true,
        featured: bookData.featured || false,
        image_url: coverUrl
      }])
      .select()
      .single();

    if (productError) throw productError;

    console.log('✅ Product created:', product.id);

    // 4. Crear detalles del libro
    const { data: book, error: bookError } = await supabase
      .from('books')
      .insert([{
        id: product.id,
        author: bookData.author || 'Matías Ortiz',
        pages: parseInt(bookData.pages) || null,
        format: 'pdf',
        file_size_mb: (pdfUpload.size / (1024 * 1024)).toFixed(2),
        file_path: pdfUpload.path,
        preview_url: null,
        table_of_contents: bookData.table_of_contents || null,
        isbn: bookData.isbn || null
      }])
      .select()
      .single();

    if (bookError) throw bookError;

    console.log('✅ Book details created');

    return {
      ...product,
      book_details: book,
      pdf_url: pdfUpload.url
    };

  } catch (error) {
    console.error('❌ Error creating book:', error);
    throw new Error(`Error al crear el libro: ${error.message}`);
  }
};

/**
 * Obtener todos los libros
 * @returns {Promise<Array>}
 */
export const getAllBooks = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        books (*)
      `)
      .eq('type', 'book')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(product => ({
      ...product,
      book_details: product.books
    }));

  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

/**
 * Eliminar un libro y sus archivos
 * @param {string} bookId - ID del libro
 */
export const deleteBook = async (bookId) => {
  try {
    // 1. Obtener detalles del libro para eliminar archivos
    const { data: book } = await supabase
      .from('books')
      .select('file_path')
      .eq('id', bookId)
      .single();

    // 2. Eliminar PDF del storage
    if (book?.file_path) {
      await supabase.storage
        .from('Libros')
        .remove([book.file_path]);
    }

    // 3. Eliminar producto (cascade eliminará el registro de books)
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', bookId);

    if (error) throw error;

    console.log('✅ Book deleted successfully');

  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};

export const bookService = {
  uploadBookPDF,
  uploadBookCover,
  createBook,
  getAllBooks,
  deleteBook
};

export default bookService;
