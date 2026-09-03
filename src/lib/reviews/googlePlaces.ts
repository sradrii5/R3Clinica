// src/lib/reviews/googlePlaces.ts
// ─────────────────────────────────────────────────────────────────────────────
//  Reseñas reales de Google (Places API New). Solo servidor — nunca importar
//  en componentes de cliente. La respuesta se cachea vía fetch + revalidate
//  para no golpear la API en cada visita.
// ─────────────────────────────────────────────────────────────────────────────

export interface GoogleReview {
  author: string
  time: string
  rating: number
  text: string
  initials: string
}

export interface GoogleReviewsData {
  rating: number
  userRatingCount: number
  reviews: GoogleReview[]
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('')
}

/**
 * Obtiene rating agregado y reseñas de texto desde Places API (New).
 * Devuelve null si faltan credenciales o la API no responde con datos
 * (p. ej. billing/SKU "Enterprise + Atmosphere" aún no activo en Cloud Console).
 * Cachea 12h vía Next.js fetch cache.
 */
export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  const apiKey = process.env.GOOGLE_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID

  if (!apiKey || !placeId) return null

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?languageCode=es`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
        },
        next: { revalidate: 259200 }, // 3 días
      }
    )

    if (!res.ok) {
      console.warn('[getGoogleReviews] Respuesta no OK de Places API:', res.status)
      return null
    }

    const data = await res.json()

    const reviews: GoogleReview[] = (data.reviews ?? [])
      .filter((r: { text?: { text?: string } }) => r.text?.text)
      .map((r: {
        authorAttribution?: { displayName?: string }
        relativePublishTimeDescription?: string
        rating?: number
        text?: { text?: string }
      }) => {
        const author = r.authorAttribution?.displayName || 'Cliente de Google'
        return {
          author,
          time: r.relativePublishTimeDescription || '',
          rating: r.rating ?? 5,
          text: r.text?.text ?? '',
          initials: getInitials(author),
        }
      })

    if (typeof data.rating !== 'number' || reviews.length === 0) {
      return null
    }

    return {
      rating: data.rating,
      userRatingCount: data.userRatingCount ?? 0,
      reviews,
    }
  } catch (err) {
    console.error('[getGoogleReviews] Error al obtener reseñas:', err)
    return null
  }
}
