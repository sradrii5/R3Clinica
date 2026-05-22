// src/components/portal/entreno/EjerciciosList.tsx
'use client'

import { useState } from 'react'
import { Dumbbell, Play, X, Video, Info } from 'lucide-react'

interface Ejercicio {
  id: string
  nombre: string
  series: number
  repeticiones: string
  imagen_url: string | null
  video_url: string | null
  notas: string | null
}

interface EjerciciosListProps {
  ejercicios: Ejercicio[]
}

export default function EjerciciosList({ ejercicios }: EjerciciosListProps) {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null)
  const [selectedVideoNombre, setSelectedVideoNombre] = useState<string | null>(null)

  const handleOpenVideo = (url: string, nombre: string) => {
    setSelectedVideoUrl(url)
    setSelectedVideoNombre(nombre)
  }

  const handleCloseVideo = () => {
    setSelectedVideoUrl(null)
    setSelectedVideoNombre(null)
  }

  // Utilidad para extraer el ID de YouTube y renderizar un embed compatible
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null
    
    // Regex para diferentes formatos de URL de YouTube
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1`
    }
    
    return null
  }

  // Utilidad para extraer el ID de Vimeo y renderizar un embed compatible
  const getVimeoEmbedUrl = (url: string) => {
    if (!url) return null
    
    const regExp = /vimeo\.com\/(?:video\/)?([0-9]+)/
    const match = url.match(regExp)
    
    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}?autoplay=1`
    }
    
    return null
  }

  return (
    <div className="space-y-6">
      {/* Grid de Ejercicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ejercicios.map((ej, index) => (
          <div 
            key={ej.id} 
            className="glass rounded-3xl overflow-hidden border border-white/5 flex flex-col justify-between hover:border-brand-500/20 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 group"
          >
            <div>
              {/* Imagen o visualización */}
              <div className="relative w-full aspect-video bg-neutral-950 overflow-hidden border-b border-white/5">
                {ej.imagen_url ? (
                  <img
                    src={ej.imagen_url}
                    alt={ej.nombre}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-700 gap-2">
                    <Dumbbell className="w-8 h-8 opacity-35" />
                    <span className="text-xs font-mono opacity-50">Visualización no disponible</span>
                  </div>
                )}

                {/* Botón de reproducción superpuesto si hay vídeo */}
                {ej.video_url && (
                  <button
                    onClick={() => handleOpenVideo(ej.video_url!, ej.nombre)}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  >
                    <div className="w-14 h-14 bg-brand-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-brand-500/20">
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </div>
                  </button>
                )}
              </div>

              {/* Contenido */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className="text-[10px] font-mono font-bold text-brand-400/80 bg-brand-500/5 border border-brand-500/10 px-2.5 py-1 rounded-md uppercase">
                    Nº {index + 1}
                  </span>
                  
                  <div className="flex items-center gap-4 text-sm text-neutral-300 font-mono">
                    <div>
                      <span className="text-[9px] text-neutral-500 block uppercase tracking-wider mb-0.5">Series</span>
                      <span className="font-bold text-white text-base">{ej.series || '---'}</span>
                    </div>
                    <div className="text-neutral-700">|</div>
                    <div>
                      <span className="text-[9px] text-neutral-500 block uppercase tracking-wider mb-0.5">Reps</span>
                      <span className="font-bold text-white text-base">{ej.repeticiones || '---'}</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-brand-400 transition-colors">
                  {ej.nombre}
                </h3>
                
                {ej.notas ? (
                  <p className="text-xs text-neutral-400 leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/5 whitespace-pre-line">
                    {ej.notas}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Fila de acción inferior para ver el vídeo */}
            {ej.video_url && (
              <div className="px-6 pb-6 pt-2">
                <button
                  onClick={() => handleOpenVideo(ej.video_url!, ej.nombre)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white/5 hover:bg-brand-500/10 border border-white/10 hover:border-brand-500/20 text-xs font-semibold text-neutral-200 hover:text-brand-400 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Ver Demostración en Vídeo
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox / Modal de Vídeo Flotante Premium */}
      {selectedVideoUrl && (
        <div className="fixed inset-0 bg-[#060807]/95 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in">
          {/* Fondo para cerrar */}
          <div className="absolute inset-0 cursor-pointer" onClick={handleCloseVideo} />

          {/* Caja del Modal */}
          <div className="relative w-full max-w-4xl bg-neutral-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]">
            
            {/* Cabecera del modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-neutral-900/50">
              <div className="flex items-center gap-2 text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                <Video className="w-4 h-4 text-brand-400" />
                Ejecución Correcta: <span className="text-white font-bold">{selectedVideoNombre}</span>
              </div>
              <button 
                onClick={handleCloseVideo}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer bg-white/5 hover:bg-white/10 p-1.5 rounded-xl border border-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenedor de reproducción */}
            <div className="bg-black flex-1 flex items-center justify-center p-2">
              {getYouTubeEmbedUrl(selectedVideoUrl) ? (
                <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
                  <iframe
                    src={getYouTubeEmbedUrl(selectedVideoUrl)!}
                    title={selectedVideoNombre || 'Video Demostración'}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : getVimeoEmbedUrl(selectedVideoUrl) ? (
                <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
                  <iframe
                    src={getVimeoEmbedUrl(selectedVideoUrl)!}
                    title={selectedVideoNombre || 'Video Demostración'}
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                /* Reproductor nativo optimizado. Lazy load estricto */
                <video
                  src={selectedVideoUrl}
                  controls
                  autoPlay
                  preload="none"
                  className="w-full max-h-[65vh] rounded-2xl bg-black border border-white/5 focus:outline-none"
                >
                  Tu navegador no soporta la reproducción de video.
                </video>
              )}
            </div>

            {/* Pie del modal descriptivo */}
            <div className="px-6 py-3 border-t border-white/5 bg-neutral-900/50 text-[10px] text-neutral-500 font-mono flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-neutral-600" />
              <span>Carga de vídeo optimizada vía CDN streaming. Consumo de datos eficiente.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
