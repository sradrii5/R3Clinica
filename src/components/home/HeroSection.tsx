'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown, MessageCircle } from 'lucide-react'

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? '34600000000'

const STATS = [
  { value: '+500', label: 'Clientes activos' },
  { value: '8', label: 'Especialistas' },
  { value: '98%', label: 'Satisfacción' },
  { value: '+10', label: 'Años de experiencia' },
]

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) videoRef.current.play().catch(() => { })
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Fondo degradado animado */}
      <div className="absolute inset-0 bg-[#080c0a]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(34,197,94,0.12),transparent)]" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(34,197,94,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-8 pt-24">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-medium text-brand-400 border border-brand-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Centro de Alto Rendimiento · Valladolid
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-none tracking-tight">
          Tu cuerpo,{' '}
          <span className="gradient-text block sm:inline">optimizado</span>
          <br />
          al máximo nivel
        </h1>

        <p className="text-lg text-neutral-400 max-w-2xl leading-relaxed">
          Entrenamiento personal, fisioterapia, nutrición, readaptación y biohacking.
          Un enfoque integral para atletas que buscan la excelencia.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            href="/contacto"
            id="hero-cta-primary"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold text-lg transition-all duration-200 hover:scale-105 glow-green"
          >
            Pide tu cita
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20R3Clinica`}
            target="_blank"
            rel="noopener noreferrer"
            id="hero-cta-whatsapp"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-full glass hover:border-brand-500/40 text-white font-semibold text-lg transition-all duration-200 hover:scale-105"
          >
            <MessageCircle className="w-5 h-5 text-brand-400" />
            WhatsApp
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden mt-8 w-full max-w-3xl">
          {STATS.map((s) => (
            <div key={s.label} className="bg-[#080c0a] px-6 py-5 text-center">
              <p className="text-3xl font-black gradient-text">{s.value}</p>
              <p className="text-xs text-neutral-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-neutral-600 animate-bounce">
        <span className="text-xs uppercase tracking-widest">Descubre</span>
        <ChevronDown className="w-5 h-5" />
      </div>
    </section>
  )
}
