import { createClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import ServiciosGrid from '@/components/home/ServiciosGrid'
import CtaEmpresasSection from '@/components/home/CtaEmpresasSection'
import TestimoniosSection from '@/components/home/TestimoniosSection'

export const revalidate = 3600 // ISR: revalida cada hora

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch en paralelo para máxima performance
  const [{ data: servicios }, { data: testimonios }] = await Promise.all([
    supabase
      .from('servicios')
      .select('*')
      .eq('activo', true)
      .order('orden'),
    supabase
      .from('testimonios')
      .select('*')
      .eq('publicado', true)
      .order('destacado', { ascending: false })
      .limit(9),
  ])

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServiciosGrid servicios={servicios ?? []} />
        <CtaEmpresasSection />
        <TestimoniosSection testimonios={testimonios ?? []} />
      </main>
      <Footer />
    </>
  )
}
