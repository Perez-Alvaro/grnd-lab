/**
 * Script para generar PDFs de todas las rutinas existentes
 *
 * Uso: npm run generate-pdfs
 *
 * Este script es útil para:
 * - Generar PDFs de rutinas que fueron creadas antes de implementar la generación automática
 * - Regenerar todos los PDFs si se cambia el diseño del template
 * - Verificar que todas las rutinas tienen su PDF en el Storage
 */

import { createClient } from '@supabase/supabase-js';
import { pdf } from '@react-pdf/renderer';
import PlanDocument from '../src/pdf/PlanRenderer.jsx';
import { normalizePlanData } from '../src/pdf/utils/pdfLayout.js';

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno');
  console.error('Asegúrate de tener VITE_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Formatea rutina desde la DB
 */
const formatRoutineFromDB = (product, routine) => {
  if (!product || !routine) return null;

  return {
    id: product.id,
    name: product.name,
    title: product.name,
    description: product.description,
    frequency: routine.frequency,
    durationWeeks: routine.duration_weeks,
    level: routine.level,
    price: parseFloat(product.price),
    tags: routine.tags || [],
    weeks: routine.weeks || [],
  };
};

/**
 * Genera PDF de una rutina
 */
const generatePDF = async (routine) => {
  try {
    const normalizedPlan = normalizePlanData(routine);
    const blob = await pdf(<PlanDocument plan={normalizedPlan} />).toBlob();
    return blob;
  } catch (error) {
    throw new Error(`Error generando PDF: ${error.message}`);
  }
};

/**
 * Sube PDF al Storage
 */
const uploadPDF = async (routineId, pdfBlob) => {
  const filePath = `routines/${routineId}.pdf`;

  const { error } = await supabase.storage
    .from('Rutinas')
    .upload(filePath, pdfBlob, {
      contentType: 'application/pdf',
      upsert: true,
      cacheControl: '3600'
    });

  if (error) {
    throw new Error(`Error subiendo PDF: ${error.message}`);
  }

  return filePath;
};

/**
 * Procesa una rutina: genera y sube su PDF
 */
const processRoutine = async (product, routine, index, total) => {
  const formattedRoutine = formatRoutineFromDB(product, routine);

  if (!formattedRoutine) {
    console.log(`⚠️  Saltando rutina inválida`);
    return { success: false, error: 'Datos inválidos' };
  }

  console.log(`\n📄 [${index + 1}/${total}] Procesando: ${formattedRoutine.name}`);
  console.log(`   ID: ${formattedRoutine.id}`);

  try {
    // Generar PDF
    console.log(`   ⏳ Generando PDF...`);
    const pdfBlob = await generatePDF(formattedRoutine);
    const sizeKB = (pdfBlob.size / 1024).toFixed(2);
    console.log(`   ✅ PDF generado (${sizeKB} KB)`);

    // Subir a Storage
    console.log(`   ⏳ Subiendo a Storage...`);
    const filePath = await uploadPDF(formattedRoutine.id, pdfBlob);
    console.log(`   ✅ Subido: ${filePath}`);

    return { success: true, path: filePath, size: sizeKB };
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Función principal
 */
const main = async () => {
  console.log('🚀 Iniciando generación de PDFs de rutinas\n');
  console.log('='.repeat(60));

  try {
    // Obtener todas las rutinas activas
    console.log('\n📥 Obteniendo rutinas de la base de datos...');
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        routines (*)
      `)
      .eq('type', 'routine')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (!products || products.length === 0) {
      console.log('⚠️  No se encontraron rutinas activas');
      return;
    }

    console.log(`✅ Encontradas ${products.length} rutinas\n`);
    console.log('='.repeat(60));

    // Procesar cada rutina
    const results = [];
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const routine = product.routines;

      const result = await processRoutine(product, routine, i, products.length);
      results.push({
        id: product.id,
        name: product.name,
        ...result
      });

      // Pequeña pausa entre rutinas para no sobrecargar
      if (i < products.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Resumen final
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 RESUMEN FINAL\n');

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`✅ Exitosos: ${successful.length}/${results.length}`);
    console.log(`❌ Fallidos: ${failed.length}/${results.length}`);

    if (successful.length > 0) {
      console.log('\n✅ PDFs generados correctamente:');
      successful.forEach(r => {
        console.log(`   - ${r.name} (${r.size} KB) → ${r.path}`);
      });
    }

    if (failed.length > 0) {
      console.log('\n❌ PDFs con errores:');
      failed.forEach(r => {
        console.log(`   - ${r.name}: ${r.error}`);
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n🎉 Proceso completado!\n');

    // Exit code según resultados
    process.exit(failed.length > 0 ? 1 : 0);

  } catch (error) {
    console.error('\n❌ Error fatal:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Ejecutar script
main();
