'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { AnswerResult } from '@/types'
import { QUESTIONS } from '@/lib/data'
import { EmojiWrapper } from '@/components/Icons'

interface QuizScreenProps {
  currentQuestion: number
  score: number
  onAnswer: (result: AnswerResult) => void
  onFinish: () => void
}

const OPTION_STYLES = [
  { bg: '#3b82f6', shadow: '#1d4ed8' },
  { bg: '#8b5cf6', shadow: '#6d28d9' },
  { bg: '#f97316', shadow: '#c2410c' },
  { bg: '#ec4899', shadow: '#9d174d' },
]

const CONFETTI_COLORS = ['#ff6b6b','#ffe66d','#4ecdc4','#45b7d1','#96ceb4','#ffeaa7','#dda0dd','#98d8c8']

interface ConfettiPiece { id:number; left:number; color:string; delay:number; duration:number; size:number }

function ConfettiEffect() {
  const pieces: ConfettiPiece[] = Array.from({ length: 36 }, (_, i) => ({
    id: i, left: Math.random()*100, color: CONFETTI_COLORS[i%CONFETTI_COLORS.length],
    delay: Math.random()*0.6, duration: 1.5+Math.random()*1.2, size: 8+Math.random()*10,
  }))
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(p => (
        <div key={p.id} className="absolute top-0 confetti-piece"
          style={{ left:`${p.left}%`, backgroundColor:p.color, width:`${p.size}px`, height:`${p.size}px`,
            borderRadius: Math.random()>0.5?'50%':'3px', animationDelay:`${p.delay}s`, animationDuration:`${p.duration}s` }} />
      ))}
    </div>
  )
}

function OptionButton({ label, index, icon, style, isSelected, isCorrect, isDisabled, onSelect }: {
  label:string; index:number; icon:string; style:typeof OPTION_STYLES[number]
  isSelected:boolean; isCorrect:boolean; isDisabled:boolean
  onSelect:(i:number, e:React.MouseEvent<HTMLButtonElement>)=>void
}) {
  const [tilt, setTilt] = useState({ x:0, y:0 })
  const ref = useRef<HTMLButtonElement>(null)

  const onMove = (e: React.MouseEvent) => {
    if (isDisabled) return
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    setTilt({ x:-((e.clientY-r.top)/r.height-0.5)*12, y:((e.clientX-r.left)/r.width-0.5)*12 })
  }

  const bg = isDisabled
    ? isCorrect ? '#22c55e' : isSelected ? '#ef4444' : '#94a3b8'
    : style.bg
  const shadow = isDisabled
    ? isCorrect ? '#166534' : isSelected ? '#7f1d1d' : '#64748b'
    : style.shadow

  return (
    <button
      ref={ref}
      onClick={e => onSelect(index, e)}
      disabled={isDisabled}
      className={`ripple-host w-full py-4 px-4 rounded-2xl font-black text-white text-left text-base flex items-center gap-3 transition-all duration-200 ${isDisabled ? 'cursor-not-allowed' : 'hover:-translate-y-1 btn-3d'} ${isCorrect && isDisabled ? 'animate-glow-green' : ''} ${isSelected && !isCorrect && isDisabled ? 'animate-shake' : ''}`}
      style={{
        backgroundColor: bg,
        boxShadow: `0 6px 0 ${shadow}, 0 8px 16px ${bg}44`,
        transform: isDisabled
          ? isCorrect ? 'scale(1.04)' : 'none'
          : `perspective(500px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isDisabled ? 'background-color 0.3s, transform 0.3s' : 'transform 0.1s ease-out',
        opacity: isDisabled && !isCorrect && !isSelected ? 0.5 : 1,
      }}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x:0, y:0 })}
    >
      {/* Shine */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)' }} />
      <span className="text-2xl shrink-0 transition-transform duration-200"
        style={{ transform: isCorrect && isDisabled ? 'scale(1.3) rotate(-10deg)' : 'scale(1)' }}>
        {icon}
      </span>
      <span className="relative text-base font-black">{label}</span>
    </button>
  )
}

export default function QuizScreen({ currentQuestion, score, onAnswer, onFinish }: QuizScreenProps) {
  const [selected, setSelected]         = useState<number|null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [animating, setAnimating]       = useState(false)
  const [mounted, setMounted]           = useState(false)
  const [cardTilt, setCardTilt]         = useState({ x:0, y:0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const q       = QUESTIONS[currentQuestion]
  const isLast  = currentQuestion === QUESTIONS.length - 1
  const progress = (currentQuestion / QUESTIONS.length) * 100

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    setSelected(null); setShowFeedback(false); setShowConfetti(false); setAnimating(false); setCardTilt({ x:0, y:0 })
  }, [currentQuestion])

  const onCardMove = useCallback((e: React.MouseEvent) => {
    const r = cardRef.current?.getBoundingClientRect()
    if (!r) return
    setCardTilt({ x:-((e.clientY-r.top)/r.height-0.5)*8, y:((e.clientX-r.left)/r.width-0.5)*8 })
  }, [])

  const handleSelect = useCallback((index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (selected !== null || animating) return
    // ripple
    const btn = e.currentTarget, rect = btn.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    const el = document.createElement('span'); el.className = 'ripple'
    el.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`
    btn.appendChild(el); el.addEventListener('animationend', () => el.remove())

    const correct = index === q.correctIndex
    setSelected(index); setShowFeedback(true); setAnimating(true)
    if (correct) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 2200) }
    const result: AnswerResult = { questionId: q.id, selectedIndex: index, isCorrect: correct }
    setTimeout(() => {
      onAnswer(result); setAnimating(false)
      if (isLast) setTimeout(onFinish, 400)
    }, 1800)
  }, [selected, animating, q, isLast, onAnswer, onFinish])

  const getIcon = (i: number) => {
    if (selected === null) return ['🅰️','🅱️','🅲','🅳'][i]
    if (i === q.correctIndex) return '✅'
    if (i === selected) return '❌'
    return ['🅰️','🅱️','🅲','🅳'][i]
  }

  if (!q) return null

  return (
    <div className="min-h-screen w-full flex flex-col"
      style={{ background: 'linear-gradient(160deg, #fefce8 0%, #eff6ff 50%, #fdf4ff 100%)' }}>

      {showConfetti && mounted && <ConfettiEffect />}

      {/* Header */}
      <div className="px-4 pt-6 pb-2 max-w-2xl mx-auto w-full">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-base"
            style={{ background: '#dbeafe', color: '#1d4ed8' }}>
            <span>🎮</span>
            <span>{currentQuestion + 1} / {QUESTIONS.length}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-base"
            style={{
              background: '#fefce8',
              color: '#854d0e',
              boxShadow: score > 0 ? '0 0 16px rgba(234,179,8,0.4)' : 'none',
              border: '2px solid #fde047',
            }}>
            <span style={{ animation: score > 0 ? 'wiggle 1s ease-in-out' : 'none' }}>⭐</span>
            <span>{score} / {QUESTIONS.length}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="h-4 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #fbbf24, #f59e0b)', boxShadow: '0 0 10px rgba(251,191,36,0.5)' }} />
        </div>
      </div>

      {/* Question card */}
      <div className="flex-1 px-4 py-4 flex flex-col gap-4 max-w-2xl mx-auto w-full">
        <div ref={cardRef}
          className={`rounded-3xl p-6 text-center shadow-lg transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background: 'rgba(255,255,255,0.9)',
            border: '3px solid #fde047',
            transform: `perspective(800px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
            transition: 'transform 0.12s ease-out, opacity 0.5s ease',
          }}
          onMouseMove={onCardMove}
          onMouseLeave={() => setCardTilt({ x:0, y:0 })}>
          <div className="flex justify-center mb-3">
            <EmojiWrapper emoji="🤔" bgType="yellow" size="lg" />
          </div>
          <h2 className="text-xl md:text-2xl font-black leading-snug" style={{ color: '#1e293b' }}>
            {q.question}
          </h2>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {q.options.map((opt, i) => (
            <OptionButton key={i} label={opt} index={i} icon={getIcon(i)}
              style={OPTION_STYLES[i]} isSelected={selected === i}
              isCorrect={i === q.correctIndex} isDisabled={selected !== null}
              onSelect={handleSelect} />
          ))}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`rounded-2xl p-4 flex items-start gap-3 animate-bounce-in border-3`}
            style={{
              background: selected === q.correctIndex ? '#dcfce7' : '#fee2e2',
              border: `3px solid ${selected === q.correctIndex ? '#86efac' : '#fca5a5'}`,
              boxShadow: selected === q.correctIndex ? '0 0 20px rgba(34,197,94,0.25)' : '0 0 20px rgba(239,68,68,0.25)',
            }}>
            <div className="shrink-0" style={{ animation: 'bounce-in 0.4s ease-out' }}>
              <EmojiWrapper emoji={selected === q.correctIndex ? '🎉' : '😅'} bgType={selected === q.correctIndex ? 'green' : 'orange'} size="md" />
            </div>
            <div>
              <p className="font-black text-lg mb-1"
                style={{ color: selected === q.correctIndex ? '#166534' : '#991b1b' }}>
                {selected === q.correctIndex ? "To'g'ri! Zo'r!" : 'Xato! Lekin yaxshi urinish!'}
              </p>
              <p className="font-semibold text-sm"
                style={{ color: selected === q.correctIndex ? '#15803d' : '#b91c1c' }}>
                {q.explanation}
              </p>
            </div>
          </div>
        )}

        {showFeedback && (
          <p className="text-center font-bold text-sm animate-pulse" style={{ color: '#94a3b8' }}>
            {isLast ? "🏁 Natijaga o'tilmoqda..." : '⏳ Keyingi savol...'}
          </p>
        )}
      </div>
    </div>
  )
}
