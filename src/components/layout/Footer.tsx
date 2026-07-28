import Link from 'next/link'
import { MessageCircle, Instagram, MapPin, Phone, Mail } from 'lucide-react'

import { WA_NUMBER } from '@/lib/contact/whatsapp'

const SERVICIOS = [
  { href: '/servicios#entrenamiento', label: 'Entrenamiento Personal' },
  { href: '/servicios#fisioterapia', label: 'Fisioterapia' },
  { href: '/servicios#nutricion', label: 'Nutrición Deportiva' },
  { href: '/servicios#readaptacion', label: 'Readaptación' },
  { href: '/biohacking', label: 'Biohacking' },
  { href: '/biohacking#antiaging', label: 'Anti-aging' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#060908]">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img src="/r3_logo_transparent.png" alt="R3 Clínicas Logo" className="h-9 w-auto object-contain" />
          </div>
          <div className="flex flex-col gap-1 text-sm text-neutral-500 font-medium">
            <p className="text-neutral-400 font-bold uppercase tracking-wider text-xs">Rehabilitación · Readaptación · Rendimiento</p>
            <p className="text-xs text-neutral-500">R3 Clínicas Fisioterapia y Entrenamiento personal</p>
          </div>
          <div className="flex gap-3 mt-2">
            <a
              href="https://www.instagram.com/r3clinicas/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2 rounded-none border border-white/10 hover:border-brand-400/40 text-neutral-400 hover:text-white transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="p-2 rounded-none border border-white/10 hover:border-brand-400/40 text-neutral-400 hover:text-brand-400 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Servicios */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 mb-4">Servicios</h3>
          <ul className="flex flex-col gap-2">
            {SERVICIOS.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="text-sm text-neutral-400 hover:text-white transition-colors">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Empresa */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 mb-4">R3Clinica</h3>
          <ul className="flex flex-col gap-2">
            {[
              { href: '/equipo', label: 'Nuestro Equipo' },
              { href: '/empresas', label: 'Para Empresas' },
              { href: '/contacto', label: 'Contacto' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-neutral-400 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 mb-4">Contacto</h3>
          <ul className="flex flex-col gap-3">
            <li className="flex items-start gap-2 text-sm text-neutral-400">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-brand-400" />
              <span>
                C. Divina Pastora, 5<br />
                47004 Valladolid
              </span>
            </li>
            <li className="flex items-center gap-2 text-sm text-neutral-400">
              <Phone className="w-4 h-4 shrink-0 text-brand-400" />
              +34 602 738 239
            </li>
            <li className="flex items-center gap-2 text-sm text-neutral-400">
              <Mail className="w-4 h-4 shrink-0 text-brand-400" />
              info@r3clinica.com
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 py-5 px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-neutral-600">
          © {new Date().getFullYear()} R3Clinica. Todos los derechos reservados.
        </p>
        <div className="flex gap-4 text-xs text-neutral-600">
          <Link href="/aviso-legal" className="hover:text-neutral-400 transition-colors">Aviso Legal</Link>
          <Link href="/privacidad" className="hover:text-neutral-400 transition-colors">Privacidad</Link>
          <Link href="/cookies" className="hover:text-neutral-400 transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  )
}
