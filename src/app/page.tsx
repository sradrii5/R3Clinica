import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getGoogleReviews } from '@/lib/reviews/googlePlaces'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import ServiciosGrid from '@/components/home/ServiciosGrid'
import CtaEmpresasSection from '@/components/home/CtaEmpresasSection'
import TestimoniosSection from '@/components/home/TestimoniosSection'

export const metadata: Metadata = {
  title: 'R3Clínicas — Tu Centro Deportivo y de Salud en Valladolid',
  description:
    'Centro de alto rendimiento en entrenamiento personal, fisioterapia, nutrición y readaptación funcional. Resultados medibles y duraderos.',
}

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch en paralelo para máxima performance
  const [{ data: servicios }, { data: testimonios }, googleReviews] = await Promise.all([
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
    getGoogleReviews(),
  ])

  return (
    <>
      <Header />
      <main>
        <HeroSection googleReviews={googleReviews} />
        <ServiciosGrid servicios={servicios ?? []} />
        <CtaEmpresasSection />
        <TestimoniosSection testimonios={testimonios ?? []} />
      </main>
      <Footer />
    </>
  )
}
