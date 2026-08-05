// src/components/portal/admin/GestionarCatalogoForm.tsx
'use client'

import { useState, useRef } from 'react'
import {
  crearEjercicioCatalogoAction,
  editarEjercicioCatalogoAction,
  eliminarEjercicioCatalogoAction
} from '@/app/portal/admin/actions'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, Check, ShieldAlert, X, Image as ImageIcon, Video, Filter, Dumbbell, Layers } from 'lucide-react'

interface EjercicioCatalogo {
  id: string
  nombre: string
  descripcion: string | null
  grupo_muscular: string
  familia: string | null
  imagen_url: string | null
  video_url: string | null
}

interface GestionarCatalogoFormProps {
  catalogo: EjercicioCatalogo[]
}

const GRUPOS_MUSCULARES = [
  'Tren Superior',
  'Tren Inferior',
  'Core',
  'Cardio',
  'Pliometría',
  'Fisioterapia / Movilidad'
]

const FAMILIAS_SUGERIDAS = [
  'Sentadilla',
  'Peso Muerto',
  'Bisagra de Cadera',
  'Zancadas',
  'Press',
  'Jalón / Remo',
  'Plancha / Core',
  'Cardio',
  'Pliometría',
  'Movilidad / Fisioterapia',
]

export default function GestionarCatalogoForm({ catalogo: initialCatalogo }: GestionarCatalogoFormProps) {
  const [catalogo, setCatalogo] = useState<EjercicioCatalogo[]>(initialCatalogo)
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [activeFamiliaFilter, setActiveFamiliaFilter] = useState('Todas')

  // Ref para desplazar la vista al formulario
  const formRef = useRef<HTMLDivElement>(null)

  // Modales y paneles
  const [showFormPanel, setShowFormPanel] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Estados de subida multimedia
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)

  // Campos del formulario
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [grupoMuscular, setGrupoMuscular] = useState('Tren Inferior')
  const [familia, setFamilia] = useState('')
  const [imagenUrl, setImagenUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Familias dinámicas (las que ya existen en el catálogo + las sugeridas)
  const familiasExistentes = Array.from(
    new Set([
      ...FAMILIAS_SUGERIDAS,
      ...catalogo.map(e => e.familia).filter(Boolean) as string[]
    ])
  ).sort()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'imagen' | 'video') => {
    const file = e.target.files?.[0]
    if (!file) return

    if (type === 'imagen') {
      setUploadingImage(true)
    } else {
      setUploadingVideo(true)
    }
    setError(null)

    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `${type}s/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('ejercicios-multimedia')
        .upload(filePath, file)

      if (uploadError) {
        throw new Error(`Error al subir: ${uploadError.message}`)
      }

      const { data: { publicUrl } } = supabase.storage
        .from('ejercicios-multimedia')
        .getPublicUrl(filePath)

      if (type === 'imagen') {
        setImagenUrl(publicUrl)
      } else {
        setVideoUrl(publicUrl)
      }
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.message : 'Error al subir el archivo a Supabase Storage'
      setError(message)
    } finally {
      if (type === 'imagen') {
        setUploadingImage(false)
      } else {
        setUploadingVideo(false)
      }
    }
  }

  const handleStartCreate = () => {
    setEditingId(null)
    setNombre('')
    setDescripcion('')
    setGrupoMuscular('Tren Inferior')
    setFamilia('')
    setImagenUrl('')
    setVideoUrl('')
    setError(null)
    setShowFormPanel(true)

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  const handleStartEdit = (ej: EjercicioCatalogo) => {
    setEditingId(ej.id)
    setNombre(ej.nombre)
    setDescripcion(ej.descripcion || '')
    setGrupoMuscular(ej.grupo_muscular)
    setFamilia(ej.familia || '')
    setImagenUrl(ej.imagen_url || '')
    setVideoUrl(ej.video_url || '')
    setError(null)
    setShowFormPanel(true)

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  const handleCancel = () => {
    setShowFormPanel(false)
    setEditingId(null)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    if (editingId) {
      const result = await editarEjercicioCatalogoAction({
        id: editingId,
        nombre,
        descripcion,
        grupoMuscular,
        familia: familia || undefined,
        imagenUrl,
        videoUrl
      })

      if (result.success) {
        setCatalogo(prev =>
          prev.map(item =>
            item.id === editingId
              ? { ...item, nombre, descripcion, grupo_muscular: grupoMuscular, familia: familia || null, imagen_url: imagenUrl || null, video_url: videoUrl || null }
              : item
          )
        )
        setSuccessMessage('¡Ejercicio del catálogo editado con éxito!')
        setShowFormPanel(false)
        setEditingId(null)
        setTimeout(() => setSuccessMessage(null), 4000)
      } else {
        setError(result.error || 'Error al editar el ejercicio')
      }
    } else {
      const result = await crearEjercicioCatalogoAction({
        nombre,
        descripcion,
        grupoMuscular,
        familia: familia || undefined,
        imagenUrl,
        videoUrl
      })

      if (result.success) {
        const newEjercicio: EjercicioCatalogo = {
          id: Math.random().toString(),
          nombre,
          descripcion,
          grupo_muscular: grupoMuscular,
          familia: familia || null,
          imagen_url: imagenUrl || null,
          video_url: videoUrl || null
        }
        setCatalogo(prev => [newEjercicio, ...prev].sort((a, b) => a.nombre.localeCompare(b.nombre)))
        setSuccessMessage('¡Nuevo ejercicio agregado al catálogo!')
        setShowFormPanel(false)
        setTimeout(() => setSuccessMessage(null), 4000)
      } else {
        setError(result.error || 'Error al crear el ejercicio')
      }
    }
    setLoading(false)
  }

  const handleDelete = async (id: string, nombreEj: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar "${nombreEj}" del catálogo maestro?`)) return

    setLoading(true)
    const result = await eliminarEjercicioCatalogoAction(id)
    setLoading(false)

    if (result.success) {
      setCatalogo(prev => prev.filter(item => item.id !== id))
      setSuccessMessage('¡Ejercicio eliminado del catálogo!')
      setTimeout(() => setSuccessMessage(null), 4000)
    } else {
      setError(result.error || 'Error al eliminar el ejercicio')
    }
  }

  // Filtrado por grupo muscular y familia
  const filteredCatalogo = catalogo
    .filter(item => activeFilter === 'Todos' || item.grupo_muscular === activeFilter)
    .filter(item => activeFamiliaFilter === 'Todas' || item.familia === activeFamiliaFilter)

  // Familias disponibles según el filtro de grupo actual
  const familiasEnFiltro = Array.from(
    new Set(
      catalogo
        .filter(item => activeFilter === 'Todos' || item.grupo_muscular === activeFilter)
        .map(item => item.familia)
        .filter(Boolean) as string[]
    )
  ).sort()

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fade-in">
      {successMessage && (
        <div className="p-4 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center gap-3 text-brand-400 text-sm">
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

      {/* Cabecera de catálogo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">Catálogo de Ejercicios Clínicos</h2>
          <p className="text-sm text-neutral-400">
            Administra los ejercicios preconfigurados que tu equipo médico puede asignar en un clic.
          </p>
        </div>
        <button
          onClick={handleStartCreate}
          className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors text-xs font-bold shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Agregar Ejercicio Nuevo
        </button>
      </div>

      {/* Editor Panel Flotante */}
      {showFormPanel && (
        <div ref={formRef} className="glass-dark border border-brand-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl -z-10" />

          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-brand-400" />
              {editingId ? 'Editar Ejercicio del Catálogo' : 'Agregar Nuevo Ejercicio Maestro'}
            </h3>
            <button onClick={handleCancel} className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Nombre del Ejercicio</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Sentadilla Búlgara"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50 transition-colors"
                />
              </div>

              {/* Grupo Muscular */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Grupo Muscular / Categoría</label>
                <select
                  value={grupoMuscular}
                  onChange={(e) => setGrupoMuscular(e.target.value)}
                  className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50 transition-colors cursor-pointer"
                >
                  {GRUPOS_MUSCULARES.map(g => (
                    <option key={g} value={g} className="bg-neutral-900">{g}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Familia */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-brand-400" />
                Familia de Ejercicio <span className="text-neutral-600 normal-case font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                list="familias-list"
                placeholder="Ej: Sentadilla, Peso Muerto, Press..."
                value={familia}
                onChange={(e) => setFamilia(e.target.value)}
                className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50 transition-colors"
              />
              <datalist id="familias-list">
                {familiasExistentes.map(f => (
                  <option key={f} value={f} />
                ))}
              </datalist>
              <p className="text-[11px] text-neutral-600">Agrupa variantes del mismo movimiento. Ej: todas las sentadillas van en "Sentadilla".</p>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Descripción del Ejercicio / Pauta de Ejecución</label>
              <textarea
                rows={3}
                placeholder="Explica la técnica, alineación o enfoque clínico del ejercicio..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50 transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Imagen URL */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-neutral-500" />
                    Imagen URL (Opcional)
                  </span>
                  {uploadingImage ? (
                    <span className="text-[10px] text-brand-400 animate-pulse font-mono font-bold">Subiendo...</span>
                  ) : (
                    <label className="text-[10px] text-brand-400 hover:text-brand-300 font-bold cursor-pointer transition-colors border border-brand-500/30 px-2 py-0.5 rounded-lg bg-brand-500/5 hover:bg-brand-500/10">
                      Subir Imagen Local
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'imagen')}
                        className="hidden"
                      />
                    </label>
                  )}
                </label>
                <input
                  type="url"
                  placeholder="https://ejemplo.com/foto.jpg"
                  value={imagenUrl}
                  onChange={(e) => setImagenUrl(e.target.value)}
                  className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50 transition-colors"
                />
              </div>

              {/* Vídeo URL */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-neutral-500" />
                    Vídeo URL (Opcional)
                  </span>
                  {uploadingVideo ? (
                    <span className="text-[10px] text-brand-400 animate-pulse font-mono font-bold">Subiendo...</span>
                  ) : (
                    <label className="text-[10px] text-brand-400 hover:text-brand-300 font-bold cursor-pointer transition-colors border border-brand-500/30 px-2 py-0.5 rounded-lg bg-brand-500/5 hover:bg-brand-500/10">
                      Subir Vídeo Local
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileUpload(e, 'video')}
                        className="hidden"
                      />
                    </label>
                  )}
                </label>
                <input
                  type="url"
                  placeholder="YouTube, Vimeo o archivo local (.mp4)"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full bg-[#080c0a]/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="py-2.5 px-5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="py-2.5 px-6 rounded-xl text-xs font-bold bg-white text-black hover:bg-neutral-200 transition-colors disabled:opacity-50 cursor-pointer shadow-lg"
              >
                {loading ? 'Guardando...' : editingId ? 'Guardar Cambios' : 'Agregar al Catálogo'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Filtros ─────────────────────────────────────────────────── */}
      <div className="space-y-2">
        {/* Filtro por Grupo Muscular */}
        <div className="flex flex-wrap gap-2 items-center bg-white/5 p-2 rounded-2xl border border-white/5">
          <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-500 pl-2 pr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Grupo:
          </span>
          <button
            onClick={() => { setActiveFilter('Todos'); setActiveFamiliaFilter('Todas') }}
            className={`py-1.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'Todos'
                ? 'bg-white text-black font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Todos
          </button>
          {GRUPOS_MUSCULARES.map(g => (
            <button
              key={g}
              onClick={() => { setActiveFilter(g); setActiveFamiliaFilter('Todas') }}
              className={`py-1.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === g
                  ? 'bg-white text-black font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Filtro por Familia (solo si hay familias en el grupo seleccionado) */}
        {familiasEnFiltro.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center bg-white/[0.02] p-2 rounded-xl border border-white/[0.04]">
            <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-600 pl-2 pr-1 flex items-center gap-1">
              <Layers className="w-3 h-3" />
              Familia:
            </span>
            <button
              onClick={() => setActiveFamiliaFilter('Todas')}
              className={`py-1 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeFamiliaFilter === 'Todas'
                  ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                  : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
              }`}
            >
              Todas
            </button>
            {familiasEnFiltro.map(f => (
              <button
                key={f}
                onClick={() => setActiveFamiliaFilter(f)}
                className={`py-1 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeFamiliaFilter === f
                    ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid de Ejercicios */}
      {filteredCatalogo.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center border border-white/5">
          <Dumbbell className="w-12 h-12 text-neutral-600 mx-auto mb-4 opacity-30 animate-pulse" />
          <p className="text-sm text-neutral-500">No hay ejercicios en esta categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCatalogo.map(ej => (
            <div
              key={ej.id}
              className="glass rounded-3xl border border-white/5 overflow-hidden flex flex-col justify-between hover:border-brand-500/25 hover:shadow-xl hover:shadow-black/30 transition-all duration-300 group"
            >
              {/* Imagen/Placeholder */}
              <div className="relative aspect-video w-full bg-neutral-900 border-b border-white/5 overflow-hidden">
                {ej.imagen_url ? (
                  <img
                    src={ej.imagen_url}
                    alt={ej.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-700 gap-2">
                    <Dumbbell className="w-10 h-10 opacity-30" />
                    <span className="text-[10px] font-mono opacity-50">Sin imagen de demostración</span>
                  </div>
                )}

                {/* Categoría Badge */}
                <span className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-wider bg-[#080c0a]/80 border border-white/5 px-2 py-0.5 rounded text-brand-400">
                  {ej.grupo_muscular}
                </span>

                {/* Video Indicator */}
                {ej.video_url && (
                  <span
                    className="absolute top-3 right-3 p-1 rounded bg-brand-500/20 border border-brand-500/30 text-brand-400"
                    title="Vídeo demostración disponible"
                  >
                    <Video className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              {/* Contenido */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <h4 className="text-base font-bold text-white tracking-tight">{ej.nombre}</h4>

                  {/* Familia badge */}
                  {ej.familia && (
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-neutral-500" />
                      <span className="text-[11px] text-neutral-500 font-medium">{ej.familia}</span>
                    </div>
                  )}

                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                    {ej.descripcion || 'Sin descripción de técnica todavía.'}
                  </p>
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-4">
                  <button
                    onClick={() => handleStartEdit(ej)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-brand-500/10 text-neutral-400 hover:text-brand-400 border border-white/5 hover:border-brand-500/30 transition-all cursor-pointer inline-flex items-center justify-center"
                    title="Editar ejercicio"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(ej.id, ej.nombre)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 border border-white/5 hover:border-red-500/30 transition-all cursor-pointer inline-flex items-center justify-center"
                    title="Eliminar del catálogo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
