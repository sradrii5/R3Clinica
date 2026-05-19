// src/components/portal/admin/CrearClienteForm.tsx
'use client'

import { useState } from 'react'
import { crearClienteAction } from '@/app/portal/admin/actions'
import { UserPlus, Copy, Check, ShieldAlert } from 'lucide-react'

export default function CrearClienteForm() {
  const [email, setEmail] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [objetivo, setObjetivo] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [successData, setSuccessData] = useState<{ email: string; password?: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessData(null)

    const result = await crearClienteAction({ email, nombre, apellidos, objetivo })

    setLoading(false)
    if (result.success && result.email) {
      setSuccessData({ email: result.email, password: result.password })
      // Limpiar formulario
      setEmail('')
      setNombre('')
      setApellidos('')
      setObjetivo('')
    } else {
      setError(result.error || 'Ocurrió un error inesperado al registrar el cliente.')
    }
  }

  const handleCopyCredentials = () => {
    if (!successData) return
    const text = `¡Hola! Aquí tienes tus credenciales de acceso para el portal de R3Clinica:\n\n🔗 Enlace: ${window.location.origin}/login\n📧 Usuario: ${successData.email}\n🔑 Contraseña Temporal: ${successData.password}\n\nPor favor, inicia sesión y actualiza tu contraseña en tu perfil.`;
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-xl mx-auto glass-dark border border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl -z-10" />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-2xl">
          <UserPlus className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Registrar Nuevo Cliente</h2>
          <p className="text-sm text-neutral-400">Crea una cuenta de acceso inmediata en el sistema.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 text-red-400 text-sm">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successData ? (
        <div className="p-6 bg-brand-500/10 border border-brand-500/20 rounded-2xl text-center space-y-4">
          <div className="w-12 h-12 bg-brand-500/20 border border-brand-500/30 text-brand-400 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">¡Cliente Registrado con Éxito!</h3>
            <p className="text-sm text-neutral-400">
              La cuenta se ha creado y se ha preconfigurado una rutina de adaptación inicial.
            </p>
          </div>

          <div className="p-4 bg-[#080c0a]/60 border border-white/5 rounded-xl space-y-2 text-left text-sm font-mono">
            <div><span className="text-neutral-500">Email:</span> <span className="text-white">{successData.email}</span></div>
            <div><span className="text-neutral-500">Contraseña:</span> <span className="text-brand-400 font-bold">{successData.password}</span></div>
          </div>

          <button
            onClick={handleCopyCredentials}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 bg-brand-500 text-black hover:bg-brand-400 hover:shadow-lg hover:shadow-brand-500/20"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                ¡Copiado al portapapeles!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar credenciales para enviar
              </>
            )}
          </button>

          <button
            onClick={() => setSuccessData(null)}
            className="w-full py-2.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            Registrar otro cliente
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-widest">Nombre</label>
              <input
                type="text"
                required
                placeholder="Carlos"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-[#080c0a]/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-brand-500/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-widest">Apellidos</label>
              <input
                type="text"
                required
                placeholder="García"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                className="w-full bg-[#080c0a]/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-brand-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-widest">Email de Acceso</label>
            <input
              type="email"
              required
              placeholder="cliente@r3clinica.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#080c0a]/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-brand-500/50 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-widest">Objetivo Deportivo/Salud</label>
            <textarea
              required
              rows={3}
              placeholder="Optimización metabólica, ganancia de masa muscular magra y mejora en biomarcadores cardiovasculares..."
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              className="w-full bg-[#080c0a]/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-brand-500/50 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-semibold transition-all duration-300 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Dar de Alta Cliente
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
