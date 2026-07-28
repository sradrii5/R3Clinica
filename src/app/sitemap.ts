import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://r3clinica.com'

  const routes = [
    '',
    '/servicios',
    '/entrenamiento',
    '/equipo',
    '/empresas',
    '/biohacking',
    '/blog',
    '/contacto',
    '/aviso-legal',
    '/privacidad',
    '/cookies',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route.startsWith('/servicios') || route === '/contacto' ? 0.9 : 0.7,
  }))
}
