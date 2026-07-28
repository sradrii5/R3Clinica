'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Users, Upload, Check, AlertCircle, Loader2, Instagram, Linkedin, Image as ImageIcon } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { MiembroEquipo } from '@/data/equipo'
import {
  crearMiembroEquipoAction,
  editarMiembroEquipoAction,
  eliminarMiembroEquipoAction
} from '@/app/portal/admin/actions'

interface GestionarEquipoFormProps {
  equipoInicial: MiembroEquipo[]
}

export default function GestionarEquipoForm({ equipoInicial }: GestionarEquipoFormProps) {
  const [equipo, setEquipo] = useState<MiembroEquipo[]>(equipoInicial)
  const [showFormPanel, setShowFormPanel] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form states
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [cargo, setCargo] = useState('')
  const [especialidadesInput, setEspecialidadesInput] = useState('')
  const [bio, setBio] = useState('')
  const [fotoUrl, setFotoUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')

  // UI status
  const [uploadingImage, setUploadingImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const resetForm = () => {
    setNombre('')
    setApellidos('')
    setCargo('')
    setEspecialidadesInput('')
    setBio('')
    setFotoUrl('')
    setInstagramUrl('')
    setLinkedinUrl('')
    setEditingId(null)
    setError(null)
  }

  const handleOpenNew = () => {
    resetForm()
    setShowFormPanel(true)
  }

  const handleOpenEdit = (m: MiembroEquipo) => {
    resetForm()
    setEditingId(m.id)
    setNombre(m.nombre)
    setApellidos(m.apellidos)
    setCargo(m.cargo)
    setEspecialidadesInput((m.especialidades || []).join(', '))
    setBio(m.bio || '')
    setFotoUrl(m.foto_url || '')
    setInstagramUrl(m.instagram_url || '')
    setLinkedinUrl(m.linkedin_url || '')
    setShowFormPanel(true)
  }

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setError(null)

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const fileExt = file.name.split('.').pop()
      const fileName = `equipo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`
      const filePath = `equipo/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('ejercicios-multimedia')
        .upload(filePath, file)

      if (uploadError) throw new Error(uploadError.message)

      const { data: publicData } = supabase.storage
        .from('ejercicios-multimedia')
        .getPublicUrl(filePath)

      setFotoUrl(publicData.publicUrl)
    } catch (err: unknown) {
      console.error(err)
      const msg = err instanceof Error ? err.message : 'Error al subir la fotografía'
      setError(msg)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim() || !cargo.trim()) {
      setError('Por favor, completa el nombre y cargo profesional.')
      return
    }

    setLoading(true)
    setError(null)

    const especialidades = especialidadesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    if (editingId) {
      // Editar
      const result = await editarMiembroEquipoAction({
        id: editingId,
        nombre,
        apellidos,
        cargo,
        especialidades,
        bio,
        fotoUrl: fotoUrl || undefined,
        instagramUrl: instagramUrl || undefined,
        linkedinUrl: linkedinUrl || undefined
      })

      if (result.success) {
        setEquipo(prev => prev.map(item => item.id === editingId ? {
          ...item,
          nombre,
          apellidos,
          cargo,
          especialidades,
          bio,
          foto_url: fotoUrl || null,
          instagram_url: instagramUrl || null,
          linkedin_url: linkedinUrl || null
        } : item))
        setSuccessMessage('¡Miembro del equipo actualizado con éxito!')
        setShowFormPanel(false)
        resetForm()
        setTimeout(() => setSuccessMessage(null), 4000)
      } else {
        setError(result.error || 'Error al actualizar')
      }
    } else {
      // Crear
      const result = await crearMiembroEquipoAction({
        nombre,
        apellidos,
        cargo,
        especialidades,
        bio,
        fotoUrl: fotoUrl || undefined,
        instagramUrl: instagramUrl || undefined,
        linkedinUrl: linkedinUrl || undefined
      })

      if (result.success) {
        const nuevo: MiembroEquipo = {
          id: Math.random().toString(),
          nombre,
          apellidos,
          cargo,
          especialidades,
          bio,
          foto_url: fotoUrl || null,
          instagram_url: instagramUrl || null,
          linkedin_url: linkedinUrl || null,
          orden: equipo.length + 1,
          activo: true
        }
        setEquipo(prev => [...prev, nuevo])
        setSuccessMessage('¡Nuevo profesional añadido al equipo!')
        setShowFormPanel(false)
        resetForm()
        setTimeout(() => setSuccessMessage(null), 4000)
      } else {
        setError(result.error || 'Error al añadir')
      }
    }

    setLoading(false)
  }

  const handleDelete = async (id: string, nombreCompleto: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar a "${nombreCompleto}" del equipo visible?`)) return

    setLoading(true)
    const result = await eliminarMiembroEquipoAction(id)
    setLoading(false)

    if (result.success) {
      setEquipo(prev => prev.filter(m => m.id !== id))
      setSuccessMessage('¡Profesional eliminado del equipo!')
      setTimeout(() => setSuccessMessage(null), 4000)
    } else {
      setError(result.error || 'Error al eliminar')
    }
  }

  return (
    <div className="space-y-8">
      {/* Barra superior de acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass p-6 rounded-3xl border border-white/5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-400" />
            Gestión del Equipo R3
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Añade, modifica o desactiva los especialistas visibles en la sección `/equipo` de la web.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Añadir Profesional
        </button>
      </div>

      {/* Mensaje global de éxito */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-3 animate-fade-in">
          <Check className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Panel Formulario Modal/Desplegable */}
      {showFormPanel && (
        <div className="glass rounded-3xl p-6 sm:p-8 border border-brand-500/20 bg-[#080c0a]/90 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white">
              {editingId ? 'Editar Especialista del Equipo' : 'Registrar Nuevo Especialista'}
            </h3>
            <button
              onClick={() => setShowFormPanel(false)}
              className="text-xs text-neutral-400 hover:text-white px-3 py-1 rounded-lg bg-white/5"
            >
              Cancelar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Ej: Sara"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Apellidos
                </label>
                <input
                  type="text"
                  value={apellidos}
                  onChange={e => setApellidos(e.target.value)}
                  placeholder="Ej: Fernández"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Cargo / Titulación Principal *
              </label>
              <input
                type="text"
                value={cargo}
                onChange={e => setCargo(e.target.value)}
                placeholder="Ej: Fisioterapeuta Colegiada & Especialista en Suelo Pélvico"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Especialidades (separadas por comas)
              </label>
              <input
                type="text"
                value={especialidadesInput}
                onChange={e => setEspecialidadesInput(e.target.value)}
                placeholder="Ej: Terapia Manual, Suelo Pélvico, Punción Seca"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Biografía / Resumen profesional
              </label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                placeholder="Breve descripción de su trayectoria y enfoque terapéutico..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Fotografía del Profesional */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Fotografía de Perfil
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {fotoUrl ? (
                  <div className="relative w-20 h-24 rounded-2xl overflow-hidden glass border border-brand-500/30">
                    <img src={fotoUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-600">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                <div className="flex-1 w-full space-y-2">
                  <label className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold cursor-pointer">
                    {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploadingImage ? 'Subiendo foto...' : 'Subir Imagen desde dispositivo'}
                    <input type="file" accept="image/*" onChange={handleUploadImage} className="hidden" />
                  </label>
                  <input
                    type="text"
                    value={fotoUrl}
                    onChange={e => setFotoUrl(e.target.value)}
                    placeholder="O pega una URL externa de imagen..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-300"
                  />
                </div>
              </div>
            </div>

            {/* Redes Sociales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  Instagram (opcional)
                </label>
                <input
                  type="text"
                  value={instagramUrl}
                  onChange={e => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/usuario"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                  LinkedIn (opcional)
                </label>
                <input
                  type="text"
                  value={linkedinUrl}
                  onChange={e => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/usuario"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="flex items-center gap-2 py-3 px-6 rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold text-sm transition-all cursor-pointer"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? 'Guardar Cambios' : 'Guardar Especialista'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rejilla de Especialistas del Equipo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipo.map(m => (
          <div
            key={m.id}
            className="glass rounded-3xl border border-white/5 overflow-hidden flex flex-col justify-between hover:border-white/10 transition-all p-6 relative group"
          >
            <div className="flex gap-4 items-start mb-4">
              <div className="w-20 h-24 rounded-2xl bg-neutral-900 border border-white/5 overflow-hidden shrink-0">
                {m.foto_url ? (
                  <img src={m.foto_url} alt={m.nombre} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-700">
                    <Users className="w-8 h-8 opacity-40" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-base truncate">
                  {m.nombre} {m.apellidos}
                </h3>
                <p className="text-xs text-brand-400 font-medium line-clamp-2 mt-0.5">{m.cargo}</p>
                <div className="flex items-center gap-2 mt-3">
                  {m.instagram_url && <Instagram className="w-3.5 h-3.5 text-neutral-400" />}
                  {m.linkedin_url && <Linkedin className="w-3.5 h-3.5 text-neutral-400" />}
                </div>
              </div>
            </div>

            {m.especialidades && m.especialidades.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {m.especialidades.map(esp => (
                  <span key={esp} className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 text-neutral-400 border border-white/5">
                    {esp}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/5">
              <button
                onClick={() => handleOpenEdit(m)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5 text-brand-400" />
                Editar
              </button>
              <button
                onClick={() => handleDelete(m.id, `${m.nombre} ${m.apellidos}`)}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
