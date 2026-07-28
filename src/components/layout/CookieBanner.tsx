'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie, X, Check } from 'lucide-react'

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('r3_cookie_consent')
    if (!consent) {
      // Retardo suave para no tapar la primera impresión del hero inmediatamente
      const timer = setTimeout(() => setShow(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem('r3_cookie_consent', 'accepted')
    setShow(false)
  }

  const handleEssentialOnly = () => {
    localStorage.setItem('r3_cookie_consent', 'essential_only')
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso sobre cookies"
      className="fixed bottom-6 inset-x-4 sm:left-6 sm:right-auto z-50 max-w-md animate-fade-in"
    >
      <div className="glass rounded-3xl p-6 border border-brand-500/20 bg-[#080c0a]/95 shadow-2xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Cookie className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Valoramos tu Privacidad</h3>
          </div>
          <button
            onClick={handleEssentialOnly}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Cerrar aviso de cookies"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed">
          Utilizamos cookies propias y de análisis para garantizar la seguridad de tu sesión en nuestro portal y mejorar tu experiencia de navegación. Consulta nuestra{' '}
          <Link href="/cookies" className="text-brand-400 underline hover:text-brand-300">
            Política de Cookies
          </Link>{' '}
          para más información.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <button
            onClick={handleAcceptAll}
            className="flex-1 py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-brand-500/20 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            Aceptar Todas
          </button>
          <button
            onClick={handleEssentialOnly}
            className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Sólo Esenciales
          </button>
        </div>
      </div>
    </div>
  )
}
