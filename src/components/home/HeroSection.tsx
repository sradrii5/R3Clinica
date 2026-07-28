'use client'

import Link from 'next/link'
import { ArrowRight, ChevronDown, MessageCircle } from 'lucide-react'

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? '34600000000'

const TICKER_ITEMS = [
  'Entrenamiento Personal',
  'Fisioterapia',
  'Nutrición Deportiva',
  'Readaptación Funcional',
  'Anti-Aging',
  'Biohacking',
]

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden"
      aria-label="Presentación principal R3Clinica"
    >
      {/* ── Background ── */}
      <div className="absolute inset-0 bg-[#060908]" aria-hidden="true">
        {/* Diagonal ruled lines — technical, not blobby */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'repeating-linear-gradient(135deg, rgba(52,211,153,0.6) 0px, rgba(52,211,153,0.6) 1px, transparent 1px, transparent 60px)',
          }}
        />
        {/* Single focused radial on top-left */}
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #34d399 0%, transparent 70%)' }}
        />
        {/* Hard accent stripe — right edge */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-400/30 to-transparent" />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 pt-28 pb-16">
          <div className="max-w-3xl">

            {/* Left — Primary content */}
            <div className="flex flex-col gap-8">
              {/* Badge */}
              <div className="reveal delay-100 flex items-center gap-3">
                <span className="w-8 h-px bg-brand-400" />
                <span className="text-brand-400 text-xs font-bold uppercase tracking-[0.25em]">
                  Tu Centro Deportivo · Valladolid
                </span>
              </div>

              {/* Headline — massive, no rounded softness */}
              <h1 className="reveal delay-200 text-[clamp(3rem,8vw,6.5rem)] font-black leading-[0.9] tracking-tight uppercase">
                Tu cuerpo<br />
                <span className="gradient-text">optimizado</span><br />
                al máximo.
              </h1>

              {/* Body */}
              <p className="reveal delay-300 text-neutral-400 text-base sm:text-lg leading-relaxed max-w-xl">
                Todo comienza con una evaluación inicial. Diseñamos un plan personalizado que integra entrenamiento, fisioterapia, nutrición y seguimiento continuo para ayudarte a conseguir resultados medibles y duraderos.
              </p>

              {/* CTAs */}
              <div className="reveal delay-400 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contacto"
                  id="hero-cta-primary"
                  className="group flex items-center justify-center gap-2 px-8 py-4 bg-brand-400 hover:bg-brand-300 text-black font-bold text-base transition-all duration-200 hover:scale-[1.02] glow-brand"
                  aria-label="Pide tu cita en R3Clinica"
                >
                  Pide tu cita
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20R3Clinica`}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="hero-cta-whatsapp"
                  className="flex items-center justify-center gap-2 px-8 py-4 border border-white/10 hover:border-brand-400/50 text-white hover:text-brand-400 font-semibold text-base transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Ticker strip ── */}
      <div
        className="relative z-10 border-t border-white/[0.06] py-3 overflow-hidden select-none"
        aria-hidden="true"
      >
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-6 px-6 text-xs uppercase tracking-[0.2em] text-neutral-600 font-medium whitespace-nowrap">
              <span className="w-1 h-1 rounded-full bg-brand-400 flex-shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-16 left-8 hidden lg:flex flex-col items-center gap-1 text-neutral-700" aria-hidden="true">
        <span className="text-[10px] uppercase tracking-[0.3em]" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  )
}
