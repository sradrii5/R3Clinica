'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/servicios',   label: 'Servicios' },
  { href: '/biohacking',  label: 'Biohacking' },
  { href: '/empresas',    label: 'Empresas' },
  { href: '/equipo',      label: 'Equipo' },
  { href: '/contacto',    label: 'Contacto' },
]

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? '34600000000'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-500',
          scrolled ? 'glass-dark py-3' : 'bg-transparent py-5'
        )}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tight">
              R3<span className="gradient-text">Clinica</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-neutral-400 hover:text-white transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-500 group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA WhatsApp */}
          <a
            href={`https://wa.me/${WA_NUMBER}?text=Hola%2C%20me%20gustar%C3%ADa%20pedir%20m%C3%A1s%20informaci%C3%B3n%20sobre%20R3Clinica.`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-[#25D366]/20 hover:scale-105"
            id="header-whatsapp-cta"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menú"
            id="mobile-menu-toggle"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 glass-dark flex flex-col items-center justify-center gap-8 transition-all duration-300 md:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="text-3xl font-bold text-white hover:text-brand-400 transition-colors"
          >
            {link.label}
          </Link>
        ))}
        <a
          href={`https://wa.me/${WA_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#128C7E] transition-colors text-white font-semibold text-lg"
          id="mobile-whatsapp-cta"
        >
          <MessageCircle className="w-5 h-5" />
          WhatsApp
        </a>
      </div>
    </>
  )
}
