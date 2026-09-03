// src/components/portal/admin/GestionarGaleriaForm.tsx
'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Images, Upload, Check, AlertCircle, Loader2, Image as ImageIcon, Eye, EyeOff } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import {
  crearInstalacionAction,
  editarInstalacionAction,
  eliminarInstalacionAction,
  alternarActivoInstalacionAction,
} from '@/app/portal/admin/instalaciones-actions'

interface Instalacion {
  id: string
  titulo: string
  descripcion: string | null
  imagen_url: string
  activo: boolean
  orden: number
}

interface GestionarGaleriaFormProps {
  instalacionesInicial: Instalacion[]
}

export default function GestionarGaleriaForm({ instalacionesInicial }: GestionarGaleriaFormProps) {
  const [instalaciones, setInstalaciones] = useState<Instalacion[]>(instalacionesInicial)
  const [showFormPanel, setShowFormPanel] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [imagenUrl, setImagenUrl] = useState('')

  const [uploadingImage, setUploadingImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const resetForm = () => {
    setTitulo('')
    setDescripcion('')
    setImagenUrl('')
    setEditingId(null)
    setError(null)
  }

  const handleOpenNew = () => {
    resetForm()
    setShowFormPanel(true)
  }

  const handleOpenEdit = (item: Instalacion) => {
    resetForm()
    setEditingId(item.id)
    setTitulo(item.titulo)
    setDescripcion(item.descripcion || '')
    setImagenUrl(item.imagen_url)
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
      const fileName = `centro-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`
      const filePath = `centro/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('ejercicios-multimedia')
        .upload(filePath, file)

      if (uploadError) throw new Error(uploadError.message)

      const { data: publicData } = supabase.storage
        .from('ejercicios-multimedia')
        .getPublicUrl(filePath)

      setImagenUrl(publicData.publicUrl)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir la fotografía'
      setError(msg)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titulo.trim() || !imagenUrl.trim()) {
      setError('Por favor, añade un título y una fotografía.')
      return
    }

    setLoading(true)
    setError(null)

    if (editingId) {
      const result = await editarInstalacionAction({ id: editingId, titulo, descripcion, imagenUrl })

      if (result.success) {
        setInstalaciones(prev => prev.map(item => item.id === editingId
          ? { ...item, titulo, descripcion: descripcion || null, imagen_url: imagenUrl }
          : item
        ))
        setSuccessMessage('¡Foto actualizada con éxito!')
        setShowFormPanel(false)
        resetForm()
        setTimeout(() => setSuccessMessage(null), 4000)
      } else {
        setError(result.error || 'Error al actualizar')
      }
    } else {
      const result = await crearInstalacionAction({ titulo, descripcion, imagenUrl })

      if (result.success) {
        const nuevo: Instalacion = {
          id: Math.random().toString(),
          titulo,
          descripcion: descripcion || null,
          imagen_url: imagenUrl,
          activo: true,
          orden: instalaciones.length + 1,
        }
        setInstalaciones(prev => [...prev, nuevo])
        setSuccessMessage('¡Foto añadida a la galería!')
        setShowFormPanel(false)
        resetForm()
        setTimeout(() => setSuccessMessage(null), 4000)
      } else {
        setError(result.error || 'Error al añadir')
      }
    }

    setLoading(false)
  }

  const handleDelete = async (id: string, titulo: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar "${titulo}" de la galería?`)) return

    setLoading(true)
    const result = await eliminarInstalacionAction(id)
    setLoading(false)

    if (result.success) {
      setInstalaciones(prev => prev.filter(item => item.id !== id))
      setSuccessMessage('¡Foto eliminada!')
      setTimeout(() => setSuccessMessage(null), 4000)
    } else {
      setError(result.error || 'Error al eliminar')
    }
  }

  const handleToggleActivo = async (item: Instalacion) => {
    const nuevoEstado = !item.activo
    const result = await alternarActivoInstalacionAction(item.id, nuevoEstado)
    if (result.success) {
      setInstalaciones(prev => prev.map(i => i.id === item.id ? { ...i, activo: nuevoEstado } : i))
    } else {
      setError(result.error || 'Error al cambiar la visibilidad')
    }
  }

  return (
    <div className="space-y-8">
      {/* Barra superior de acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass p-6 rounded-3xl border border-white/5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Images className="w-5 h-5 text-brand-400" />
            Galería del Centro
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Gestiona las fotos que se ven en la página pública `/el-centro`.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Añadir Foto
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-3 animate-fade-in">
          <Check className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {showFormPanel && (
        <div className="glass rounded-3xl p-6 sm:p-8 border border-brand-500/20 bg-[#080c0a]/90 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white">
              {editingId ? 'Editar Foto' : 'Añadir Foto a la Galería'}
            </h3>
            <button
              onClick={() => setShowFormPanel(false)}
              className="text-xs text-neutral-400 hover:text-white px-3 py-1 rounded-lg bg-white/5"
            >
              Cancelar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Título *
              </label>
              <input
                type="text"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                placeholder="Ej: Sala de entrenamiento funcional"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Descripción (opcional)
              </label>
              <textarea
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                rows={2}
                placeholder="Breve descripción del espacio..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Fotografía *
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {imagenUrl ? (
                  <div className="relative w-32 h-24 rounded-2xl overflow-hidden glass border border-brand-500/30">
                    <img src={imagenUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-32 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-600">
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
                    value={imagenUrl}
                    onChange={e => setImagenUrl(e.target.value)}
                    placeholder="O pega una URL externa de imagen..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-300"
                  />
                </div>
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
                {editingId ? 'Guardar Cambios' : 'Guardar Foto'}
              </button>
            </div>
          </form>
        </div>
      )}

      {instalaciones.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center border border-white/5 space-y-3">
          <Images className="w-10 h-10 text-neutral-600 mx-auto opacity-30" />
          <p className="text-sm font-semibold text-neutral-300">La galería está vacía.</p>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Pulsa &quot;Añadir Foto&quot; para que aparezca la primera imagen en `/el-centro`.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {instalaciones.map(item => (
            <div
              key={item.id}
              className="glass rounded-3xl border border-white/5 overflow-hidden flex flex-col justify-between hover:border-white/10 transition-all"
            >
              <div className="relative aspect-video w-full bg-neutral-900 overflow-hidden">
                <img src={item.imagen_url} alt={item.titulo} className="w-full h-full object-cover" />
                {!item.activo && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300 bg-black/60 px-3 py-1 rounded-full border border-white/10">
                      Oculta
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <h3 className="font-bold text-white text-base truncate">{item.titulo}</h3>
                  {item.descripcion && (
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{item.descripcion}</p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => handleToggleActivo(item)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                    title={item.activo ? 'Ocultar de la web' : 'Mostrar en la web'}
                  >
                    {item.activo ? <Eye className="w-3.5 h-3.5 text-brand-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-brand-400" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.titulo)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
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
