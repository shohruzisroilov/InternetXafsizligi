'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { LESSONS } from '@/lib/data'
import { LockIcon, UnlockIcon, WarningIcon, EmojiWrapper } from '@/components/Icons'

interface LearnScreenProps {
  currentLesson: number
  onNext: () => void
  onPrev: () => void
  onFinish: () => void
}

/* ─── Lock interactive ──────────────────────────────────── */
function LockInteractive() {
  const [isOpen, setIsOpen]     = useState(false)
  const [shaking, setShaking]   = useState(false)

  const toggle = () => {
    if (!isOpen) { setShaking(true); setTimeout(() => setShaking(false), 500) }
    setIsOpen(p => !p)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={toggle}
        className="transition-all duration-300 select-none flex items-center justify-center h-28 w-28"
        style={{
          animation: shaking ? 'shake 0.5s ease-in-out' : 'float-3d 5s ease-in-out infinite',
        }}
      >
        {isOpen ? (
          <UnlockIcon className="w-24 h-24" color="#ef4444" />
        ) : (
          <LockIcon className="w-24 h-24" color="#22c55e" />
        )}
      </button>

      <div className={`px-5 py-2.5 rounded-2xl text-base font-black text-center transition-all duration-300 ${isOpen ? 'bg-red-100 text-red-600 border-2 border-red-300' : 'bg-green-100 text-green-700 border-2 border-green-300'}`}>
        {isOpen ? '⚠️ Xavfli! Yoping!' : '👆 Bosib ko\'ring!'}
      </div>

      {/* Password strength */}
      <div className="flex gap-2">
        {[
          { pwd: '123456', color: '#ef4444', label: 'Zaif 😟' },
          { pwd: 'M@rv0n', color: '#f59e0b', label: 'O\'rta 😐' },
          { pwd: 'Tr#2!Xk', color: '#22c55e', label: 'Kuchli 😎' },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-1 group">
            <div className="h-3 w-14 rounded-full transition-all duration-300 group-hover:scale-y-125"
              style={{ background: item.color }} />
            <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: item.color }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Chat interactive ──────────────────────────────────── */
function ChatInteractive() {
  const [step, setStep]       = useState(0)
  const [typing, setTyping]   = useState(false)

  const messages = [
    { text: "Salom! Do'st bo'lamizmi? 😊", isStranger: true },
    { text: 'Manzilingni ayt! 🏠',          isStranger: true },
    { text: '🚫 Hech qachon aytma!',         isStranger: false },
  ]

  const next = () => {
    if (step >= messages.length - 1 || typing) return
    setTyping(true)
    setTimeout(() => { setStep(p => p + 1); setTyping(false) }, 700)
  }

  return (
    <div className="flex flex-col gap-2 w-full max-w-xs">
      {messages.slice(0, step + 1).map((msg, i) => (
        <div key={i}
          className={`px-4 py-2.5 rounded-2xl text-base font-bold max-w-[85%] animate-bounce-in ${msg.isStranger ? 'bg-white text-gray-700 self-start rounded-tl-none shadow-md' : 'self-end rounded-tr-none text-white'}`}
          style={{
            background: msg.isStranger ? 'white' : 'linear-gradient(135deg, #ef4444, #dc2626)',
            animationDelay: `${i * 0.1}s`,
          }}
        >
          {msg.text}
        </div>
      ))}

      {typing && (
        <div className="bg-white px-4 py-2.5 rounded-2xl rounded-tl-none self-start flex gap-1.5 shadow-md">
          {[0,1,2].map(i => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-gray-400"
              style={{ animation: `pulse-scale 1s ease-in-out ${i * 0.2}s infinite` }} />
          ))}
        </div>
      )}

      {step < messages.length - 1 && !typing && (
        <button onClick={next}
          className="mt-1 text-sm font-black px-4 py-2 rounded-xl self-center transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 btn-3d"
          style={{ background: '#dbeafe', color: '#1d4ed8', boxShadow: '0 4px 0 #1d4ed8' }}>
          Davom etish ▶
        </button>
      )}
    </div>
  )
}

/* ─── Warning interactive ───────────────────────────────── */
function WarningInteractive() {
  const [state, setState] = useState<'idle'|'warning'|'safe'>('idle')
  const [count, setCount] = useState(0)

  const handleClick = () => {
    const n = count + 1; setCount(n)
    if (n % 2 === 1) { setState('warning') }
    else { setState('safe'); setTimeout(() => setState('idle'), 1200) }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="select-none flex items-center justify-center cursor-pointer h-28 w-28"
        style={{
          animation: state === 'warning' ? 'shake 0.5s ease-in-out'
            : state === 'safe' ? 'bounce-in 0.4s ease-out'
            : 'float 2.5s ease-in-out infinite',
          transform: state === 'warning' ? 'scale(1.15)' : 'scale(1)',
          transition: 'transform 0.3s',
        }}
        onClick={handleClick}
      >
        {state === 'warning' ? (
          <EmojiWrapper emoji="🚫" bgType="orange" size="lg" />
        ) : state === 'safe' ? (
          <EmojiWrapper emoji="✅" bgType="green" size="lg" />
        ) : (
          <WarningIcon className="w-24 h-24" />
        )}
      </div>

      <div className={`px-4 py-2.5 rounded-2xl text-base font-black text-center transition-all duration-300 ${state === 'warning' ? 'bg-red-100 text-red-600 border-2 border-red-300' : state === 'safe' ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-orange-100 text-orange-700 border-2 border-orange-300'}`}>
        {state === 'warning' ? "❌ Xavfli havola!"
          : state === 'safe' ? "✅ To'g'ri qaror!"
          : "👆 Agar bossang nima bo'ladi?"}
      </div>

      {/* Fake URL */}
      <div className="flex items-center gap-2 rounded-xl px-3 py-2 w-full max-w-xs"
        style={{ background: state === 'warning' ? '#fef2f2' : '#f0fdf4', border: `2px solid ${state === 'warning' ? '#fca5a5' : '#86efac'}` }}>
        <span className="w-5 h-5 flex items-center justify-center">
          {state === 'warning' ? <WarningIcon className="w-5 h-5" /> : <LockIcon className="w-5 h-5" color="#16a34a" />}
        </span>
        <span className="text-xs font-mono font-bold truncate"
          style={{ color: state === 'warning' ? '#ef4444' : '#16a34a' }}>
          {state === 'warning' ? 'http://free-pr1ze.xyz' : 'https://google.com'}
        </span>
      </div>
    </div>
  )
}

/* ─── Main component ────────────────────────────────────── */
export default function LearnScreen({ currentLesson, onNext, onPrev, onFinish }: LearnScreenProps) {
  const [mounted, setMounted] = useState(false)
  const [tilt, setTilt]       = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const lesson       = LESSONS[currentLesson]
  const isLast       = currentLesson === LESSONS.length - 1
  const isFirst      = currentLesson === 0
  const progress     = ((currentLesson + 1) / LESSONS.length) * 100

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { setTilt({ x: 0, y: 0 }) }, [currentLesson])

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect()
    if (!r) return
    setTilt({ x: -((e.clientY - r.top) / r.height - 0.5) * 10, y: ((e.clientX - r.left) / r.width - 0.5) * 10 })
  }, [])

  // Lesson-specific accent colors (light theme)
  const ACCENTS = [
    { bg: '#eff6ff', border: '#bfdbfe', dot: '#3b82f6' },   // blue
    { bg: '#f5f3ff', border: '#ddd6fe', dot: '#8b5cf6' },   // purple
    { bg: '#fff7ed', border: '#fed7aa', dot: '#f97316' },   // orange
  ]
  const accent = ACCENTS[currentLesson] ?? ACCENTS[0]

  return (
    <div className="min-h-screen w-full flex flex-col"
      style={{ background: 'linear-gradient(160deg, #f0f9ff 0%, #fefce8 50%, #fdf4ff 100%)' }}>

      {/* Progress header */}
      <div className="px-4 pt-6 pb-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-base font-black" style={{ color: '#475569' }}>
              📚 Dars {currentLesson + 1} / {LESSONS.length}
            </span>
            <span className="text-base font-black" style={{ color: accent.dot }}>
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-4 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
            <div className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${accent.dot}, ${accent.dot}cc)`, boxShadow: `0 0 10px ${accent.dot}80` }} />
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-3">
            {LESSONS.map((_, i) => (
              <div key={i} className="rounded-full transition-all duration-300"
                style={{
                  width: i === currentLesson ? '28px' : '12px',
                  height: '12px',
                  background: i < currentLesson ? '#22c55e' : i === currentLesson ? accent.dot : '#cbd5e1',
                  boxShadow: i === currentLesson ? `0 0 10px ${accent.dot}80` : 'none',
                }} />
            ))}
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 px-4 py-3 flex items-start justify-center">
        <div ref={cardRef}
          className={`w-full max-w-2xl rounded-3xl overflow-hidden shadow-xl transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: 'transform 0.15s ease-out, opacity 0.5s ease',
            border: `3px solid ${accent.border}`,
          }}
          onMouseMove={onMove}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}>

          {/* Card header — gradient */}
          <div className={`bg-gradient-to-r ${lesson.bgColor} p-6 text-center relative overflow-hidden`}>
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.2) 50%, transparent 65%)',
                transform: `translateX(${tilt.y * 8}px)`,
                transition: 'transform 0.15s ease-out',
              }} />
            <div className="text-7xl mb-2 inline-block icon-interactive"
              style={{ filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.2))' }}>
              {lesson.emoji}
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              {lesson.title}
            </h2>
          </div>

          {/* Card body */}
          <div className="p-6 flex flex-col gap-4" style={{ background: accent.bg }}>

            {/* Interactive zone */}
            <div className={`flex justify-center items-center rounded-3xl p-6 min-h-48 bg-gradient-to-br ${lesson.bgColor} relative overflow-hidden`}>
              <div className="absolute inset-0 pointer-events-none opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              {lesson.interactiveType === 'lock'    && <LockInteractive />}
              {lesson.interactiveType === 'chat'    && <ChatInteractive />}
              {lesson.interactiveType === 'warning' && <WarningInteractive />}
            </div>

            {/* Content — short & bold */}
            <div className="flex flex-col gap-2">
              {lesson.content.map((text, i) => (
                <div key={i}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                  style={{ background: 'white', border: `2px solid ${accent.border}` }}>
                  <span className="text-2xl shrink-0">{i === 0 ? '💡' : i === 1 ? '🔑' : '✅'}</span>
                  <p className="font-bold text-base leading-snug" style={{ color: '#1e293b' }}>{text}</p>
                </div>
              ))}
            </div>

            {/* Fun fact */}
            <div className="rounded-2xl px-4 py-3 flex gap-3 items-center hover:shadow-md transition-all duration-200"
              style={{ background: '#fefce8', border: '2px solid #fde047' }}>
              <span className="text-2xl" style={{ animation: 'wiggle 2s ease-in-out 1s infinite' }}>🤩</span>
              <p className="font-bold text-sm" style={{ color: '#854d0e' }}>{lesson.funFact}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="px-4 pb-8 max-w-2xl mx-auto w-full">
        <div className="flex gap-3">
          {!isFirst && (
            <button onClick={onPrev}
              className="flex-1 py-4 rounded-2xl font-black text-lg btn-3d
                transition-all duration-200 hover:-translate-y-1"
              style={{ background: '#e2e8f0', color: '#475569', boxShadow: '0 6px 0 #cbd5e1' }}>
              ← Orqaga
            </button>
          )}
          <button onClick={isLast ? onFinish : onNext}
            className="ripple-host flex-1 py-4 rounded-2xl font-black text-lg text-white
              hover:-translate-y-1 transition-all duration-200 btn-3d"
            style={{
              background: isLast
                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                : 'linear-gradient(135deg, #3b82f6, #2563eb)',
              boxShadow: isLast
                ? '0 6px 0 #166534, 0 8px 20px rgba(34,197,94,0.35)'
                : '0 6px 0 #1e40af, 0 8px 20px rgba(59,130,246,0.35)',
            }}>
            {isLast ? "O'yinga o'tish 🎮" : 'Keyingi →'}
          </button>
        </div>
      </div>
    </div>
  )
}
