'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowRight, ChevronDown, MessageCircle, Star, ShieldCheck,
  ChevronLeft, ChevronRight, Users, Activity, Award
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GoogleReviewsData } from '@/lib/reviews/googlePlaces'

import { WA_NUMBER } from '@/lib/contact/whatsapp'

const TICKER_ITEMS = [
  'Entrenamiento Personal',
  'Fisioterapia',
  'Nutrición Deportiva',
  'Readaptación Funcional',
  'Anti-Aging',
  'Biohacking',
]

// Fallback mientras no haya reseñas reales de Google (billing/SKU pendiente)
const DEMO_REVIEWS = [
  {
    author: 'Carlos M.',
    role: 'Cliente de Readaptación',
    time: 'Hace 2 semanas',
    rating: 5,
    text: 'Llegué con un dolor lumbar crónico que me impedía entrenar. En menos de 2 meses con el programa integrado de fisio y entrenamiento, estoy totalmente libre de dolor y levantando peso sin miedo. Un 10.',
    initials: 'CM'
  },
  {
    author: 'Elena R.',
    role: 'Cliente de Fisioterapia y Nutrición',
    time: 'Hace 1 mes',
    rating: 5,
    text: 'El nivel de profesionalidad y la atención personalizada desde la valoración inicial es insuperable. El plan adaptado y la nutrición me han cambiado el rendimiento por completo.',
    initials: 'ER'
  },
  {
    author: 'Javier G.',
    role: 'Cliente de Entrenamiento Personal',
    time: 'Hace 3 semanas',
    rating: 5,
    text: 'Buscaba un centro serio donde entrenar sin lesionarme. El seguimiento continuo y las evaluaciones periódicas me dan una seguridad enorme. Resultados reales y medibles.',
    initials: 'JG'
  },
  {
    author: 'Marta P.',
    role: 'Cliente de Recuperación de Espalda',
    time: 'Hace 1 mes',
    rating: 5,
    text: 'Después de probar muchos sitios, aquí me explicaron el porqué de mi dolor y trazamos un plan por fases. El 100% de dedicación por parte del equipo. Totalmente recomendable.',
    initials: 'MP'
  }
]

interface HeroSectionProps {
  googleReviews?: GoogleReviewsData | null
}

interface ReviewItem {
  author: string
  role?: string
  time: string
  rating: number
  text: string
  initials: string
}

export default function HeroSection({ googleReviews }: HeroSectionProps) {
  const isRealData = !!googleReviews && googleReviews.reviews.length > 0
  const reviews: ReviewItem[] = isRealData ? googleReviews!.reviews : DEMO_REVIEWS
  const ratingAvg = isRealData ? googleReviews!.rating : 4.9
  const ratingCount = isRealData ? googleReviews!.userRatingCount : 150

  const IMPACT_STATS = [
    {
      number: '+50',
      label: 'Clientes satisfechos',
      desc: 'Planes activos y objetivos cumplidos',
      icon: Users
    },
    {
      number: '11',
      label: 'Especialidades',
      desc: 'Entrenamiento, fisioterapia, nutrición y más',
      icon: Activity
    },
    {
      number: `${ratingAvg.toFixed(1)} ★`,
      label: 'Google Reviews',
      desc: isRealData
        ? `${ratingCount} opiniones verificadas`
        : `Más de ${ratingCount} opiniones verificadas`,
      icon: Award
    }
  ]

  const [activeReview, setActiveReview] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const handleNextReview = useCallback(() => {
    setActiveReview((prev) => (prev + 1) % reviews.length)
  }, [reviews.length])

  const handlePrevReview = useCallback(() => {
    setActiveReview((prev) => (prev - 1 + reviews.length) % reviews.length)
  }, [reviews.length])

  // Auto-slide carousel every 4.5 seconds (paused on hover)
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(handleNextReview, 4500)
    return () => clearInterval(timer)
  }, [isPaused, handleNextReview])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between overflow-hidden"
      aria-label="Presentación principal R3Clinica"
    >
      {/* ── Background ── */}
      <div className="absolute inset-0 bg-[#060908]" aria-hidden="true">
        {/* Diagonal ruled lines */}
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
      <div className="relative z-10 flex-1 flex items-center pt-28 pb-16">
        <div className="max-w-7xl mx-auto w-full px-6 space-y-12">
          
          {/* Header block */}
          <div className="max-w-3xl flex flex-col gap-8">
            {/* Badge */}
            <div className="reveal delay-100 flex items-center gap-3">
              <span className="w-8 h-px bg-brand-400" />
              <span className="text-brand-400 text-xs font-bold uppercase tracking-[0.25em]">
                Tu Centro Deportivo · Valladolid
              </span>
            </div>

            {/* Headline */}
            <h1 className="reveal delay-200 text-[clamp(2.75rem,7.5vw,6rem)] font-black leading-[0.9] tracking-tight uppercase">
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
                href={`https://wa.me/${WA_NUMBER}?text=Hola%2C%20me%20gustar%C3%ADa%20reservar%20mi%20valoraci%C3%B3n%20gratuita`}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-cta-whatsapp"
                className="flex items-center justify-center gap-2 px-8 py-4 border border-brand-400/40 hover:border-brand-400 text-brand-300 hover:text-white bg-brand-500/5 hover:bg-brand-500/10 font-bold text-base transition-all duration-200 shadow-lg shadow-brand-500/5"
              >
                <MessageCircle className="w-4 h-4 text-brand-400" />
                Reservar valoración gratuita
              </a>
            </div>
          </div>

          {/* ── Impact Stats & Google Reviews Carousel Section ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-white/5 items-start">

            {/* Datos impactantes (3 stats) */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              {IMPACT_STATS.map((stat, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-500/20 transition-all group flex items-start gap-4"
                >
                  <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 group-hover:scale-110 transition-transform shrink-0">
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white tracking-tight leading-none group-hover:text-brand-400 transition-colors">
                      {stat.number}
                    </div>
                    <div className="text-xs font-bold text-neutral-300 mt-1">{stat.label}</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">{stat.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Google Reviews Carousel Auto-sliding */}
            <div
              className="lg:col-span-7"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="h-full p-6 sm:p-7 rounded-3xl bg-white/[0.02] border border-white/10 relative overflow-hidden flex flex-col justify-between group">
                
                {/* Header Carousel: Google badge */}
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    {/* Google G Logo SVG */}
                    <div className="w-7 h-7 rounded-lg bg-white p-1.5 flex items-center justify-center shadow-sm">
                      <svg className="w-full h-full" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-xs font-bold text-white">
                        <span>Google Reviews</span>
                        <span className="text-amber-400 font-mono">{ratingAvg.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                        <span className="text-[10px] text-neutral-400 ml-1">Verificadas</span>
                      </div>
                    </div>
                  </div>

                  {/* Nav controls */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePrevReview}
                      aria-label="Reseña anterior"
                      className="p-1.5 rounded-lg border border-white/10 hover:border-white/20 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextReview}
                      aria-label="Siguiente reseña"
                      className="p-1.5 rounded-lg border border-white/10 hover:border-white/20 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Body Carousel: Reseña activa (altura fija para que las stats de al lado no salten) */}
                <div className="py-4 my-auto relative h-[120px] sm:h-[104px] flex flex-col justify-center overflow-hidden">
                  <p className="text-sm sm:text-base text-neutral-200 italic leading-relaxed line-clamp-4 sm:line-clamp-3 transition-opacity duration-300">
                    &quot;{reviews[activeReview].text}&quot;
                  </p>
                </div>

                {/* Footer Carousel: Autor + Indicadores de navegación */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 flex items-center justify-center font-bold text-xs">
                      {reviews[activeReview].initials}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        {reviews[activeReview].author}
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                      </div>
                      {reviews[activeReview].role ? (
                        <div className="text-[10px] text-neutral-400">{reviews[activeReview].role}</div>
                      ) : (
                        <div className="text-[10px] text-neutral-400">{reviews[activeReview].time}</div>
                      )}
                    </div>
                  </div>

                  {/* Dots indicator */}
                  <div className="flex items-center gap-1.5">
                    {reviews.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveReview(idx)}
                        aria-label={`Ver reseña ${idx + 1}`}
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                          activeReview === idx ? "w-6 bg-brand-400" : "w-1.5 bg-white/20 hover:bg-white/40"
                        )}
                      />
                    ))}
                  </div>
                </div>

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
