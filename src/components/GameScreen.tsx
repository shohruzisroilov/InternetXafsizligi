'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { GAME_ITEMS } from '@/lib/data'
import type { GameItem, GameResult } from '@/types'
import { ShieldIcon, TrophyIcon, EmojiWrapper, StarIcon, LockIcon } from '@/components/Icons'

interface GameScreenProps {
  onRestart: () => void
  onGoHome: () => void
  onScoreChange?: (score: number) => void
}

const CONFETTI_COLORS = ['#ff6b6b', '#ffe66d', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8']

interface ConfettiPiece {
  id: number
  left: number
  color: string
  delay: number
  duration: number
  size: number
}

function ConfettiEffect() {
  const pieces: ConfettiPiece[] = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random() * 1.5,
    size: 6 + Math.random() * 10,
  }))
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute top-0 confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '3px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

// Web Audio API Sound Synthesizer
const playSound = (type: 'success' | 'failure' | 'victory' | 'gameover') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()

    if (type === 'success') {
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      osc1.type = 'sine'
      osc2.type = 'sine'

      osc1.frequency.setValueAtTime(523.25, ctx.currentTime) // C5
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1) // E5

      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)

      osc1.start()
      osc2.start()
      osc1.stop(ctx.currentTime + 0.4)
      osc2.stop(ctx.currentTime + 0.4)
    } else if (type === 'failure') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(220, ctx.currentTime)
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.3)

      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.3)
    } else if (type === 'victory') {
      const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08)

        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.08)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(ctx.currentTime + idx * 0.08)
        osc.stop(ctx.currentTime + idx * 0.08 + 0.3)
      })
    } else if (type === 'gameover') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(220, ctx.currentTime)
      osc.frequency.linearRampToValueAtTime(146.83, ctx.currentTime + 0.6) // D3

      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.6)
    }
  } catch (e) {
    console.warn('Audio synthesis not supported or blocked:', e)
  }
}

export default function GameScreen({ onRestart, onGoHome, onScoreChange }: GameScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [results, setResults] = useState<GameResult[]>([])
  const [isGameOver, setIsGameOver] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Dragging / swiping states
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  // Feedback states
  const [answered, setAnswered] = useState(false)
  const [flash, setFlash] = useState<'correct' | 'incorrect' | null>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentItem = GAME_ITEMS[currentIndex]

  const handleDecision = useCallback((choice: boolean) => {
    if (answered || isGameOver) return

    const correct = choice === currentItem.isSafe
    setAnswered(true)

    // Log result
    const result: GameResult = {
      itemId: currentItem.id,
      isCorrect: correct,
      userChoice: choice,
    }
    setResults(prev => [...prev, result])

    if (correct) {
      const newScore = score + 10
      setScore(newScore)
      if (onScoreChange) onScoreChange(newScore)
      setFlash('correct')
      playSound('success')
    } else {
      setLives(prev => {
        const nextLives = prev - 1
        if (nextLives <= 0) {
          setTimeout(() => {
            setIsGameOver(true)
            playSound('gameover')
          }, 800)
        }
        return nextLives
      })
      setFlash('incorrect')
      playSound('failure')
    }

    // Check if it is the last item
    if (currentIndex === GAME_ITEMS.length - 1) {
      setTimeout(() => {
        setIsGameOver(true)
        if (lives > 1 || (lives === 1 && correct)) {
          setShowConfetti(true)
          playSound('victory')
          setTimeout(() => setShowConfetti(false), 3000)
        } else {
          playSound('gameover')
        }
      }, 800)
    }
  }, [answered, isGameOver, currentItem, currentIndex, lives, score, onScoreChange])

  // Swipe handlers
  const handleStart = (clientX: number, clientY: number) => {
    if (answered || isGameOver) return
    setIsDragging(true)
    dragStart.current = { x: clientX, y: clientY }
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || answered || isGameOver) return
    const ox = clientX - dragStart.current.x
    const oy = clientY - dragStart.current.y
    setDragOffset({ x: ox, y: oy })
  }

  const handleEnd = () => {
    if (!isDragging || answered || isGameOver) return
    setIsDragging(false)

    const threshold = 120
    if (dragOffset.x > threshold) {
      // Swiped right -> Safe
      setDragOffset({ x: 400, y: dragOffset.y })
      handleDecision(true)
    } else if (dragOffset.x < -threshold) {
      // Swiped left -> Dangerous
      setDragOffset({ x: -400, y: dragOffset.y })
      handleDecision(false)
    } else {
      // Reset
      setDragOffset({ x: 0, y: 0 })
    }
  }

  const handleNext = () => {
    setAnswered(false)
    setFlash(null)
    setDragOffset({ x: 0, y: 0 })
    if (currentIndex < GAME_ITEMS.length - 1 && lives > 0) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  // Mouse Move tilt effect (only when not dragging)
  const onCardMouseMove = (e: React.MouseEvent) => {
    if (isDragging || answered || isGameOver) return
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    setTilt({
      x: -((e.clientY - rect.top) / rect.height - 0.5) * 8,
      y: ((e.clientX - rect.left) / rect.width - 0.5) * 8,
    })
  }

  const resetGame = () => {
    setCurrentIndex(0)
    setScore(0)
    setLives(3)
    setResults([])
    setIsGameOver(false)
    setAnswered(false)
    setFlash(null)
    setDragOffset({ x: 0, y: 0 })
    setTilt({ x: 0, y: 0 })
    if (onScoreChange) onScoreChange(0)
  }

  // Swipe label visibility
  const swipeDirection = dragOffset.x > 30 ? 'safe' : dragOffset.x < -30 ? 'unsafe' : null

  // Badges based on performance
  const getBadgeInfo = () => {
    if (score === 100) return { title: 'Kiber Qahramon 🏆', color: '#f59e0b', emoji: '🏆', bg: 'from-yellow-400 to-orange-400' }
    if (score >= 60) return { title: 'Kiber Himoyachi 🛡️', color: '#8b5cf6', emoji: '🛡️', bg: 'from-indigo-400 to-purple-500' }
    return { title: 'Yangi Himoyachi 🎯', color: '#3b82f6', emoji: '🎯', bg: 'from-sky-400 to-blue-500' }
  }
  const badge = getBadgeInfo()

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center select-none overflow-x-hidden"
      style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #eff6ff 50%, #fdf4ff 100%)' }}
    >
      {showConfetti && mounted && <ConfettiEffect />}

      {/* Screen flash feedback */}
      {flash && (
        <div
          className={`fixed inset-0 pointer-events-none z-40 transition-opacity duration-300 ${flash === 'correct' ? 'bg-green-500/10' : 'bg-red-500/10'}`}
          style={{ animation: 'pulse-once 0.4s ease-out' }}
        />
      )}

      {!isGameOver ? (
        <div className="w-full max-w-lg px-4 py-8 flex-1 flex flex-col gap-4">
          {/* Top Info Bar */}
          <div className="flex justify-between items-center bg-white/80 backdrop-blur-md px-4 py-3 rounded-2xl border-2 border-blue-100 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-blue-600">📊 {currentIndex + 1} / {GAME_ITEMS.length}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <span
                  key={i}
                  className="text-2xl transition-all duration-300"
                  style={{
                    transform: i < lives ? 'scale(1)' : 'scale(0.8)',
                    opacity: i < lives ? 1 : 0.2,
                    filter: i < lives ? 'none' : 'grayscale(1)',
                    animation: i === lives - 1 && flash === 'incorrect' ? 'shake 0.5s ease' : 'none',
                  }}
                >
                  ❤️
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-black text-emerald-600">⭐ {score} ball</span>
            </div>
          </div>

          {/* Tutorial Tip */}
          {!answered && currentIndex === 0 && (
            <p className="text-xs font-black text-center text-blue-500 animate-pulse bg-blue-50 py-1.5 px-3 rounded-xl border border-blue-200">
              💡 Chapga suring (Xavfli 🚫) yoki o'ngga suring (Xavfsiz ✅)
            </p>
          )}

          {/* Cards Stack Area */}
          <div className="flex-1 flex items-center justify-center relative min-h-[360px] md:min-h-[400px]">
            {currentItem && (
              <div
                ref={cardRef}
                className="w-full max-w-[340px] aspect-[4/5] rounded-[36px] bg-white border-[3px] border-blue-200 p-6 flex flex-col items-center justify-between text-center shadow-xl relative cursor-grab active:cursor-grabbing transition-transform"
                style={{
                  transform: isDragging
                    ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.08}deg) scale(1.02)`
                    : answered
                    ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.08}deg) scale(0.95)`
                    : `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  boxShadow: isDragging ? '0 30px 60px rgba(59,130,246,0.18)' : '0 12px 32px rgba(0,0,0,0.08)',
                }}
                onMouseDown={e => handleStart(e.clientX, e.clientY)}
                onMouseMove={e => {
                  onCardMouseMove(e)
                  handleMove(e.clientX, e.clientY)
                }}
                onMouseUp={handleEnd}
                onMouseLeave={() => {
                  setTilt({ x: 0, y: 0 })
                  handleEnd()
                }}
                onTouchStart={e => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchMove={e => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchEnd={handleEnd}
              >
                {/* Swipe Overlays */}
                {swipeDirection === 'safe' && (
                  <div className="absolute inset-0 rounded-[33px] bg-emerald-500/10 border-[6px] border-emerald-500 flex items-center justify-center pointer-events-none z-30 animate-fade-in">
                    <span className="bg-emerald-500 text-white font-black text-xl px-5 py-2.5 rounded-2xl shadow-lg rotate-[-12deg]">
                      XAVFSIZ ✅
                    </span>
                  </div>
                )}
                {swipeDirection === 'unsafe' && (
                  <div className="absolute inset-0 rounded-[33px] bg-rose-500/10 border-[6px] border-rose-500 flex items-center justify-center pointer-events-none z-30 animate-fade-in">
                    <span className="bg-rose-500 text-white font-black text-xl px-5 py-2.5 rounded-2xl shadow-lg rotate-[12deg]">
                      XAVFLI 🚫
                    </span>
                  </div>
                )}

                {/* Card Top */}
                <div className="w-full flex justify-between items-center opacity-40">
                  <span className="text-sm font-black text-slate-400">#KiberQalqon</span>
                  <span className="text-xl">🛡️</span>
                </div>

                {/* Card Content */}
                <div className="flex-1 flex flex-col items-center justify-center py-4">
                  <div
                    className="mb-4 text-7xl select-none"
                    style={{
                      transform: isDragging ? `scale(${1 + Math.abs(dragOffset.x) * 0.001})` : 'scale(1)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    {currentItem.emoji}
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 leading-snug px-2">
                    {currentItem.text}
                  </h3>
                </div>

                {/* Card Bottom Info */}
                <div className="w-full text-xs font-bold text-slate-400 bg-slate-50 py-2 rounded-2xl border border-slate-100">
                  O'ylab ko'ring va suring!
                </div>
              </div>
            )}
          </div>

          {/* Action Area (Buttons or Explanation) */}
          <div className="h-44 flex flex-col justify-center gap-3">
            {!answered ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setDragOffset({ x: -200, y: 0 })
                    setTimeout(() => handleDecision(false), 200)
                  }}
                  className="btn-3d ripple-host py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-lg font-black flex items-center justify-center gap-2 transition-transform active:scale-95"
                  style={{ boxShadow: '0 6px 0 #be123c, 0 10px 20px rgba(244,63,94,0.3)' }}
                >
                  <span>Xavfli</span>
                  <span>🚫</span>
                </button>
                <button
                  onClick={() => {
                    setDragOffset({ x: 200, y: 0 })
                    setTimeout(() => handleDecision(true), 200)
                  }}
                  className="btn-3d ripple-host py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-black flex items-center justify-center gap-2 transition-transform active:scale-95"
                  style={{ boxShadow: '0 6px 0 #047857, 0 10px 20px rgba(16,185,129,0.3)' }}
                >
                  <span>Xavfsiz</span>
                  <span>✅</span>
                </button>
              </div>
            ) : (
              <div
                className={`p-4 rounded-3xl border-[3px] flex items-start gap-3 animate-bounce-in shadow-lg transition-all duration-300 ${
                  flash === 'correct'
                    ? 'bg-emerald-50 border-emerald-300 shadow-emerald-100'
                    : 'bg-rose-50 border-rose-300 shadow-rose-100'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  <EmojiWrapper
                    emoji={flash === 'correct' ? '🎉' : '😅'}
                    bgType={flash === 'correct' ? 'green' : 'orange'}
                    size="md"
                  />
                </div>
                <div className="flex-1">
                  <h4
                    className="font-black text-base md:text-lg mb-0.5"
                    style={{ color: flash === 'correct' ? '#065f46' : '#9f1239' }}
                  >
                    {flash === 'correct' ? "To'g'ri! Barakalla!" : 'Xato qaror!'}
                  </h4>
                  <p
                    className="font-bold text-xs md:text-sm leading-relaxed"
                    style={{ color: flash === 'correct' ? '#047857' : '#be123c' }}
                  >
                    {currentItem.explanation}
                  </p>
                  <button
                    onClick={handleNext}
                    className="mt-3 w-full py-2.5 rounded-xl text-sm font-black text-white bg-blue-500 hover:bg-blue-600 active:scale-98 transition-all btn-3d"
                    style={{ boxShadow: '0 4px 0 #1d4ed8' }}
                  >
                    Keyingisi ➔
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* GAME OVER / RESULTS DASHBOARD */
        <div className="w-full max-w-xl px-4 py-8 flex flex-col gap-6 animate-slide-up">
          {/* Main Card Result */}
          <div
            className="rounded-[36px] bg-white border-[3px] border-slate-200 overflow-hidden shadow-xl"
            style={{ border: `3px solid ${badge.color}` }}
          >
            {/* Header with grade */}
            <div className={`bg-gradient-to-br ${badge.bg} p-8 text-center text-white relative overflow-hidden`}>
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
              <div className="flex justify-center mb-4">
                <EmojiWrapper
                  emoji={badge.emoji}
                  bgType={score === 100 ? 'yellow' : score >= 60 ? 'purple' : 'blue'}
                  size="xl"
                />
              </div>
              <h2 className="text-3xl font-black mb-1">{badge.title}</h2>
              <p className="text-white/90 text-sm font-bold">
                {score === 100
                  ? "Siz ajoyib kiber-himoyachisiz! Mukammal natija!"
                  : score >= 60
                  ? "Ajoyib natija! Internet xavfsizligini yaxshi bilasiz."
                  : "Yomon emas! Darslarni yana bir bor o'qish foydali bo'ladi."}
              </p>
            </div>

            {/* Score Stats */}
            <div className="p-6 flex flex-col items-center gap-6">
              <div className="flex gap-4 w-full">
                <div className="flex-1 bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-center">
                  <p className="text-3xl font-black text-emerald-600">{score}</p>
                  <p className="text-xs font-black text-emerald-500 uppercase mt-0.5">Jami ball</p>
                </div>
                <div className="flex-1 bg-rose-50 border border-rose-100 p-4 rounded-2xl text-center">
                  <p className="text-3xl font-black text-rose-600">{lives}</p>
                  <p className="text-xs font-black text-rose-500 uppercase mt-0.5">Qolgan hayotlar</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full">
                <div className="flex justify-between text-xs font-black text-slate-500 mb-1.5">
                  <span>To'g'ri javoblar ulushi</span>
                  <span>{score}%</span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-1000"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* History / Mistakes Review */}
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-black text-slate-600 text-center">📝 Kartalar tahlili</h3>
            <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-1">
              {GAME_ITEMS.map((item, idx) => {
                const res = results.find(r => r.itemId === item.id)
                const isAnswered = !!res
                const correct = res?.isCorrect ?? false
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border-2 flex items-start gap-3 transition-colors ${
                      !isAnswered
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : correct
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-rose-50/50 border-rose-200'
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-black text-sm text-slate-700 truncate">{item.text}</h4>
                        {isAnswered && (
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              correct ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {correct ? 'To\'g\'ri' : 'Xato'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-500 leading-snug">
                        {item.explanation}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Buttons restart */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={resetGame}
              className="btn-3d flex-1 py-4.5 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-black text-lg text-center active:scale-98 transition-transform"
              style={{ boxShadow: '0 6px 0 #047857, 0 10px 20px rgba(16,185,129,0.3)' }}
            >
              🔄 Qayta o'ynash
            </button>
            <button
              onClick={onGoHome}
              className="btn-3d flex-1 py-4.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-black text-lg text-center active:scale-98 transition-transform"
              style={{ boxShadow: '0 6px 0 #cbd5e1' }}
            >
              🏠 Bosh sahifa
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
