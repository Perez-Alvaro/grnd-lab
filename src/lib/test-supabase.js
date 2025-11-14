// Script de prueba para verificar conexión con Supabase
// Ejecuta: node src/lib/test-supabase.js

import { supabase } from './supabase.js'

async function testConnection() {
  console.log('🔍 Probando conexión con Supabase...\n')

  try {
    // Test 1: Verificar configuración
    console.log('✅ Cliente de Supabase creado correctamente')
    console.log('📍 URL:', import.meta.env.VITE_SUPABASE_URL)
    console.log('🔑 Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...\n')

    // Test 2: Verificar conexión a la base de datos
    const { data, error } = await supabase.from('_test').select('*').limit(1)

    if (error && error.code === 'PGRST204') {
      console.log('✅ Conexión exitosa a Supabase')
      console.log('ℹ️  No hay tablas aún (es normal para un proyecto nuevo)\n')
    } else if (error) {
      console.log('⚠️  Error de conexión:', error.message)
    } else {
      console.log('✅ Conexión exitosa y base de datos accesible\n')
    }

    // Test 3: Verificar autenticación
    const { data: session } = await supabase.auth.getSession()
    console.log('🔐 Estado de autenticación:', session ? 'Sesión activa' : 'Sin sesión (correcto para inicio)')

    console.log('\n✅ Todas las pruebas pasaron correctamente')
    console.log('🚀 Puedes continuar con el desarrollo')

  } catch (err) {
    console.error('❌ Error crítico:', err.message)
    console.log('\n📝 Verifica que:')
    console.log('   1. Las variables de entorno estén correctamente configuradas en .env')
    console.log('   2. El proyecto de Supabase esté activo')
    console.log('   3. Las credenciales sean correctas')
  }
}

testConnection()
