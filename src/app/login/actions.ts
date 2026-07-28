// src/app/login/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { success: false, error: 'Por favor, introduce tu correo y contraseña.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Retornamos un mensaje de error genérico para evitar enumeración de usuarios o detalles de respuesta
    return { success: false, error: 'Credenciales incorrectas. Comprueba tu email y contraseña.' }
  }

  redirect('/portal')
}
