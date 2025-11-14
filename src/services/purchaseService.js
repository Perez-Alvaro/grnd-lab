import { supabase } from '@/lib/supabase';
import { generateRoutinePDF } from './pdfGenerator';

/**
 * Procesa una compra completa:
 * 1. Crea la venta en DB
 * 2. Genera el PDF de la rutina
 * 3. Sube el PDF a Storage
 * 4. Crea el registro de archivo generado
 * 5. Envía email de confirmación
 * 6. Registra la actividad
 */
export const processPurchase = async ({
  userId,
  userEmail,
  userName,
  routine,
  paymentData,
}) => {
  try {
    console.log('🛒 Iniciando proceso de compra...');

    // 1. CREAR VENTA
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert([
        {
          user_id: userId,
          user_email: userEmail,
          total_amount: routine.price,
          status: paymentData.status === 'approved' ? 'completed' : 'pending',
          payment_method: 'mercadopago',
          payment_id: paymentData.id,
          payment_status: paymentData.status,
        },
      ])
      .select()
      .single();

    if (saleError) throw saleError;

    console.log('✅ Venta creada:', sale.id);

    // 2. CREAR ITEM DE VENTA
    const { data: saleItem, error: itemError } = await supabase
      .from('sale_items')
      .insert([
        {
          sale_id: sale.id,
          product_id: routine.id,
          product_type: 'routine',
          product_name: routine.name || routine.title,
          price: routine.price,
        },
      ])
      .select()
      .single();

    if (itemError) throw itemError;

    console.log('✅ Item de venta creado:', saleItem.id);

    // 3. GENERAR PDF
    console.log('📄 Generando PDF de la rutina...');
    const pdfBlob = generateRoutinePDF(routine, {
      userName,
      purchaseDate: sale.created_at,
    });

    // 4. SUBIR PDF A STORAGE
    const fileName = `${sale.id}_${routine.id}_${Date.now()}.pdf`;
    const filePath = `routines/${fileName}`;

    console.log('☁️ Subiendo PDF a Storage...');
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('routines')
      .upload(filePath, pdfBlob, {
        contentType: 'application/pdf',
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('❌ Error subiendo PDF:', uploadError);
      throw uploadError;
    }

    console.log('✅ PDF subido:', filePath);

    // 5. OBTENER URL PÚBLICA DEL PDF (si el bucket es público)
    // Si es privado, usaremos signed URLs
    const { data: publicUrlData } = supabase.storage
      .from('routines')
      .getPublicUrl(filePath);

    // 6. CREAR REGISTRO DE ARCHIVO GENERADO
    const { data: generatedFile, error: fileError } = await supabase
      .from('generated_files')
      .insert([
        {
          sale_item_id: saleItem.id,
          file_type: 'routine_pdf',
          file_path: filePath,
          file_size_mb: (pdfBlob.size / (1024 * 1024)).toFixed(2),
          download_limit: 10, // Límite de 10 descargas
        },
      ])
      .select()
      .single();

    if (fileError) throw fileError;

    console.log('✅ Archivo registrado en DB:', generatedFile.id);

    // 7. REGISTRAR ACTIVIDAD
    await supabase.from('activity_logs').insert([
      {
        user_id: userId,
        user_email: userEmail,
        action_type: 'purchase',
        action_details: {
          sale_id: sale.id,
          product_name: routine.name || routine.title,
          amount: routine.price,
        },
      },
    ]);

    console.log('✅ Actividad registrada');

    // 8. ENVIAR EMAIL DE CONFIRMACIÓN
    // TODO: Integrar con Resend cuando esté configurado
    console.log('📧 Email de confirmación (pendiente integración con Resend)');

    // RETORNAR INFORMACIÓN DE LA COMPRA
    return {
      success: true,
      sale,
      saleItem,
      generatedFile,
      pdfUrl: publicUrlData.publicUrl,
      message: 'Compra procesada exitosamente',
    };
  } catch (error) {
    console.error('❌ Error procesando compra:', error);

    // Si algo falla, intentar limpiar registros creados
    // (esto debería manejarse con transacciones en producción)

    throw error;
  }
};

/**
 * Obtiene las compras de un usuario
 */
export const getUserPurchases = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('sales')
      .select(
        `
        *,
        sale_items (
          *,
          generated_files (*)
        )
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return { data: null, error };
  }
};

/**
 * Descarga un archivo PDF de una compra
 * Registra la descarga en la tabla downloads
 */
export const downloadPurchasedFile = async ({
  userId,
  userEmail,
  generatedFileId,
  filePath,
}) => {
  try {
    // 1. Verificar que el usuario tiene acceso a este archivo
    const { data: fileData, error: fileError } = await supabase
      .from('generated_files')
      .select(
        `
        *,
        sale_items!inner (
          *,
          sales!inner (
            user_id
          )
        )
      `
      )
      .eq('id', generatedFileId)
      .single();

    if (fileError) throw fileError;

    // Verificar que el archivo pertenece al usuario
    if (fileData.sale_items.sales.user_id !== userId) {
      throw new Error('No autorizado para descargar este archivo');
    }

    // 2. Verificar límite de descargas
    if (
      fileData.download_limit &&
      fileData.download_count >= fileData.download_limit
    ) {
      throw new Error('Límite de descargas alcanzado');
    }

    // 3. Registrar descarga
    await supabase.from('downloads').insert([
      {
        user_id: userId,
        user_email: userEmail,
        generated_file_id: generatedFileId,
        user_agent: navigator.userAgent,
      },
    ]);

    // 4. Descargar archivo desde Storage
    const { data: downloadData, error: downloadError } = await supabase.storage
      .from('routines')
      .download(filePath);

    if (downloadError) throw downloadError;

    return {
      success: true,
      blob: downloadData,
    };
  } catch (error) {
    console.error('Error downloading file:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default {
  processPurchase,
  getUserPurchases,
  downloadPurchasedFile,
};
