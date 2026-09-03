// src/app/portal/admin/instalaciones-actions.ts
'use server'

import { createClient as createUserClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

async function verificarAdmin() {
  const supabase = await createUserClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('No autenticado')

  const { data: perfil, error: perfilError } = await supabase
    .from('perfiles')
    .select('es_admin')
    .eq('id', user.id)
    .single()

  if (perfilError || !perfil || !perfil.es_admin) {
    throw new Error('Acceso denegado: se requieren permisos de administrador')
  }
  return user
}

export interface InstalacionInput {
  titulo: string
  descripcion?: string
  imagenUrl: string
}

/**
 * Crea una nueva foto/instalación en la galería del centro.
 */
export async function crearInstalacionAction(data: InstalacionInput) {
  try {
    await verificarAdmin()
    const adminClient = createAdminClient()

    const { count } = await adminClient
      .from('instalaciones')
      .select('id', { count: 'exact', head: true })

    const { error } = await adminClient.from('instalaciones').insert({
      titulo: data.titulo,
      descripcion: data.descripcion || null,
      imagen_url: data.imagenUrl,
      orden: (count ?? 0) + 1,
      activo: true,
    })

    if (error) throw new Error(error.message)

    revalidatePath('/el-centro')
    revalidatePath('/portal/admin')
    return { success: true }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error al añadir la instalación'
    return { success: false, error: errorMsg }
  }
}

/**
 * Edita el título, descripción o imagen de una instalación existente.
 */
export async function editarInstalacionAction(data: InstalacionInput & { id: string }) {
  try {
    await verificarAdmin()
    const adminClient = createAdminClient()

    const { error } = await adminClient
      .from('instalaciones')
      .update({
        titulo: data.titulo,
        descripcion: data.descripcion || null,
        imagen_url: data.imagenUrl,
      })
      .eq('id', data.id)

    if (error) throw new Error(error.message)

    revalidatePath('/el-centro')
    revalidatePath('/portal/admin')
    return { success: true }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error al editar la instalación'
    return { success: false, error: errorMsg }
  }
}

/**
 * Elimina una foto de la galería del centro.
 */
export async function eliminarInstalacionAction(id: string) {
  try {
    await verificarAdmin()
    const adminClient = createAdminClient()

    const { error } = await adminClient.from('instalaciones').delete().eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/el-centro')
    revalidatePath('/portal/admin')
    return { success: true }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error al eliminar la instalación'
    return { success: false, error: errorMsg }
  }
}

/**
 * Activa/desactiva la visibilidad pública de una instalación sin borrarla.
 */
export async function alternarActivoInstalacionAction(id: string, activo: boolean) {
  try {
    await verificarAdmin()
    const adminClient = createAdminClient()

    const { error } = await adminClient
      .from('instalaciones')
      .update({ activo })
      .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/el-centro')
    revalidatePath('/portal/admin')
    return { success: true }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error al actualizar la instalación'
    return { success: false, error: errorMsg }
  }
}
