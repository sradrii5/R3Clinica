// src/components/portal/perfil/CambiarPasswordForm.tsx
'use client'

import { useState } from 'react'
import { actualizarPasswordPropiaAction } from '@/app/portal/perfil/actions'
import { Lock, Eye, EyeOff, Check, AlertCircle } from 'lucide-react'

export default function CambiarPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    const result = await actualizarPasswordPropiaAction(password)
    setLoading(false)

    if (result.success) {
      setSuccess(true)
      setPassword('')
      setConfirmPassword('')
      // Cerrar formulario tras unos segundos
      setTimeout(() => {
        setIsOpen(false)
        setSuccess(false)
      }, 3000)
    } else {
      setError(result.error)
    }
  }

  if (!isOpen) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-3 px-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-xs font-semibold text-neutral-300 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Lock className="w-3.5 h-3.5" />
          ¿Deseas cambiar tu contraseña de acceso?
        </button>
        <div className="text-[10px] text-neutral-500 text-center leading-relaxed">
          Para realizar modificaciones en tu perfil clínico, por favor ponte en contacto directo con la administración de R3Clinica.
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-[#080c0a]/60 border border-white/5 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <span className="text-xs font-bold text-white flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-brand-400" />
          Cambiar Contraseña
        </span>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-[10px] text-neutral-500 hover:text-white transition-colors cursor-pointer"
        >
          Cancelar
        </button>
      </div>

      {success && (
        <div className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center gap-2 text-brand-400 text-xs animate-fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>¡Contraseña actualizada correctamente!</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-xs animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-3">
        {/* Contraseña */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Nueva Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-3 pr-10 py-2 text-xs text-white focus:outline-none focus:border-brand-500/50 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirmar Contraseña */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Confirmar Contraseña</label>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="Repite la contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500/50 transition-colors"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 rounded-xl text-xs font-bold bg-white text-black hover:bg-neutral-200 transition-colors disabled:opacity-50 cursor-pointer shadow-md"
      >
        {loading ? (
          <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin inline-block" />
        ) : (
          'Actualizar Contraseña'
        )}
      </button>
    </form>
  )
}
