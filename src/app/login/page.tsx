'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Mail, Lock, Loader2, Dumbbell } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Credenciales incorrectas. Comprueba tu email y contraseña.')
      setLoading(false)
      return
    }

    router.push('/portal')
    router.refresh()
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-brand-500/60 transition-all duration-200 text-sm'

  return (
    <div className="min-h-screen bg-[#080c0a] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.08),transparent)]" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 mb-4">
            <Dumbbell className="w-8 h-8 text-brand-400" />
          </div>
          <h1 className="text-2xl font-black text-white">
            R3<span className="gradient-text">Clinica</span>
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Área de clientes</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 border border-white/5">
          <h2 className="text-xl font-bold text-white mb-6">Accede a tu portal</h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
              <input
                id="login-email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`${inputClass} pl-10`}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
              <input
                id="login-password"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`${inputClass} pl-10`}
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold transition-all duration-200 hover:scale-[1.02] mt-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Entrando…</>
              ) : (
                'Acceder'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-neutral-600 mt-6">
            ¿Problemas para acceder?{' '}
            <a
              href="https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER ?? '34600000000'}"
              className="text-brand-400 hover:text-brand-300 underline"
            >
              Contacta con tu entrenador
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
