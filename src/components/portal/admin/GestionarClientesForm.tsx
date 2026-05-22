// src/components/portal/admin/GestionarClientesForm.tsx
'use client'

import { useState } from 'react'
import { editarClienteAction } from '@/app/portal/admin/actions'
import { Edit2, ShieldAlert, Check, X, Mail, Calendar, User, Target, Activity } from 'lucide-react'

interface Perfil {
  id: string
  nombre: string
  apellidos: string
  email: string | null
  objetivo: string | null
  activo: boolean
  fecha_alta: string | null
}

interface GestionarClientesFormProps {
  perfiles: Perfil[]
}

export default function GestionarClientesForm({ perfiles: initialPerfiles }: GestionarClientesFormProps) {
  const [perfiles, setPerfiles] = useState<Perfil[]>(initialPerfiles)
  const [editingPerfilId, setEditingPerfilId] = useState<string | null>(null)
  
  // Estados del formulario de edición
  const [editNombre, setEditNombre] = useState('')
  const [editApellidos, setEditApellidos] = useState('')
  const [editObjetivo, setEditObjetivo] = useState('')
  const [editActivo, setEditActivo] = useState(true)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleStartEdit = (perfil: Perfil) => {
    setEditingPerfilId(perfil.id)
    setEditNombre(perfil.nombre)
    setEditApellidos(perfil.apellidos)
    setEditObjetivo(perfil.objetivo || '')
    setEditActivo(perfil.activo)
    setError(null)
    setSuccessMessage(null)
  }

  const handleCancelEdit = () => {
    setEditingPerfilId(null)
    setError(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPerfilId) return

    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    const result = await editarClienteAction({
      clienteId: editingPerfilId,
      nombre: editNombre,
      apellidos: editApellidos,
      objetivo: editObjetivo,
      activo: editActivo
    })

    setLoading(false)
    if (result.success) {
      // Actualizar el estado local
      setPerfiles(prev =>
        prev.map(p =>
          p.id === editingPerfilId
            ? { ...p, nombre: editNombre, apellidos: editApellidos, objetivo: editObjetivo, activo: editActivo }
            : p
        )
      )
      setSuccessMessage('¡Datos del cliente actualizados correctamente!')
      setEditingPerfilId(null)
      
      // Auto-desvanecer mensaje de éxito
      setTimeout(() => setSuccessMessage(null), 4000)
    } else {
      setError(result.error || 'Ocurrió un error al actualizar los datos del cliente.')
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fade-in">
      {successMessage && (
        <div className="p-4 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center gap-3 text-brand-400 text-sm animate-fade-in">
          <Check className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor Modal/Panel Flotante (si se está editando) */}
      {editingPerfilId && (
        <div className="glass-dark border border-brand-500/20 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-2xl animate-fade-in">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl -z-10" />
          
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl">
                <Edit2 className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white">Editar Datos del Cliente</h3>
            </div>
            <button
              onClick={handleCancelEdit}
              className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Nombre</label>
                <input
                  type="text"
                  required
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Apellidos</label>
                <input
                  type="text"
                  required
                  value={editApellidos}
                  onChange={(e) => setEditApellidos(e.target.value)}
                  className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Objetivo de Salud / Clínico</label>
              <textarea
                rows={3}
                required
                value={editObjetivo}
                onChange={(e) => setEditObjetivo(e.target.value)}
                className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50 transition-colors resize-none"
              />
            </div>

            <div className="p-4 bg-[#080c0a]/60 border border-white/5 rounded-2xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand-400" />
                  Estado de Actividad del Atleta
                </span>
                <p className="text-xs text-neutral-400">
                  Si se desactiva, el cliente ya no aparecerá en los selectores de planes y se le limitará el acceso a rutinas vigentes.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={editActivo}
                  onChange={(e) => setEditActivo(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500 peer-checked:after:bg-black"></div>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="py-2.5 px-5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 py-2.5 px-6 rounded-xl text-xs font-bold bg-white text-black hover:bg-neutral-200 transition-colors disabled:opacity-50 cursor-pointer shadow-lg"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Guardar Cambios'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Listado de Clientes */}
      <div className="glass-dark border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -z-10" />

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">Listado de Clientes Registrados</h2>
          <p className="text-sm text-neutral-400">Visualiza el estado de los perfiles y actualiza sus datos clínicos.</p>
        </div>

        <div className="overflow-x-auto">
          {perfiles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-neutral-500">No hay clientes registrados en el sistema.</p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/5 text-neutral-500 text-[10px] font-bold uppercase tracking-widest">
                  <th className="pb-3 pl-2">Cliente / Atleta</th>
                  <th className="pb-3">Contacto</th>
                  <th className="pb-3 max-w-xs hidden md:table-cell">Objetivo Principal</th>
                  <th className="pb-3 text-center">Estado</th>
                  <th className="pb-3 pr-2 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {perfiles.map(p => (
                  <tr key={p.id} className="group hover:bg-white/[0.01] transition-colors">
                    {/* Nombre */}
                    <td className="py-4 pl-2 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <span>{p.nombre} {p.apellidos}</span>
                          <div className="md:hidden text-[10px] text-neutral-500 mt-0.5 flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3" />
                            {p.fecha_alta ? new Date(p.fecha_alta).toLocaleDateString() : 'N/D'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email y Registro */}
                    <td className="py-4 text-neutral-300">
                      <div className="space-y-1">
                        <span className="flex items-center gap-1.5 text-xs">
                          <Mail className="w-3.5 h-3.5 text-neutral-500" />
                          {p.email || 'Sin correo asociado'}
                        </span>
                        <span className="hidden md:flex items-center gap-1.5 text-[10px] text-neutral-500 font-mono">
                          <Calendar className="w-3 h-3" />
                          Alta: {p.fecha_alta ? new Date(p.fecha_alta).toLocaleDateString() : 'N/D'}
                        </span>
                      </div>
                    </td>

                    {/* Objetivo */}
                    <td className="py-4 max-w-xs text-xs text-neutral-400 italic hidden md:table-cell pr-4">
                      {p.objetivo ? (
                        <div className="flex gap-1.5 items-start">
                          <Target className="w-3.5 h-3.5 text-neutral-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">&quot;{p.objetivo}&quot;</span>
                        </div>
                      ) : (
                        <span className="text-neutral-600">Ningún objetivo asignado</span>
                      )}
                    </td>

                    {/* Estado */}
                    <td className="py-4 text-center">
                      <div className="inline-flex items-center justify-center">
                        {p.activo ? (
                          <span className="flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-sm shadow-emerald-500/5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Activo
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-bold bg-neutral-800 border border-neutral-700 text-neutral-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                            Inactivo
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Acción */}
                    <td className="py-4 pr-2 text-right">
                      <button
                        onClick={() => handleStartEdit(p)}
                        className="p-2 rounded-xl text-neutral-400 hover:text-brand-400 bg-white/5 border border-white/5 hover:border-brand-500/30 hover:bg-brand-500/10 transition-all duration-300 cursor-pointer inline-flex items-center justify-center"
                        title="Editar datos del cliente"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
