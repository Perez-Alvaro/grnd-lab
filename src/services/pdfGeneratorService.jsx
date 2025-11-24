/**
 * PDF Generator Service
 *
 * Servicio para generar PDFs de rutinas y subirlos a Supabase Storage.
 * Utiliza el sistema de renderizado existente (@react-pdf/renderer).
 */

import { pdf } from '@react-pdf/renderer';
import PlanDocument from '@/pdf/PlanRenderer.jsx';
import { supabase } from '@/lib/supabase';
import { normalizePlanData } from '@/pdf/utils/pdfLayout.js';
import logger from '@/utils/logger';

/**
 * Genera un PDF a partir de los datos de una rutina
 *
 * @param {Object} routine - Datos de la rutina
 * @returns {Promise<Blob>} - Blob del PDF generado
 */
export const generateRoutinePDF = async (routine) => {
  try {
    logger.info('Generating PDF for routine', { routineId: routine.id, name: routine.name });

    // Normalizar datos de la rutina al formato esperado por el renderer
    const normalizedPlan = normalizePlanData(routine);

    // Generar PDF usando @react-pdf/renderer
    const blob = await pdf(<PlanDocument plan={normalizedPlan} />).toBlob();

    logger.info('PDF generated successfully', {
      routineId: routine.id,
      size: `${(blob.size / 1024).toFixed(2)} KB`
    });

    return blob;
  } catch (error) {
    logger.error('Error generating PDF', { routineId: routine?.id, error: error.message });
    throw new Error(`Error al generar PDF: ${error.message}`);
  }
};

/**
 * Sube un PDF a Supabase Storage
 *
 * @param {string} routineId - ID de la rutina
 * @param {Blob} pdfBlob - Blob del PDF
 * @returns {Promise<Object>} - Información del archivo subido
 */
export const uploadPDFToStorage = async (routineId, pdfBlob) => {
  try {
    logger.info('Uploading PDF to storage', { routineId });

    const filePath = `routines/${routineId}.pdf`;

    // Subir a Supabase Storage (bucket: Rutinas)
    const { data, error } = await supabase.storage
      .from('Rutinas')
      .upload(filePath, pdfBlob, {
        contentType: 'application/pdf',
        upsert: true, // Sobrescribir si ya existe
        cacheControl: '3600' // Cache de 1 hora
      });

    if (error) {
      throw error;
    }

    logger.info('PDF uploaded successfully', { routineId, path: filePath });

    // Obtener URL pública del archivo
    const { data: urlData } = supabase.storage
      .from('Rutinas')
      .getPublicUrl(filePath);

    return {
      path: filePath,
      publicUrl: urlData.publicUrl,
      size: pdfBlob.size
    };
  } catch (error) {
    logger.error('Error uploading PDF', { routineId, error: error.message });
    throw new Error(`Error al subir PDF: ${error.message}`);
  }
};

/**
 * Genera y sube un PDF de una rutina
 * (Método principal - combina generación + subida)
 *
 * @param {Object} routine - Datos de la rutina
 * @returns {Promise<Object>} - Información del archivo subido
 */
export const generateAndUploadRoutinePDF = async (routine) => {
  try {
    logger.info('Starting PDF generation and upload process', {
      routineId: routine.id,
      name: routine.name
    });

    // 1. Generar PDF
    const pdfBlob = await generateRoutinePDF(routine);

    // 2. Subir a Storage
    const uploadResult = await uploadPDFToStorage(routine.id, pdfBlob);

    logger.info('PDF generation and upload completed', {
      routineId: routine.id,
      path: uploadResult.path,
      size: `${(uploadResult.size / 1024).toFixed(2)} KB`
    });

    return {
      success: true,
      routineId: routine.id,
      ...uploadResult
    };
  } catch (error) {
    logger.error('Error in PDF generation and upload process', {
      routineId: routine?.id,
      error: error.message
    });

    // No lanzamos error para no bloquear el flujo principal
    return {
      success: false,
      routineId: routine?.id,
      error: error.message
    };
  }
};

/**
 * Verifica si existe un PDF en el storage
 *
 * @param {string} routineId - ID de la rutina
 * @returns {Promise<boolean>} - true si existe, false si no
 */
export const checkPDFExists = async (routineId) => {
  try {
    const filePath = `routines/${routineId}.pdf`;

    const { data, error } = await supabase.storage
      .from('Rutinas')
      .list('routines', {
        search: `${routineId}.pdf`
      });

    if (error) {
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    logger.error('Error checking PDF existence', { routineId, error: error.message });
    return false;
  }
};

/**
 * Elimina un PDF del storage
 *
 * @param {string} routineId - ID de la rutina
 * @returns {Promise<boolean>} - true si se eliminó correctamente
 */
export const deletePDFFromStorage = async (routineId) => {
  try {
    const filePath = `routines/${routineId}.pdf`;

    const { error } = await supabase.storage
      .from('Rutinas')
      .remove([filePath]);

    if (error) {
      throw error;
    }

    logger.info('PDF deleted from storage', { routineId, path: filePath });
    return true;
  } catch (error) {
    logger.error('Error deleting PDF', { routineId, error: error.message });
    return false;
  }
};

/**
 * Regenera el PDF de una rutina (elimina el anterior y crea uno nuevo)
 *
 * @param {Object} routine - Datos de la rutina
 * @returns {Promise<Object>} - Información del archivo subido
 */
export const regenerateRoutinePDF = async (routine) => {
  try {
    logger.info('Regenerating PDF', { routineId: routine.id });

    // 1. Eliminar PDF anterior si existe
    await deletePDFFromStorage(routine.id);

    // 2. Generar y subir nuevo PDF
    const result = await generateAndUploadRoutinePDF(routine);

    return result;
  } catch (error) {
    logger.error('Error regenerating PDF', { routineId: routine?.id, error: error.message });
    return {
      success: false,
      routineId: routine?.id,
      error: error.message
    };
  }
};

export const pdfGeneratorService = {
  generateRoutinePDF,
  uploadPDFToStorage,
  generateAndUploadRoutinePDF,
  checkPDFExists,
  deletePDFFromStorage,
  regenerateRoutinePDF
};

export default pdfGeneratorService;
