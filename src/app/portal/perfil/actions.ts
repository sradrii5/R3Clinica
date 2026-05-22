// src/app/portal/perfil/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Acción de servidor para que cualquier usuario conectado actualice su propia contraseña.
 */
export async function actualizarPasswordPropiaAction(password: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({ password })
    
    if (error) {
      throw new Error(error.message)
    }
    
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al cambiar la contraseña' }
  }
}
