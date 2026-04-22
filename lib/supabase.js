import { createClient } from '@supabase/supabase-js';

// Cargamos las llaves desde el archivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verificación de seguridad para la consola
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ ERROR: No se encontraron las llaves en .env.local");
}

// ESTA ES LA LÍNEA QUE EL ERROR DICE QUE NO EXISTE:
export const supabase = createClient(supabaseUrl, supabaseAnonKey);