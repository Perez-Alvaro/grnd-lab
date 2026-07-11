/**
 * src/lib/supabaseClient.js
 * Cliente Supabase para el navegador. Usa SOLO la anon key (pública por diseño):
 * toda la seguridad real la aplica RLS en la base. Ningún secreto vive acá.
 */
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    'Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copiá .env.example a .env y completá los valores.'
  );
}

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'grindlab.auth',
  },
});
