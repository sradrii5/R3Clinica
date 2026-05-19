// src/lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

/**
 * Cliente Supabase Administrativo.
 * Utiliza la clave SUPABASE_SERVICE_ROLE_KEY (secreta, del servidor) para
 * realizar operaciones privilegiadas (ej. crear usuarios sin confirmación de email).
 * NUNCA importar en componentes del cliente (browser).
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Faltan variables de entorno para el cliente administrativo de Supabase. ' +
      'Por favor, comprueba NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.'
    );
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
