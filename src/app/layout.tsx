import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'R3Clínicas — Rehabilitación, Readaptación y Rendimiento',
    template: '%s | R3Clínicas',
  },
  description:
    'Centro de alto rendimiento en rehabilitación, readaptación funcional, entrenamiento personal, fisioterapia y nutrición.',
  keywords: [
    'entrenamiento personal',
    'fisioterapia',
    'nutrición deportiva',
    'biohacking',
    'anti-aging',
    'readaptación funcional',
    'R3Clinica',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://r3clinica.com'),
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'R3Clinica',
    title: 'R3Clinica — Entrenamiento, Fisioterapia y Nutrición',
    description:
      'Centro de alto rendimiento en entrenamiento personal, fisioterapia, nutrición, readaptación, anti-aging y biohacking.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'R3Clinica' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'R3Clinica — Entrenamiento, Fisioterapia y Nutrición',
    description:
      'Centro de alto rendimiento en entrenamiento personal, fisioterapia, nutrición y biohacking.',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
}

import CookieBanner from '@/components/layout/CookieBanner'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="bg-neutral-950 text-neutral-50 antialiased" suppressHydrationWarning>
        {children}
        <Analytics />
        <CookieBanner />
      </body>
    </html>
  )
}
