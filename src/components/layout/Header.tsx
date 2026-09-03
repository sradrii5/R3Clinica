'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Menu, X, MessageCircle, User, ChevronDown,
  Dumbbell, Activity, ShieldCheck, Apple, Sparkles, HeartHandshake,
  Building2, ClipboardCheck, Smartphone, Cpu, Trophy
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SERVICIOS_CATALOGO } from '@/data/servicios'

const NAV_LINKS = [
  { href: '/',                    label: 'Inicio' },
  { href: '/servicios',           label: 'Servicios' },
  { href: '/metodo-r3',           label: 'Método R3' },
  { href: '/el-centro',           label: 'El centro' },
  { href: '/equipo',              label: 'Equipo' },
  { href: '/blog',                label: 'Blog' },
]

const ICON_MAP: Record<string, LucideIcon> = {
  Dumbbell, Activity, ShieldCheck, Apple, Sparkles, HeartHandshake,
  Building2, ClipboardCheck, Smartphone, Cpu, Trophy
}

// Mismos 4 grupos que el filtro de /servicios
const SERVICIOS_GROUPS = [
  { title: 'Entrenamiento & Preparación', categorias: ['entrenamiento', 'preparacion', 'valoraciones'] },
  { title: 'Fisioterapia & Readaptación', categorias: ['fisioterapia', 'readaptacion'] },
  { title: 'Nutrición, Antiaging & Biohacking', categorias: ['nutricion', 'antiaging', 'biohacking'] },
  { title: 'Mujer, Empresas & Online', categorias: ['mujer', 'empresas', 'online'] },
].map((grupo) => ({
  ...grupo,
  items: SERVICIOS_CATALOGO
    .filter((s) => grupo.categorias.includes(s.categoria))
    .sort((a, b) => a.orden - b.orden),
}))

import { WA_NUMBER } from '@/lib/contact/whatsapp'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-[#060908]/90 backdrop-blur-xl border-b border-white/[0.06] py-3'
            : 'bg-transparent py-5'
        )}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0" aria-label="R3Clínicas — Inicio">
            <img
              src="/r3_logo_transparent.png"
              alt="R3 Clínicas Logo"
              className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-black tracking-tight text-white">
                R3<span className="text-brand-400">Clínicas</span>
              </span>
              <span className="hidden sm:block w-px h-5 bg-white/20" />
              <span className="hidden sm:block text-[9px] uppercase tracking-[0.15em] text-neutral-400 font-semibold leading-tight">
                Rehabilitación<br />Readaptación<br />Rendimiento
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.label === 'Servicios' ? (
                <li key={link.href} className="relative group">
                  <Link
                    href={link.href}
                    className="relative px-3 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors duration-200 flex items-center gap-1"
                  >
                    {link.label}
                    <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                    <span className="absolute bottom-0 left-3 right-3 h-px bg-brand-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Link>

                  {/* Desplegable de servicios agrupados */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                    <div className="w-[700px] max-w-[90vw] rounded-2xl border border-white/10 bg-[#0a0d0b]/98 backdrop-blur-xl shadow-2xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
                      {SERVICIOS_GROUPS.map((grupo) => (
                        <div key={grupo.title} className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-400 mb-1.5">
                            {grupo.title}
                          </span>
                          {grupo.items.map((s) => {
                            const Icon = ICON_MAP[s.icono] || Dumbbell
                            return (
                              <Link
                                key={s.id}
                                href={`/servicios/${s.slug}`}
                                className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg px-2 py-1.5 -mx-2 transition-colors"
                              >
                                <Icon className="w-3.5 h-3.5 text-brand-500/70 shrink-0" />
                                {s.nombre}
                              </Link>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              ) : (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="relative px-3 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors duration-200 group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-3 right-3 h-px bg-brand-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Link>
                </li>
              )
            )}
          </ul>

          {/* Desktop actions group */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/portal"
              className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-brand-400/40 text-neutral-300 hover:text-white text-sm font-bold transition-all duration-200"
              aria-label="Acceder al Área Cliente"
            >
              <User className="w-3.5 h-3.5" />
              Área Cliente
            </Link>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=Hola%2C%20me%20gustar%C3%ADa%20pedir%20m%C3%A1s%20informaci%C3%B3n%20sobre%20R3Clinica.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-brand-400 hover:bg-brand-300 text-black text-sm font-bold transition-all duration-200 hover:scale-105 rounded-none"
              id="header-whatsapp-cta"
              aria-label="Contactar por WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2 -mr-2"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            id="mobile-menu-toggle"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </header>

      {/* Mobile menu — full screen overlay */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={cn(
          'fixed inset-0 z-40 bg-[#060908]/98 backdrop-blur-2xl flex flex-col items-start justify-center px-8 gap-2 transition-all duration-300 md:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <span className="text-xs uppercase tracking-[0.3em] text-neutral-600 mb-6">Navegación</span>
        {NAV_LINKS.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="text-4xl font-black text-white hover:text-brand-400 transition-colors duration-150 leading-tight"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {link.label}
          </Link>
        ))}
        {/* Mobile Portal Link */}
        <Link
          href="/portal"
          onClick={() => setOpen(false)}
          className="text-4xl font-black text-brand-400 hover:text-brand-300 transition-colors duration-150 leading-tight mt-2 flex items-center gap-2"
          style={{ animationDelay: `${NAV_LINKS.length * 60}ms` }}
        >
          <User className="w-8 h-8" />
          Área Cliente
        </Link>
        <div className="mt-8 w-full h-px bg-white/10" />
        <a
          href={`https://wa.me/${WA_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-brand-400 hover:bg-brand-300 text-black font-bold text-lg transition-colors"
          id="mobile-whatsapp-cta"
        >
          <MessageCircle className="w-5 h-5" />
          WhatsApp
        </a>
      </div>
    </>
  )
}
