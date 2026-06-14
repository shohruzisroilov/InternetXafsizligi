'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ShieldIcon, EmojiWrapper } from '@/components/Icons'

interface IntroScreenProps {
  onStart: () => void
}

const FLOATING_ICONS = [
  { emoji: '🔒', top: '10%', left: '4%',   delay: '0s',   dur: '3s',   depth: 0.04 },
  { emoji: '💻', top: '18%', right: '6%',  delay: '0.5s', dur: '3.5s', depth: 0.07 },
  { emoji: '📱', top: '68%', left: '2%',   delay: '1s',   dur: '2.8s', depth: 0.05 },
  { emoji: '🌐', top: '72%', right: '4%',  delay: '1.5s', dur: '4s',   depth: 0.09 },
  { emoji: '⭐', top: '44%', left: '1%',   delay: '0.8s', dur: '3.2s', depth: 0.03 },
  { emoji: '✅', top: '38%', right: '2%',  delay: '1.2s', dur: '2.5s', depth: 0.06 },
  { emoji: '🎯', top: '84%', left: '44%',  delay: '0.3s', dur: '3.8s', depth: 0.08 },
  { emoji: '🔑', top: '5%',  left: '48%',  delay: '0.7s', dur: '3.3s', depth: 0.05 },
  { emoji: '🌈', top: '55%', right: '10%', delay: '0.4s', dur: '4.2s', depth: 0.10 },
  { emoji: '🎓', top: '28%', left: '14%',  delay: '1.1s', dur: '3.7s', depth: 0.06 },
]

const getBgType = (emoji: string): 'blue' | 'purple' | 'orange' | 'green' | 'yellow' | 'pink' | 'glass' => {
  switch (emoji) {
    case '🔒': case '🔑': return 'orange'
    case '💻': case '📱': return 'blue'
    case '🌐': return 'glass'
    case '⭐': return 'yellow'
    case '✅': case '🎯': return 'green'
    case '🌈': return 'pink'
    case '🎓': return 'purple'
    default: return 'glass'
  }
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  const [isStarting, setIsStarting]   = useState(false)
  const [mounted, setMounted]         = useState(false)
  const [mousePos, setMousePos]       = useState({ x: 0, y: 0 })
  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null)
  const cardRef  = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = sceneRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    setMousePos({ x, y })
    if (cardRef.current) {
      cardRef.current.style.transform =
        `perspective(900px) rotateX(${(-y * 14).toFixed(2)}deg) rotateY(${(x * 14).toFixed(2)}deg) translateZ(8px)`
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 0, y: 0 })
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
    }
  }, [])

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isStarting) return
    const btn  = e.currentTarget
    const rect = btn.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    const el   = document.createElement('span')
    el.className = 'ripple'
    el.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`
    btn.appendChild(el)
    el.addEventListener('animationend', () => el.remove())
    setIsStarting(true)
    setTimeout(onStart, 700)
  }

  return (
    <div
      ref={sceneRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(135deg, #fef9c3 0%, #dbeafe 40%, #fce7f3 70%, #dcfce7 100%)',
        backgroundSize: '300% 300%',
        animation: 'gradientShift 8s ease infinite',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Big soft blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full opacity-50 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #fde047, transparent)', animation: 'morph-bg 10s ease-in-out infinite' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-40 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #86efac, transparent)', animation: 'morph-bg 12s ease-in-out 2s infinite' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #c4b5fd, transparent)', animation: 'morph-bg 9s ease-in-out 1s infinite' }} />

      {/* Floating icons with parallax */}
      {mounted && FLOATING_ICONS.map((icon, i) => (
        <div
          key={i}
          className="absolute select-none hidden md:block"
          style={{
            top:   icon.top,
            left:  'left'  in icon ? icon.left  : undefined,
            right: 'right' in icon ? icon.right : undefined,
            animation: `float ${icon.dur} ease-in-out ${icon.delay} infinite`,
            transform: `translate(${mousePos.x * icon.depth * -260}px, ${mousePos.y * icon.depth * -260}px) scale(${hoveredIcon === i ? 1.25 : 1})`,
            transition: 'transform 0.15s ease-out',
            zIndex: hoveredIcon === i ? 10 : 1,
          }}
          onMouseEnter={() => setHoveredIcon(i)}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          <EmojiWrapper emoji={icon.emoji} bgType={getBgType(icon.emoji)} size="md" />
        </div>
      ))}

      {/* Main card */}
      <div
        ref={cardRef}
        className={`relative z-10 mx-4 max-w-md w-full rounded-3xl p-8 md:p-10 text-center transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
          border: '3px solid rgba(255,255,255,0.8)',
          transition: 'transform 0.12s ease-out, opacity 0.5s ease',
        }}
      >
        {/* Shine */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ background: `radial-gradient(circle at ${50 + mousePos.x * 50}% ${50 + mousePos.y * 50}%, rgba(255,255,255,0.6) 0%, transparent 60%)` }} />

        {/* Shield */}
        <div className="flex justify-center mb-4">
          <ShieldIcon className="w-24 h-24" animate={true} />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black mb-2 leading-tight" style={{ color: '#1e293b' }}>
          Internet
          <br />
          <span style={{ color: '#f59e0b' }}>Xavfsizligi</span>
        </h1>

        {/* Simple subtitle */}
        <p className="text-lg font-bold mb-6" style={{ color: '#64748b' }}>
          O&apos;yin orqali o&apos;rgan! 🎮
        </p>

        {/* Info pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-7">
          {[
            { label: '📚 3 dars', bg: '#dbeafe', color: '#1d4ed8' },
            { label: '🎮 5 savol', bg: '#fce7f3', color: '#be185d' },
            { label: '🏆 Mukofot', bg: '#dcfce7', color: '#15803d' },
          ].map((p, i) => (
            <span key={i} className="text-sm font-black px-4 py-1.5 rounded-full hover:scale-110 hover:-translate-y-1 transition-all duration-200"
              style={{ background: p.bg, color: p.color }}>
              {p.label}
            </span>
          ))}
        </div>

        {/* Start button */}
        <button
          onClick={handleButtonClick}
          disabled={isStarting}
          className="ripple-host btn-3d w-full py-5 rounded-2xl text-xl font-black text-white transition-all duration-200 hover:-translate-y-1"
          style={{
            background: isStarting ? '#86efac' : 'linear-gradient(135deg, #22c55e, #16a34a)',
            boxShadow: isStarting ? 'none' : '0 8px 0 #166534, 0 10px 24px rgba(34,197,94,0.4)',
          }}
        >
          {isStarting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                style={{ animation: 'spin-slow 0.8s linear infinite' }} />
              Yuklanmoqda...
            </span>
          ) : 'Boshlash 🚀'}
        </button>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 30 C360 60 1080 0 1440 30 L1440 60 L0 60 Z" fill="rgba(255,255,255,0.5)" />
        </svg>
      </div>
    </div>
  )
}
