/**
 * Multimedia Service
 *
 * Servicio para gestionar archivos multimedia (videos e imágenes) en Supabase:
 * - Subir videos para ejercicios
 * - Subir imágenes de portada para rutinas
 * - Eliminar archivos
 * - Obtener URLs públicas/firmadas
 */

import { supabase } from '@/lib/supabase';

const BUCKET_NAME = 'multimedia';

/**
 * Subir un video al bucket multimedia
 * @param {File} file - Archivo de video
 * @param {Object} options - Opciones adicionales
 * @param {string} options.exerciseName - Nombre del ejercicio (para nombrar el archivo)
 * @returns {Promise<Object>} - { url, path }
 */
export const uploadVideo = async (file, options = {}) => {
  try {
    // Validar que sea un video
    if (!file.type.startsWith('video/')) {
      throw new Error('El archivo debe ser un video');
    }

    // Validar tamaño (máx 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error('El video no puede superar los 50MB');
    }

    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const exerciseName = options.exerciseName
      ? options.exerciseName.toLowerCase().replace(/[^a-z0-9]/g, '-')
      : 'video';

    const fileName = `videos/${exerciseName}-${timestamp}.${fileExt}`;

    console.log(`📹 Subiendo video: ${fileName}`);

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Obtener URL pública (si el bucket es público) o firmada (si es privado)
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    console.log(`✅ Video subido exitosamente: ${publicUrl}`);

    return {
      url: publicUrl,
      path: fileName,
      size: file.size,
      type: file.type
    };

  } catch (error) {
    console.error('❌ Error al subir video:', error);
    throw new Error(`Error al subir el video: ${error.message}`);
  }
};

/**
 * Subir una imagen al bucket multimedia
 * @param {File} file - Archivo de imagen
 * @param {Object} options - Opciones adicionales
 * @param {string} options.type - Tipo de imagen (routine-cover, exercise-thumbnail, etc)
 * @returns {Promise<Object>} - { url, path }
 */
export const uploadImage = async (file, options = {}) => {
  try {
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen');
    }

    // Validar tamaño (máx 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('La imagen no puede superar los 5MB');
    }

    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const type = options.type || 'image';

    const fileName = `images/${type}-${timestamp}.${fileExt}`;

    console.log(`🖼️ Subiendo imagen: ${fileName}`);

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    console.log(`✅ Imagen subida exitosamente: ${publicUrl}`);

    return {
      url: publicUrl,
      path: fileName,
      size: file.size,
      type: file.type
    };

  } catch (error) {
    console.error('❌ Error al subir imagen:', error);
    throw new Error(`Error al subir la imagen: ${error.message}`);
  }
};

/**
 * Eliminar un archivo del bucket multimedia
 * @param {string} filePath - Path del archivo en el bucket
 * @returns {Promise<boolean>}
 */
export const deleteFile = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error('Path del archivo requerido');
    }

    console.log(`🗑️ Eliminando archivo: ${filePath}`);

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) throw error;

    console.log(`✅ Archivo eliminado exitosamente`);
    return true;

  } catch (error) {
    console.error('❌ Error al eliminar archivo:', error);
    throw new Error(`Error al eliminar el archivo: ${error.message}`);
  }
};

/**
 * Obtener URL firmada para un archivo privado
 * @param {string} filePath - Path del archivo en el bucket
 * @param {number} expiresIn - Tiempo de expiración en segundos (default: 1 hora)
 * @returns {Promise<string>} - URL firmada
 */
export const getSignedUrl = async (filePath, expiresIn = 3600) => {
  try {
    if (!filePath) {
      throw new Error('Path del archivo requerido');
    }

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, expiresIn);

    if (error) throw error;

    return data.signedUrl;

  } catch (error) {
    console.error('❌ Error al obtener URL firmada:', error);
    throw new Error(`Error al obtener URL firmada: ${error.message}`);
  }
};

/**
 * Validar archivo antes de subir
 * @param {File} file - Archivo a validar
 * @param {Object} options - Opciones de validación
 * @returns {Object} - { valid, error }
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 50 * 1024 * 1024, // 50MB default
    allowedTypes = ['video/*', 'image/*']
  } = options;

  if (!file) {
    return { valid: false, error: 'No se seleccionó ningún archivo' };
  }

  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
    return { valid: false, error: `El archivo no puede superar los ${maxSizeMB}MB` };
  }

  const fileType = file.type;
  const isAllowed = allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      const prefix = type.split('/')[0];
      return fileType.startsWith(prefix + '/');
    }
    return fileType === type;
  });

  if (!isAllowed) {
    return { valid: false, error: 'Tipo de archivo no permitido' };
  }

  return { valid: true };
};

export const multimediaService = {
  uploadVideo,
  uploadImage,
  deleteFile,
  getSignedUrl,
  validateFile
};

export default multimediaService;
