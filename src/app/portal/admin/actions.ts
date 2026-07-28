// src/app/portal/admin/actions.ts
'use server'

import { createClient as createUserClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

/**
 * Helper para verificar si el usuario actual es administrador
 */
async function verificarAdmin() {
  const supabase = await createUserClient()
  
  // Obtener usuario autenticado actual
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('No autenticado')
  }

  // Comprobar si su perfil tiene es_admin = true
  const { data: perfil, error: perfilError } = await supabase
    .from('perfiles')
    .select('es_admin')
    .eq('id', user.id)
    .single()

  if (perfilError || !perfil || !perfil.es_admin) {
    throw new Error('Acceso denegado: Se requieren permisos de administrador')
  }

  return user
}

export interface CrearClienteData {
  email: string
  nombre: string
  apellidos: string
  objetivo: string
}

/**
 * Acción para dar de alta a un cliente en Supabase Auth y crear su perfil público
 */
export async function crearClienteAction(data: CrearClienteData) {
  try {
    // 1. Validar que la sesión actual sea de un administrador
    await verificarAdmin()

    const adminClient = createAdminClient()

    // Generar una contraseña temporal aleatoria y segura para el nuevo cliente
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#'
    let passwordTemporal = 'R3!'
    for (let i = 0; i < 9; i++) {
      passwordTemporal += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: data.email,
      password: passwordTemporal,
      email_confirm: true, // Confirmar email inmediatamente para saltarse la validación por correo
      user_metadata: {
        nombre: data.nombre,
        apellidos: data.apellidos
      }
    })

    if (authError || !authData.user) {
      return { 
        success: false, 
        error: authError?.message || 'Error al registrar el usuario en el sistema de autenticación.' 
      }
    }

    const nuevoUsuarioId = authData.user.id

    // 3. Crear el perfil en public.perfiles
    const { error: perfilError } = await adminClient
      .from('perfiles')
      .insert({
        id: nuevoUsuarioId,
        nombre: data.nombre,
        apellidos: data.apellidos,
        objetivo: data.objetivo,
        es_admin: false,
        email: data.email,
        activo: true
      })

    if (perfilError) {
      // Intento de Rollback: si el perfil falla, eliminamos el usuario de auth para evitar estados inconsistentes
      await adminClient.auth.admin.deleteUser(nuevoUsuarioId)
      return { 
        success: false, 
        error: `Error al crear el perfil público: ${perfilError.message}` 
      }
    }

    // 4. Crear automáticamente una rutina activa vacía de bienvenida y un plan nutricional
    await adminClient.from('rutinas').insert({
      cliente_id: nuevoUsuarioId,
      nombre: 'Rutina Inicial de Adaptación',
      descripcion: 'Tu entrenador está preparando tu rutina personalizada.',
      activa: true
    })

    await adminClient.from('planes_nutricionales').insert({
      cliente_id: nuevoUsuarioId,
      nombre: 'Pauta Nutricional de Bienvenida',
      descripcion: 'Tu nutricionista está preparando tu dieta estructurada.',
      calorias_objetivo: 2000,
      activo: true
    })

    revalidatePath('/portal/admin')
    return { 
      success: true, 
      email: data.email,
      password: passwordTemporal 
    }

  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error interno del servidor'
    return { success: false, error: errorMsg }
  }
}

export interface EjercicioInput {
  nombre: string
  series: number
  repeticiones: string
  notas: string
  imagen_url?: string | null
  video_url?: string | null
  dia_semana?: string
  fecha: string
  hora?: string | null
}

export interface ComidaInput {
  nombre: string
  descripcion: string
}

export interface AsignarPlanData {
  clienteId: string
  rutinaNombre: string
  rutinaDescripcion: string
  ejercicios: EjercicioInput[]
  planNombre: string
  planDescripcion: string
  caloriasObjetivo: number
  comidas: ComidaInput[]
}

/**
 * Acción para reescribir y asignar la rutina y plan nutricional completo a un cliente
 */
export async function guardarPlanCompletoAction(data: AsignarPlanData) {
  try {
    await verificarAdmin()
    const adminClient = createAdminClient()

    // 1. Limpieza en cascada de planes anteriores del cliente para evitar duplicidades
    // (Por seguridad, borramos las rutinas y planes anteriores asociados a este UUID de cliente)
    const { data: rutinasAnteriores } = await adminClient
      .from('rutinas')
      .select('id')
      .eq('cliente_id', data.clienteId)

    if (rutinasAnteriores && rutinasAnteriores.length > 0) {
      const rutinaIds = rutinasAnteriores.map(r => r.id)
      await adminClient.from('ejercicios').delete().in('rutina_id', rutinaIds)
      await adminClient.from('rutinas').delete().eq('cliente_id', data.clienteId)
    }

    const { data: planesAnteriores } = await adminClient
      .from('planes_nutricionales')
      .select('id')
      .eq('cliente_id', data.clienteId)

    if (planesAnteriores && planesAnteriores.length > 0) {
      const planIds = planesAnteriores.map(p => p.id)
      await adminClient.from('comidas').delete().in('plan_id', planIds)
      await adminClient.from('planes_nutricionales').delete().eq('cliente_id', data.clienteId)
    }

    // 2. Insertar nueva Rutina
    const { data: nuevaRutina, error: rutinaError } = await adminClient
      .from('rutinas')
      .insert({
        cliente_id: data.clienteId,
        nombre: data.rutinaNombre || 'Rutina de Entrenamiento',
        descripcion: data.rutinaDescripcion || '',
        activa: true,
        fecha_inicio: new Date().toISOString().split('T')[0]
      })
      .select()
      .single()

    if (rutinaError || !nuevaRutina) {
      throw new Error(`Error al crear la rutina: ${rutinaError?.message}`)
    }

    // 3. Insertar Ejercicios de la Rutina
    if (data.ejercicios.length > 0) {
      const ejerciciosInsert = data.ejercicios.map((e, index) => ({
        rutina_id: nuevaRutina.id,
        nombre: e.nombre,
        series: Number(e.series) || 3,
        repeticiones: e.repeticiones || '10',
        notas: e.notas || '',
        imagen_url: e.imagen_url || null,
        video_url: e.video_url || null,
        orden: index + 1,
        dia_semana: null,
        fecha: e.fecha,
        hora: e.hora || null
      }))

      const { error: ejerciciosError } = await adminClient
        .from('ejercicios')
        .insert(ejerciciosInsert)

      if (ejerciciosError) {
        throw new Error(`Error al asignar ejercicios: ${ejerciciosError.message}`)
      }
    }

    // 4. Insertar nuevo Plan Nutricional
    const { data: nuevoPlan, error: planError } = await adminClient
      .from('planes_nutricionales')
      .insert({
        cliente_id: data.clienteId,
        nombre: data.planNombre || 'Pauta Alimenticia',
        descripcion: data.planDescripcion || '',
        calorias_objetivo: Number(data.caloriasObjetivo) || 2000,
        activo: true
      })
      .select()
      .single()

    if (planError || !nuevoPlan) {
      throw new Error(`Error al crear el plan de alimentación: ${planError?.message}`)
    }

    // 5. Insertar Comidas del Plan
    if (data.comidas.length > 0) {
      const comidasInsert = data.comidas.map((c, index) => ({
        plan_id: nuevoPlan.id,
        nombre: c.nombre,
        descripcion: c.descripcion || '',
        orden: index + 1
      }))

      const { error: comidasError } = await adminClient
        .from('comidas')
        .insert(comidasInsert)

      if (comidasError) {
        throw new Error(`Error al asignar comidas: ${comidasError.message}`)
      }
    }

    revalidatePath('/portal/admin')
    revalidatePath('/portal/entreno')
    revalidatePath('/portal/nutricion')
    revalidatePath('/portal')
    return { success: true }

  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error al guardar los planes'
    return { success: false, error: errorMsg }
  }
}

/**
 * Obtiene los ejercicios de un cliente para una fecha concreta.
 * Se usa para cargar el editor de sesión y la función de copiar sesión.
 */
export async function obtenerEjerciciosPorFechaAction(clienteId: string, fecha: string) {
  try {
    await verificarAdmin()
    const adminClient = createAdminClient()

    // Obtener la rutina activa del cliente
    const { data: rutina } = await adminClient
      .from('rutinas')
      .select('id')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!rutina) return { success: true, ejercicios: [] }

    const { data: ejercicios, error } = await adminClient
      .from('ejercicios')
      .select('*')
      .eq('rutina_id', rutina.id)
      .eq('fecha', fecha)
      .order('orden', { ascending: true })

    if (error) throw new Error(error.message)

    return { success: true, ejercicios: ejercicios || [] }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error desconocido'
    return { success: false, error: errorMsg, ejercicios: [] }
  }
}

/**
 * Obtiene todas las fechas que tienen sesiones para un cliente.
 * Se usa para el picker del "Copiar sesión" y los indicadores del calendario.
 */
export async function obtenerFechasConSesionAction(clienteId: string) {
  try {
    await verificarAdmin()
    const adminClient = createAdminClient()

    const { data: rutina } = await adminClient
      .from('rutinas')
      .select('id')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!rutina) return { success: true, fechas: [] }

    const { data, error } = await adminClient
      .from('ejercicios')
      .select('fecha')
      .eq('rutina_id', rutina.id)
      .not('fecha', 'is', null)
      .order('fecha', { ascending: false })

    if (error) throw new Error(error.message)

    // Fechas únicas
    const fechas = [...new Set((data || []).map(e => e.fecha).filter(Boolean))] as string[]
    return { success: true, fechas }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error desconocido'
    return { success: false, error: errorMsg, fechas: [] }
  }
}

/**
 * Guarda los ejercicios de una sesión específica (por fecha exacta).
 * Solo toca los ejercicios de esa fecha en esa rutina — no afecta a otras sesiones.
 */
export async function guardarSesionFechaAction(data: {
  clienteId: string
  fecha: string
  ejercicios: EjercicioInput[]
}) {
  try {
    await verificarAdmin()
    const adminClient = createAdminClient()

    // Obtener (o crear) la rutina activa del cliente
    let { data: rutina } = await adminClient
      .from('rutinas')
      .select('id')
      .eq('cliente_id', data.clienteId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!rutina) {
      const { data: nuevaRutina, error: rutinaError } = await adminClient
        .from('rutinas')
        .insert({
          cliente_id: data.clienteId,
          nombre: 'Rutina de Entrenamiento',
          descripcion: '',
          activa: true,
          fecha_inicio: new Date().toISOString().split('T')[0]
        })
        .select()
        .single()
      if (rutinaError || !nuevaRutina) throw new Error('No se pudo crear la rutina')
      rutina = nuevaRutina
    }

    // Borrar SOLO los ejercicios de esa fecha concreta
    await adminClient
      .from('ejercicios')
      .delete()
      .eq('rutina_id', rutina.id)
      .eq('fecha', data.fecha)

    // Insertar los nuevos ejercicios para esa fecha
    if (data.ejercicios.length > 0) {
      const insert = data.ejercicios.map((e, index) => ({
        rutina_id: rutina!.id,
        nombre: e.nombre,
        series: Number(e.series) || 3,
        repeticiones: e.repeticiones || '10',
        notas: e.notas || '',
        imagen_url: e.imagen_url || null,
        video_url: e.video_url || null,
        orden: index + 1,
        dia_semana: null,
        fecha: data.fecha,
        hora: e.hora || null
      }))

      const { error: insertError } = await adminClient.from('ejercicios').insert(insert)
      if (insertError) throw new Error(`Error al guardar ejercicios: ${insertError.message}`)
    }

    revalidatePath('/portal/admin')
    revalidatePath('/portal/entreno')
    revalidatePath('/portal')
    return { success: true }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error al guardar la sesión'
    return { success: false, error: errorMsg }
  }
}

export interface EditarClienteData {
  clienteId: string
  nombre: string
  apellidos: string
  objetivo: string
  activo: boolean
}

/**
 * Acción para actualizar los datos de perfil de un cliente
 */
export async function editarClienteAction(data: EditarClienteData) {
  try {
    await verificarAdmin()
    const adminClient = createAdminClient()

    const { error } = await adminClient
      .from('perfiles')
      .update({
        nombre: data.nombre,
        apellidos: data.apellidos,
        objetivo: data.objetivo,
        activo: data.activo
      })
      .eq('id', data.clienteId)

    if (error) {
      throw new Error(`Error al actualizar el perfil: ${error.message}`)
    }

    revalidatePath('/portal/admin')
    revalidatePath('/portal')
    return { success: true }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error al editar el cliente'
    return { success: false, error: errorMsg }
  }
}

/**
 * Acción de servidor para que el administrador restablezca la contraseña de un cliente.
 * Genera una contraseña aleatoria temporal y la actualiza en el sistema de autenticación de Supabase.
 */
export async function restablecerPasswordClienteAction(data: { clienteId: string; nuevaPassword?: string }) {
  try {
    await verificarAdmin()
    const adminClient = createAdminClient()

    // Generar o usar la contraseña especificada
    const nuevaPassword = data.nuevaPassword || 'R3Clinica' + Math.floor(1000 + Math.random() * 9000) + '!'

    // Actualizar en auth.users la contraseña del cliente
    const { error: authError } = await adminClient.auth.admin.updateUserById(
      data.clienteId,
      { password: nuevaPassword }
    )

    if (authError) {
      throw new Error(`Error en el sistema de autenticación: ${authError.message}`)
    }

    return { success: true, nuevaPassword }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error al restablecer la contraseña del cliente'
    return { success: false, error: errorMsg }
  }
}

/**
 * Crea un nuevo ejercicio en el catálogo maestro.
 */
export async function crearEjercicioCatalogoAction(data: {
  nombre: string
  descripcion?: string
  grupoMuscular: string
  imagenUrl?: string
  videoUrl?: string
}) {
  try {
    await verificarAdmin()
    const adminClient = createAdminClient()

    const { error } = await adminClient
      .from('catalogo_ejercicios')
      .insert({
        nombre: data.nombre,
        descripcion: data.descripcion || null,
        grupo_muscular: data.grupoMuscular,
        imagen_url: data.imagenUrl || null,
        video_url: data.videoUrl || null
      })

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/portal/admin')
    return { success: true }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error al crear el ejercicio en el catálogo'
    return { success: false, error: errorMsg }
  }
}

/**
 * Edita un ejercicio del catálogo maestro.
 */
export async function editarEjercicioCatalogoAction(data: {
  id: string
  nombre: string
  descripcion?: string
  grupoMuscular: string
  imagenUrl?: string
  videoUrl?: string
}) {
  try {
    await verificarAdmin()
    const adminClient = createAdminClient()

    const { error } = await adminClient
      .from('catalogo_ejercicios')
      .update({
        nombre: data.nombre,
        descripcion: data.descripcion || null,
        grupo_muscular: data.grupoMuscular,
        imagen_url: data.imagenUrl || null,
        video_url: data.videoUrl || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', data.id)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/portal/admin')
    return { success: true }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error al editar el ejercicio del catálogo'
    return { success: false, error: errorMsg }
  }
}

/**
 * Elimina un ejercicio del catálogo maestro.
 */
export async function eliminarEjercicioCatalogoAction(id: string) {
  try {
    await verificarAdmin()
    const adminClient = createAdminClient()

    const { error } = await adminClient
      .from('catalogo_ejercicios')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/portal/admin')
    return { success: true }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error al eliminar el ejercicio del catálogo'
    return { success: false, error: errorMsg }
  }
}
