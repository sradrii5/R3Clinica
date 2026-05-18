'use client'

import { useEffect, useState } from 'react'

export default function LiveMonitor() {
  const [bpm, setBpm] = useState(58)
  const [hrv, setHrv] = useState(85)
  const [glucose, setGlucose] = useState(88)

  useEffect(() => {
    // Simula variación en tiempo real de los biomarcadores
    const interval = setInterval(() => {
      setBpm((prev) => {
        const next = prev + (Math.random() > 0.5 ? 1 : -1)
        return next > 65 ? 65 : next < 55 ? 55 : next
      })
      setHrv((prev) => {
        const next = prev + (Math.random() > 0.5 ? 2 : -2)
        return next > 95 ? 95 : next < 75 ? 75 : next
      })
      setGlucose((prev) => {
        const next = prev + (Math.random() > 0.5 ? 1 : -1)
        return next > 95 ? 95 : next < 80 ? 80 : next
      })
    }, 2500)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full aspect-video glass rounded-3xl overflow-hidden border-brand-500/20 flex flex-col bg-[#050805]">
      {/* Fondo de brillo suave */}
      <div className="absolute inset-0 bg-brand-500/5 blur-3xl" />

      {/* Header */}
      <div className="flex items-center justify-between p-6 z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
          </div>
          <span className="text-xs font-mono text-brand-400 uppercase tracking-widest">Biometric Link Active</span>
        </div>
        <span className="text-xs font-mono text-neutral-500 uppercase">Status: Optimal</span>
      </div>

      {/* Contenido / Stats */}
      <div className="grid grid-cols-3 gap-4 px-6 z-10 flex-1">
        <div>
          <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mb-1">Resting HR</p>
          <div className="flex items-end gap-1.5">
            <span className="text-3xl font-black text-white">{bpm}</span>
            <span className="text-xs text-neutral-400 font-mono mb-1">bpm</span>
          </div>
        </div>
        <div>
          <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mb-1">HRV Score</p>
          <div className="flex items-end gap-1.5">
            <span className="text-3xl font-black text-brand-400">{hrv}</span>
            <span className="text-xs text-neutral-400 font-mono mb-1">ms</span>
          </div>
        </div>
        <div>
          <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mb-1">Glucose</p>
          <div className="flex items-end gap-1.5">
            <span className="text-3xl font-black text-white">{glucose}</span>
            <span className="text-xs text-neutral-400 font-mono mb-1">mg/dL</span>
          </div>
        </div>
      </div>

      {/* Animación EKG (SVG) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-brand-500/20 to-transparent" />
        <svg 
          className="w-[200%] h-full stroke-brand-500 opacity-80" 
          style={{ animation: 'slideLeft 4s linear infinite' }} 
          viewBox="0 0 1000 100" 
          preserveAspectRatio="none"
        >
          {/* El path simula dos ciclos cardíacos para que al hacer loop encaje */}
          <path
            d="M 0 50 L 100 50 L 120 20 L 140 90 L 160 10 L 180 70 L 200 50 L 400 50 L 420 20 L 440 90 L 460 10 L 480 70 L 500 50 L 700 50 L 720 20 L 740 90 L 760 10 L 780 70 L 800 50 L 1000 50"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
          />
        </svg>
      </div>

      {/* Animación custom definida en un tag style */}
      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
