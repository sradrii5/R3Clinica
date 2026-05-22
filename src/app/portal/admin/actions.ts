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

    // 2. Crear el usuario en auth.users con confirmación automática de email
    // La contraseña temporal por defecto será R3Clinica2026! (el administrador la entregará al cliente)
    const passwordTemporal = 'R3Clinica2026!'
    
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

  } catch (err: any) {
    return { success: false, error: err.message || 'Error interno del servidor' }
  }
}

export interface EjercicioInput {
  nombre: string
  series: number
  repeticiones: string
  notas: string
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
        orden: index + 1
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

  } catch (err: any) {
    return { success: false, error: err.message || 'Error al guardar los planes' }
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
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al editar el cliente' }
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
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al restablecer la contraseña del cliente' }
  }
}
