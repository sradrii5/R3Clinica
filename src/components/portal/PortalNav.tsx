// src/components/portal/PortalNav.tsx
'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  LayoutDashboard, Dumbbell, Salad, LogOut, User,
  ShieldAlert, CalendarDays, MessageSquare
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { cn } from '@/lib/utils'

const BASE_NAV_ITEMS = [
  { href: '/portal', label: 'Inicio', icon: LayoutDashboard },
  { href: '/portal/entreno', label: 'Entrenamiento', icon: Dumbbell },
  { href: '/portal/nutricion', label: 'Nutrición', icon: Salad },
  { href: '/portal/perfil', label: 'Perfil', icon: User },
]

const ADMIN_NAV_ITEMS = [
  { href: '/portal', label: 'Inicio', icon: LayoutDashboard },
  { href: '/portal/admin', label: 'Administración', icon: ShieldAlert },
  { href: '/portal/admin?tab=calendario', label: 'Calendario Global', icon: CalendarDays },
  { href: '/portal/admin?tab=comunicaciones', label: 'Comunicaciones', icon: MessageSquare },
  { href: '/portal/perfil', label: 'Perfil', icon: User },
]

interface PortalNavProps {
  nombre: string
  apellidos: string
  esAdmin?: boolean
}

export default function PortalNav({ nombre, apellidos, esAdmin = false }: PortalNavProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentTab = searchParams.get('tab')
  const navItems = esAdmin ? ADMIN_NAV_ITEMS : BASE_NAV_ITEMS

  const isItemActive = (href: string) => {
    if (href.includes('?tab=')) {
      const itemTab = href.split('?tab=')[1]
      return pathname === '/portal/admin' && currentTab === itemTab
    }
    if (href === '/portal/admin') {
      return pathname === '/portal/admin' && (!currentTab || (currentTab !== 'calendario' && currentTab !== 'comunicaciones'))
    }
    return pathname === href
  }

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* Desktop: barra lateral */}
      <aside className="hidden sm:flex flex-col fixed left-0 top-0 h-full w-60 glass-dark border-r border-white/5 px-4 py-6 z-40">
        {/* Logo */}
        <Link href="/" className="text-xl font-black text-white mb-8 px-2">
          R3<span className="gradient-text">Clinica</span>
        </Link>

        {/* Usuario */}
        <div className="px-2 mb-8">
          <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">
            {esAdmin ? 'Modo Administrador' : 'Bienvenido'}
          </p>
          <p className="text-sm font-semibold text-white truncate">{nombre} {apellidos}</p>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isItemActive(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <button
          id="portal-logout"
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </aside>

      {/* Desktop offset */}
      <div className="hidden sm:block w-60 shrink-0" />

      {/* Mobile: barra inferior */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 glass-dark border-t border-white/5 flex justify-around py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isItemActive(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200',
                active ? 'text-brand-400' : 'text-neutral-500'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] line-clamp-1">{label}</span>
            </Link>
          )
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-500 cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[10px]">Salir</span>
        </button>
      </nav>
    </>
  )
}
