/**
 * Script para verificar las credenciales de MercadoPago
 *
 * Ejecutar: node verify-mp-credentials.js
 */

// Leer las credenciales del .env
require('dotenv').config();

const publicKey = process.env.VITE_MP_PUBLIC_KEY;
const accessToken = process.env.MP_ACCESS_TOKEN;

console.log('🔍 Verificando credenciales de MercadoPago...\n');

console.log('📌 Public Key (Frontend):');
console.log(`   ${publicKey}`);
console.log(`   Tipo: ${publicKey?.startsWith('APP_USR-') ? 'TEST ✅' : publicKey?.startsWith('APP-') ? 'PRODUCCIÓN ⚠️' : 'INVÁLIDA ❌'}`);
console.log();

console.log('📌 Access Token (Backend):');
console.log(`   ${accessToken}`);
console.log(`   Tipo: ${accessToken?.startsWith('APP_USR-') ? 'TEST ✅' : accessToken?.startsWith('APP-') ? 'PRODUCCIÓN ⚠️' : 'INVÁLIDA ❌'}`);
console.log();

// Extraer el user_id de las credenciales
const extractUserId = (token) => {
  const parts = token?.split('-');
  return parts && parts.length >= 4 ? parts[3] : null;
};

const publicKeyUserId = extractUserId(publicKey);
const accessTokenUserId = extractUserId(accessToken);

console.log('📌 User IDs extraídos:');
console.log(`   Public Key User ID: ${publicKeyUserId}`);
console.log(`   Access Token User ID: ${accessTokenUserId}`);
console.log();

if (publicKeyUserId && accessTokenUserId) {
  if (publicKeyUserId === accessTokenUserId) {
    console.log('✅ Las credenciales pertenecen al MISMO usuario');
  } else {
    console.log('❌ ERROR: Las credenciales pertenecen a DIFERENTES usuarios');
    console.log('   Esto causará el error "Una de las partes con la que intentás hacer el pago es de prueba"');
    console.log();
    console.log('💡 Solución:');
    console.log('   1. Ve a https://www.mercadopago.com.ar/developers/panel/app');
    console.log('   2. Selecciona tu aplicación');
    console.log('   3. Ve a "Credenciales de prueba"');
    console.log('   4. Copia AMBAS credenciales (Public Key y Access Token) de la MISMA aplicación');
    console.log('   5. Actualiza tu archivo .env con ambas credenciales');
  }
} else {
  console.log('⚠️ No se pudo extraer los User IDs de las credenciales');
}

console.log('\n' + '='.repeat(80));
