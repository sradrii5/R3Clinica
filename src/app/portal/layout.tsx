import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import PortalNav from '@/components/portal/PortalNav'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Obtener el perfil del cliente
  const { data: perfil } = await supabase
    .from('perfiles')
    .select('nombre, apellidos, foto_url, es_admin')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-[#080c0a] flex flex-col">
      <PortalNav 
        nombre={perfil?.nombre ?? ''} 
        apellidos={perfil?.apellidos ?? ''} 
        esAdmin={perfil?.es_admin ?? false}
      />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-8">
        {children}
      </main>
    </div>
  )
}
