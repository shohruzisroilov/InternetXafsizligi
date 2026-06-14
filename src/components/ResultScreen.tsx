'use client'

import { useState, useEffect, useRef } from 'react'
import type { AnswerResult } from '@/types'
import { QUESTIONS, GRADE_CONFIG } from '@/lib/data'
import { ShieldIcon, EmojiWrapper, TrophyIcon, LockIcon, GraduationIcon } from '@/components/Icons'

interface ResultScreenProps {
  score: number
  answers: AnswerResult[]
  onRestart: () => void
}

const CONFETTI_COLORS = [
  '#ff6b6b','#ffe66d','#4ecdc4','#45b7d1',
  '#96ceb4','#ffeaa7','#dda0dd','#98d8c8',
]

interface ConfettiPiece {
  id:number; left:number; color:string
  delay:number; duration:number; size:number; round:boolean
}

function ConfettiEffect() {
  const pieces: ConfettiPiece[] = Array.from({ length: 55 }, (_, i) => ({
    id: i, left: Math.random()*100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: Math.random()*2, duration: 2+Math.random()*2,
    size: 7+Math.random()*12, round: Math.random()>0.5,
  }))
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(p => (
        <div key={p.id} className="absolute top-0 confetti-piece"
          style={{ left:`${p.left}%`, backgroundColor:p.color,
            width:`${p.size}px`, height:`${p.size*(p.round?1:2)}px`,
            borderRadius:p.round?'50%':'3px',
            animationDelay:`${p.delay}s`, animationDuration:`${p.duration}s` }} />
      ))}
    </div>
  )
}

function getGradeKey(score:number, total:number): keyof typeof GRADE_CONFIG {
  if (score === total) return 'excellent'
  if (score >= GRADE_CONFIG.good.minScore) return 'good'
  return 'tryAgain'
}

function CountUp({ target, duration=1000 }: { target:number; duration?:number }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start: number|null = null
    const step = (ts:number) => {
      if (!start) start = ts
      const p = Math.min((ts-start)/duration, 1)
      setVal(Math.floor(p*target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return <>{val}</>
}

function BadgeCard({ emoji, label, unlocked, color, delay=0 }:{
  emoji:string; label:string; unlocked:boolean; color:string; delay?:number
}) {
  const [flipped, setFlipped] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setFlipped(true), 300+delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div
      className="flex flex-col items-center gap-2 rounded-3xl p-4 border-3 transition-all duration-300"
      style={{
        background: unlocked ? 'white' : '#f1f5f9',
        border: `3px solid ${unlocked ? color : '#e2e8f0'}`,
        opacity: flipped ? 1 : 0,
        transform: flipped
          ? hovered && unlocked
            ? 'perspective(400px) rotateY(-8deg) scale(1.08)'
            : 'perspective(400px) rotateY(0deg) scale(1)'
          : 'perspective(400px) rotateY(90deg) scale(0.8)',
        transition: 'transform 0.5s cubic-bezier(.34,1.56,.64,1), opacity 0.4s ease',
        boxShadow: unlocked && hovered ? `0 8px 24px ${color}55` : '0 2px 8px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="transition-transform duration-300 h-16 flex items-center justify-center"
        style={{
          transform: hovered && unlocked ? 'scale(1.15)' : 'scale(1)',
          filter: unlocked ? `drop-shadow(0 0 12px ${color}66)` : 'grayscale(1) opacity(0.4)',
        }}>
        {unlocked ? (
          emoji === '🎓' ? (
            <GraduationIcon className="w-14 h-14" color={color} unlocked={unlocked} />
          ) : emoji === '🛡️' ? (
            <ShieldIcon className="w-14 h-14" animate={unlocked} />
          ) : (
            <TrophyIcon className="w-14 h-14" color={color} animate={unlocked} />
          )
        ) : (
          <LockIcon className="w-14 h-14" color="#94a3b8" />
        )}
      </div>
      <p className="font-black text-sm text-center" style={{ color: unlocked ? '#1e293b' : '#94a3b8' }}>
        {label}
      </p>
      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
        style={{
          background: unlocked ? color+'22' : '#f1f5f9',
          color: unlocked ? color : '#94a3b8',
        }}>
        {unlocked ? '✅ Olindi!' : 'Yopiq 🔒'}
      </span>
    </div>
  )
}

export default function ResultScreen({ score, answers, onRestart }: ResultScreenProps) {
  const [mounted, setMounted]         = useState(false)
  const [showAnswers, setShowAnswers] = useState(false)
  const [cardTilt, setCardTilt]       = useState({ x:0, y:0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const total      = QUESTIONS.length
  const gradeKey   = getGradeKey(score, total)
  const grade      = GRADE_CONFIG[gradeKey]
  const percentage = Math.round((score/total)*100)
  const isExcellent = gradeKey === 'excellent'

  const GRADE_COLORS = {
    excellent: { bg:'#fef9c3', border:'#fde047', accent:'#f59e0b' },
    good:      { bg:'#dbeafe', border:'#93c5fd', accent:'#3b82f6' },
    tryAgain:  { bg:'#f5f3ff', border:'#c4b5fd', accent:'#8b5cf6' },
  }
  const gc = GRADE_COLORS[gradeKey]

  useEffect(() => { setMounted(true) }, [])

  const onCardMove = (e: React.MouseEvent) => {
    const r = cardRef.current?.getBoundingClientRect()
    if (!r) return
    setCardTilt({
      x: -((e.clientY-r.top)/r.height-0.5)*8,
      y:  ((e.clientX-r.left)/r.width-0.5)*8,
    })
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center"
      style={{ background: 'linear-gradient(160deg, #fefce8 0%, #f0fdf4 40%, #eff6ff 100%)' }}>

      {isExcellent && mounted && <ConfettiEffect />}

      <div className="w-full max-w-2xl px-4 py-8 flex flex-col gap-5">

        {/* Result card */}
        <div ref={cardRef}
          className={`rounded-3xl overflow-hidden shadow-xl transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}
          style={{
            border: `3px solid ${gc.border}`,
            transform: `perspective(1000px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
            transition: 'transform 0.12s ease-out, opacity 0.7s ease',
          }}
          onMouseMove={onCardMove}
          onMouseLeave={() => setCardTilt({ x:0, y:0 })}>

          {/* Header */}
          <div className={`bg-gradient-to-r ${grade.bgColor} p-8 text-center relative overflow-hidden`}>
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                transform: `translateX(${cardTilt.y*10}px)`,
                transition: 'transform 0.12s ease-out',
              }} />
            <div className="flex justify-center mb-3">
              <EmojiWrapper emoji={grade.emoji} bgType={gradeKey === 'excellent' ? 'yellow' : gradeKey === 'good' ? 'blue' : 'purple'} size="xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-1">
              {gradeKey === 'excellent' ? 'Zo\'r! Mutaxassis! 🎉'
                : gradeKey === 'good'    ? 'Yaxshi! Deyarli! 👏'
                                         : 'Yana urinib ko\'r! 💪'}
            </h1>
            <p className="text-white/90 text-lg font-bold">{grade.message}</p>
          </div>

          {/* Score body */}
          <div className="p-6 flex flex-col gap-4" style={{ background: gc.bg }}>
            {/* Score circle */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-36 h-36 rounded-full flex flex-col items-center justify-center bg-gradient-to-br ${grade.bgColor} shadow-lg hover:scale-110 transition-all duration-300`}
                style={{ boxShadow: isExcellent ? `0 0 40px ${gc.accent}66` : '0 8px 24px rgba(0,0,0,0.12)' }}>
                <span className="text-5xl font-black text-white leading-none">
                  {mounted ? <CountUp target={score} /> : 0}
                </span>
                <span className="text-white/80 text-sm font-bold">/ {total}</span>
              </div>
              <p className="font-black text-base" style={{ color: gc.accent }}>
                {percentage}% to&apos;g&apos;ri! 🎯
              </p>
            </div>

            {/* Progress bar */}
            <div className="h-5 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
              <div className={`h-full bg-gradient-to-r ${grade.bgColor} rounded-full`}
                style={{
                  width: mounted ? `${percentage}%` : '0%',
                  transition: 'width 1.2s cubic-bezier(0.34,1.56,0.64,1)',
                  boxShadow: `0 0 12px ${gc.accent}66`,
                }} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label:'✅ To\'g\'ri', value:score,       bg:'#dcfce7', color:'#16a34a' },
                { label:'❌ Xato',      value:total-score, bg:'#fee2e2', color:'#dc2626' },
                { label:'📝 Jami',      value:total,       bg:'#dbeafe', color:'#2563eb' },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl p-3 hover:scale-105 transition-all duration-200"
                  style={{ background:s.bg, border:`2px solid ${s.color}33` }}>
                  <p className="text-2xl font-black" style={{ color:s.color }}>{s.value}</p>
                  <p className="text-xs font-black mt-1" style={{ color:s.color }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-col gap-3">
          <p className="font-black text-base text-center" style={{ color:'#475569' }}>
            🏅 Mukofotlaringiz
          </p>
          <div className="grid grid-cols-3 gap-3">
            <BadgeCard emoji="🎓" label="O'quvchi"   unlocked={true}          color="#3b82f6" delay={0}   />
            <BadgeCard emoji="🛡️" label="Himoyachi"  unlocked={score >= 3}    color="#8b5cf6" delay={150} />
            <BadgeCard emoji="🏆" label="Mutaxassis" unlocked={score===total} color="#f59e0b" delay={300} />
          </div>
        </div>

        {/* Motivational tip */}
        <div className="rounded-3xl p-4 flex gap-3 items-center hover:scale-[1.02] transition-all duration-200"
          style={{ background:'white', border:`3px solid ${gc.border}` }}>
          <span className="text-3xl shrink-0" style={{ animation:'float 3s ease-in-out infinite' }}>
            {gradeKey === 'excellent' ? '🌟' : gradeKey === 'good' ? '💡' : '📖'}
          </span>
          <p className="font-bold text-base" style={{ color:'#334155' }}>
            {gradeKey === 'excellent'
              ? "Barakalla! Do'stlaringga ham o'rgat! 🚀"
              : gradeKey === 'good'
              ? "Darslarni yana bir bor ko'rib chiq! Uddalaysan! 💪"
              : "Xavotir olma! Yana o'rgan, yana urin! Sen epaqali! 😊"}
          </p>
        </div>

        <button onClick={() => setShowAnswers(p => !p)}
          className="ripple-host btn-3d w-full py-4 rounded-2xl font-black text-base hover:-translate-y-0.5 transition-all duration-200"
          style={{
            background:'white', color:'#475569',
            border:`3px solid #e2e8f0`,
            boxShadow:'0 4px 0 #e2e8f0',
          }}>
          {showAnswers ? '▲ Yopish' : '▼ Javoblarni ko\'rish'}
        </button>

        {/* Answer review */}
        {showAnswers && (
          <div className="flex flex-col gap-3">
            {QUESTIONS.map((q, i) => {
              const ans        = answers.find(a => a.questionId === q.id)
              const correct    = ans?.isCorrect ?? false
              const selected   = ans ? q.options[ans.selectedIndex] : '—'
              const correctOpt = q.options[q.correctIndex]
              return (
                <div key={q.id}
                  className="rounded-2xl p-4 animate-slide-up hover:scale-[1.01] transition-all duration-200"
                  style={{
                    animationDelay:`${i*0.07}s`,
                    background: correct ? '#f0fdf4' : '#fff1f2',
                    border: `2px solid ${correct ? '#86efac' : '#fca5a5'}`,
                  }}>
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-xl shrink-0"
                      style={{ animation: correct ? 'pulse-scale 2s ease-in-out infinite' : 'none' }}>
                      {correct ? '✅' : '❌'}
                    </span>
                    <p className="font-black text-sm" style={{ color:'#1e293b' }}>
                      {i+1}. {q.question}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5 pl-8">
                    {!correct && (
                      <div className="flex items-start gap-2 flex-wrap sm:flex-nowrap">
                        <span className="text-xs font-black w-16 shrink-0 mt-1" style={{ color:'#ef4444' }}>Sen:</span>
                        <span className="text-xs font-bold px-2 py-1 rounded-lg break-words"
                          style={{ background:'#fee2e2', color:'#dc2626' }}>{selected}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2 flex-wrap sm:flex-nowrap">
                      <span className="text-xs font-black w-16 shrink-0 mt-1" style={{ color:'#22c55e' }}>To&apos;g&apos;ri:</span>
                      <span className="text-xs font-bold px-2 py-1 rounded-lg break-words"
                        style={{ background:'#dcfce7', color:'#16a34a' }}>{correctOpt}</span>
                    </div>
                    <p className="text-xs font-semibold mt-1" style={{ color:'#64748b' }}>
                      💡 {q.explanation}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Restart */}
        <div className="flex flex-col gap-3 pb-4">
          <button onClick={onRestart}
            className="ripple-host btn-3d w-full py-5 rounded-2xl font-black text-xl text-white hover:-translate-y-1.5 transition-all duration-200"
            style={{
              background:'linear-gradient(135deg, #22c55e, #16a34a)',
              boxShadow:'0 8px 0 #166534, 0 12px 28px rgba(34,197,94,0.4)',
            }}>
            Qayta o&apos;ynash 🔄
          </button>
          <p className="text-center font-bold text-sm" style={{ color:'#94a3b8' }}>
            Bolalar uchun bepul ta&apos;lim 💚
          </p>
        </div>

      </div>
    </div>
  )
}
