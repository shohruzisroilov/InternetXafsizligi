'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { LESSONS, QUESTIONS, GRADE_CONFIG } from '@/lib/data'
import Footer from '@/components/Footer'
import { ShieldIcon, EmojiWrapper, TrophyIcon, StarIcon } from '@/components/Icons'

const getBgType = (emoji: string): 'blue' | 'purple' | 'orange' | 'green' | 'yellow' | 'pink' | 'glass' => {
  switch (emoji) {
    case '🔒': case '🔑': return 'orange'
    case '💻': case '📱': case '📚': return 'blue'
    case '🌐': return 'glass'
    case '⭐': case '🌟': return 'yellow'
    case '✅': case '🎯': return 'green'
    case '🌈': return 'pink'
    case '🎓': case '🎮': return 'purple'
    case '🏆': return 'yellow'
    default: return 'glass'
  }
}

interface LandingPageProps {
  onStart: () => void
}

const FLOATING_ICONS = [
  { emoji:'🔒', top:'12%', left:'4%',   delay:'0s',   dur:'3.2s', depth:0.04 },
  { emoji:'💻', top:'18%', right:'6%',  delay:'0.5s', dur:'3.8s', depth:0.07 },
  { emoji:'📱', top:'68%', left:'2%',   delay:'1s',   dur:'2.9s', depth:0.05 },
  { emoji:'🌐', top:'72%', right:'4%',  delay:'1.5s', dur:'4.1s', depth:0.09 },
  { emoji:'⭐', top:'44%', left:'1%',   delay:'0.8s', dur:'3.3s', depth:0.03 },
  { emoji:'✅', top:'38%', right:'2%',  delay:'1.2s', dur:'2.6s', depth:0.06 },
  { emoji:'🎯', top:'84%', left:'44%',  delay:'0.3s', dur:'3.9s', depth:0.08 },
  { emoji:'🔑', top:'6%',  left:'48%',  delay:'0.7s', dur:'3.4s', depth:0.05 },
  { emoji:'🌈', top:'55%', right:'10%', delay:'0.4s', dur:'4.3s', depth:0.10 },
  { emoji:'🎓', top:'28%', left:'14%',  delay:'1.1s', dur:'3.7s', depth:0.06 },
]

/* Animated counter triggered on scroll */
function CountUp({ target, suffix='', duration=1400 }:{target:number;suffix?:string;duration?:number}) {
  const [val, setVal]       = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStarted(true) },
      { threshold: 0.5 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    let start: number|null = null
    const step = (ts:number) => {
      if (!start) start = ts
      const p = Math.min((ts-start)/duration, 1)
      setVal(Math.floor(p*target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, target, duration])

  return <span ref={ref}>{val}{suffix}</span>
}

/* Lesson preview card */
function LessonCard({ lesson, index, onStart }:{
  lesson: typeof LESSONS[number]; index:number; onStart:()=>void
}) {
  const [tilt, setTilt]     = useState({ x:0, y:0 })
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const CARD_BG = ['#eff6ff','#f5f3ff','#fff7ed']
  const CARD_BORDER = ['#bfdbfe','#ddd6fe','#fed7aa']

  return (
    <div ref={ref}
      className="rounded-3xl overflow-hidden"
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered?1.03:1})`,
        transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
        boxShadow: hovered ? '0 24px 48px rgba(0,0,0,0.15)' : '0 6px 24px rgba(0,0,0,0.08)',
        border: `3px solid ${hovered ? CARD_BORDER[index] : '#e2e8f0'}`,
        background: CARD_BG[index],
      }}
      onMouseMove={e => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        setTilt({ x:-((e.clientY-r.top)/r.height-0.5)*14, y:((e.clientX-r.left)/r.width-0.5)*14 })
      }}
      onMouseLeave={() => { setTilt({x:0,y:0}); setHovered(false) }}
      onMouseEnter={() => setHovered(true)}
      onClick={onStart}
    >
      {/* Header */}
      <div className={`bg-gradient-to-br ${lesson.bgColor} p-6 text-center relative overflow-hidden`}>
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background:'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)',
            transform:`translateX(${tilt.y*8}px)`, transition:'transform 0.15s ease-out',
          }} />
        <div className="text-6xl mb-2 inline-block transition-transform duration-300"
          style={{ transform: hovered?'scale(1.25) rotate(-8deg)':'scale(1)' }}>
          {lesson.emoji}
        </div>
        <h3 className="text-xl font-black text-white">{lesson.title}</h3>
        <span className="inline-block mt-2 text-xs font-black px-3 py-1 rounded-full"
          style={{ background:'rgba(255,255,255,0.3)', color:'white' }}>
          Dars {lesson.id}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3">
        <p className="font-bold text-sm leading-relaxed line-clamp-2" style={{ color:'#475569' }}>
          {lesson.content[0]}
        </p>
        <div className="rounded-xl px-3 py-2 text-xs font-bold"
          style={{ background:'#fefce8', color:'#854d0e', border:'2px solid #fde047' }}>
          🤩 {lesson.funFact.slice(0, 50)}…
        </div>
        <div className={`w-full py-3 rounded-2xl font-black text-sm text-white text-center
          bg-gradient-to-r ${lesson.bgColor} transition-all duration-300`}
          style={{ boxShadow: hovered ? '0 6px 16px rgba(0,0,0,0.2)' : 'none' }}>
          Darsni boshlash →
        </div>
      </div>
    </div>
  )
}

/* Stat card */
function StatCard({ emoji, value, suffix, label, color, delay }:{
  emoji:string; value:number; suffix?:string; label:string; color:string; delay:number
}) {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold:0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref}
      className="flex flex-col items-center gap-2 p-6 rounded-3xl transition-all duration-300"
      style={{
        background: hovered ? 'white' : '#f8fafc',
        border: `3px solid ${hovered ? color : '#e2e8f0'}`,
        opacity: visible ? 1 : 0,
        transform: visible ? `translateY(0) scale(${hovered?1.05:1})` : 'translateY(30px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.3s ease, border-color 0.2s, background 0.2s`,
        boxShadow: hovered ? `0 12px 28px ${color}33` : '0 2px 8px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="mb-2 transition-transform duration-300" style={{ transform: hovered ? 'scale(1.15)' : 'scale(1)' }}>
        {emoji === '🏆' ? (
          <TrophyIcon className="w-12 h-12" animate={true} />
        ) : emoji === '🌟' ? (
          <StarIcon className="w-12 h-12" color="#22c55e" animate={true} />
        ) : (
          <EmojiWrapper emoji={emoji} bgType={getBgType(emoji)} size="md" />
        )}
      </div>
      <p className="text-4xl font-black" style={{ color }}>
        {visible ? <CountUp target={value} suffix={suffix??''} /> : '0'}
      </p>
      <p className="text-sm font-black text-center" style={{ color:'#64748b' }}>{label}</p>
    </div>
  )
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [mounted, setMounted]         = useState(false)
  const [mousePos, setMousePos]       = useState({ x:0, y:0 })
  const [hoveredIcon, setHoveredIcon] = useState<number|null>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  const onHeroMove = useCallback((e: React.MouseEvent) => {
    const r = heroRef.current?.getBoundingClientRect()
    if (!r) return
    setMousePos({ x:(e.clientX-r.left)/r.width-0.5, y:(e.clientY-r.top)/r.height-0.5 })
  }, [])

  const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget, rect = btn.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)*2
    const el = document.createElement('span'); el.className = 'ripple'
    el.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`
    btn.appendChild(el); el.addEventListener('animationend', () => el.remove())
  }

  return (
    <div className="w-full overflow-x-hidden">

      {/* ══ SECTION 1: HERO ══════════════════════════════════ */}
      <section id="hero" ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
        style={{
          backgroundImage:'linear-gradient(135deg, #fef9c3 0%, #dbeafe 40%, #fce7f3 70%, #dcfce7 100%)',
          backgroundSize:'300% 300%',
          animation:'gradientShift 8s ease infinite',
        }}
        onMouseMove={onHeroMove}
      >
        {/* Morphing blobs */}
        {mounted && <>
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-50 pointer-events-none"
            style={{ background:'radial-gradient(circle, #fde047, transparent)', animation:'morph-bg 10s ease-in-out infinite' }} />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-40 pointer-events-none"
            style={{ background:'radial-gradient(circle, #86efac, transparent)', animation:'morph-bg 12s ease-in-out 2s infinite' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full opacity-30 pointer-events-none"
            style={{ background:'radial-gradient(circle, #c4b5fd, transparent)', animation:'morph-bg 9s ease-in-out 1s infinite' }} />
        </>}

        {/* Orbiting sparkles */}
        {mounted && (
          <div className="absolute pointer-events-none" style={{ top:'50%', left:'50%' }}>
            <div className="animate-orbit" style={{ position:'absolute' }}>
              <span className="text-2xl opacity-50">✨</span>
            </div>
            <div className="animate-orbit-rev" style={{ position:'absolute' }}>
              <span className="text-xl opacity-40">⭐</span>
            </div>
          </div>
        )}

        {/* Parallax icons */}
        {mounted && FLOATING_ICONS.map((icon, i) => (
          <div key={i} className="absolute select-none hidden md:block"
            style={{
              top:icon.top, left:'left' in icon?(icon as {left:string}).left:undefined,
              right:'right' in icon?(icon as {right:string}).right:undefined,
              animation:`float ${icon.dur} ease-in-out ${icon.delay} infinite`,
              transform:`translate(${mousePos.x*icon.depth*-260}px, ${mousePos.y*icon.depth*-260}px) scale(${hoveredIcon === i ? 1.25 : 1})`,
              transition:'transform 0.15s ease-out',
              zIndex: hoveredIcon===i?10:1,
            }}
            onMouseEnter={() => setHoveredIcon(i)}
            onMouseLeave={() => setHoveredIcon(null)}>
            <EmojiWrapper emoji={icon.emoji} bgType={getBgType(icon.emoji)} size="md" />
          </div>
        ))}

        {/* Hero content */}
        <div className={`relative z-10 mx-4 max-w-2xl w-full text-center
          transition-all duration-700 ${mounted?'opacity-100 translate-y-0':'opacity-0 translate-y-10'}`}>

          {/* Free badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-5 font-bold text-sm"
            style={{ background:'rgba(255,255,255,0.7)', color:'#16a34a', border:'2px solid #86efac' }}>
            ✅ Bepul &bull; O&apos;zbek tilida
          </div>

          {/* Shield */}
          <div className="flex justify-center mb-4">
            <ShieldIcon className="w-28 h-28" animate={true} />
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-black mb-3 leading-tight" style={{ color:'#1e293b' }}>
            Internet
            <br />
            <span style={{ color:'#f59e0b' }}>Xavfsizligi</span>
          </h1>

          <p className="text-xl md:text-2xl font-bold mb-6 leading-relaxed" style={{ color:'#475569' }}>
            O&apos;yin orqali xavfsiz internet foydalanishni o&apos;rgan! 🎮
          </p>

          {/* Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { icon:'📚', text:'3 dars',    bg:'#dbeafe', color:'#1d4ed8' },
              { icon:'🎮', text:'5 savol',   bg:'#fce7f3', color:'#be185d' },
              { icon:'🏆', text:'3 mukofot', bg:'#fefce8', color:'#a16207' },
              { icon:'📱', text:'Mobil',     bg:'#dcfce7', color:'#15803d' },
            ].map((p,i) => (
              <span key={i} className="font-black text-sm px-4 py-2 rounded-full hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
                style={{ background:p.bg, color:p.color }}>
                {p.icon} {p.text}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={e => { addRipple(e); onStart() }}
              className="ripple-host btn-3d px-10 py-5 rounded-2xl text-xl font-black text-white hover:-translate-y-1.5 transition-all duration-200"
              style={{
                background:'linear-gradient(135deg, #22c55e, #16a34a)',
                boxShadow:'0 8px 0 #166534, 0 12px 28px rgba(34,197,94,0.4)',
              }}>
              Boshlash 🚀
            </button>
            <a href="#learn"
              className="px-10 py-5 rounded-2xl text-xl font-black text-center hover:-translate-y-1 transition-all duration-200"
              style={{
                background:'rgba(255,255,255,0.7)',
                color:'#1e293b',
                border:'3px solid rgba(255,255,255,0.9)',
                boxShadow:'0 4px 16px rgba(0,0,0,0.08)',
              }}>
              Darslarni ko&apos;r 📚
            </a>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40 C360 70 1080 10 1440 40 L1440 70 L0 70 Z" fill="white" fillOpacity="0.8" />
          </svg>
        </div>
      </section>

      {/* ══ SECTION 2: DARSLAR ═══════════════════════════════ */}
      <section id="learn" className="relative py-20 overflow-hidden"
        style={{ background:'white' }}>

        {/* Soft bg dots */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage:'radial-gradient(circle, #1e293b 1px, transparent 1px)', backgroundSize:'28px 28px' }} />

        <div className="relative max-w-5xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 rounded-full font-black text-sm mb-4"
              style={{ background:'#dbeafe', color:'#1d4ed8' }}>
              📚 O&apos;rgatuvchi qism
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-3" style={{ color:'#1e293b' }}>
              3 ta Muhim Dars
            </h2>
            <p className="text-lg font-semibold" style={{ color:'#64748b' }}>
              Har birida interaktiv o&apos;yin bor — bosing va o&apos;rganing! 👆
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {LESSONS.map((lesson, i) => (
              <LessonCard key={lesson.id} lesson={lesson} index={i} onStart={onStart} />
            ))}
          </div>

          {/* What you learn */}
          <div className="rounded-3xl p-8" style={{ background:'#f8fafc', border:'3px solid #e2e8f0' }}>
            <h3 className="font-black text-xl text-center mb-6" style={{ color:'#1e293b' }}>
              🎯 Nima o&apos;rganasiz?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { icon:'🔑', text:'Kuchli parol yaratish' },
                { icon:'🚫', text:'Begonadan himoya' },
                { icon:'⚠️', text:'Xavfli havolalarni tanish' },
                { icon:'📱', text:'Xavfsiz internet' },
                { icon:'👪', text:'Ota-onaga qachon aytish' },
                { icon:'🏆', text:'Bilimlarni sinovdan o\'tkazish' },
              ].map((item, i) => (
                <div key={i}
                  className="flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  style={{ background:'white', border:'2px solid #e2e8f0' }}>
                  <span className="text-2xl shrink-0 transition-transform duration-200 hover:scale-125">{item.icon}</span>
                  <span className="font-bold text-sm" style={{ color:'#334155' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 3: STATISTIKA + QUIZ CTA ════════════════ */}
      <section id="stats" className="relative py-20 overflow-hidden"
        style={{ background:'linear-gradient(160deg, #fefce8 0%, #eff6ff 50%, #f0fdf4 100%)' }}>

        {/* Blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full opacity-40 pointer-events-none"
          style={{ background:'radial-gradient(circle, #fde047, transparent)', animation:'morph-bg 10s ease-in-out infinite' }} />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full opacity-30 pointer-events-none"
          style={{ background:'radial-gradient(circle, #86efac, transparent)', animation:'morph-bg 12s ease-in-out 2s infinite' }} />

        <div className="relative max-w-5xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 rounded-full font-black text-sm mb-4"
              style={{ background:'#fefce8', color:'#a16207', border:'2px solid #fde047' }}>
              🎮 O&apos;yin markazi
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-3" style={{ color:'#1e293b' }}>
              Viktorinaga tayyormisan?
            </h2>
            <p className="text-lg font-semibold" style={{ color:'#64748b' }}>
              5 ta savol, 3 ta mukofot, 1 ta maqsad — XAVFSIZLIK! 🛡️
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            <StatCard emoji="📚" value={3}   label="Ta'lim darsi"   color="#3b82f6" delay={0}   />
            <StatCard emoji="🎮" value={5}   label="Savol"          color="#8b5cf6" delay={0.1} />
            <StatCard emoji="🏆" value={3}   label="Mukofot badge"  color="#f59e0b" delay={0.2} />
            <StatCard emoji="🌟" value={100} suffix="%" label="Bepul!" color="#22c55e" delay={0.3} />
          </div>

          {/* Quiz CTA card */}
          <div className="rounded-3xl overflow-hidden shadow-lg"
            style={{ border:'3px solid #fde047' }}>
            <div className="grid grid-cols-1 md:grid-cols-2">

              {/* Left */}
              <div className="p-8 flex flex-col gap-5" style={{ background:'white' }}>
                <h3 className="text-2xl font-black" style={{ color:'#1e293b' }}>
                  🎮 O&apos;yinga tayyor?
                </h3>
                <p className="font-semibold text-base" style={{ color:'#475569' }}>
                  {`${QUESTIONS.length} ta savol. Har to'g'ri javob = ⭐ ball. Oxirida mukofot kutadi! 🏆`}
                </p>

                {/* Grade bars */}
                <div className="flex flex-col gap-3">
                  {(Object.entries(GRADE_CONFIG) as [keyof typeof GRADE_CONFIG, typeof GRADE_CONFIG[keyof typeof GRADE_CONFIG]][]).map(([key, cfg]) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-xl w-8">{cfg.emoji}</span>
                      <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background:'#e2e8f0' }}>
                        <div className={`h-full bg-gradient-to-r ${cfg.bgColor} rounded-full`}
                          style={{ width: key==='excellent'?'100%':key==='good'?'65%':'35%' }} />
                      </div>
                      <span className="text-xs font-black w-16 text-right" style={{ color:'#64748b' }}>
                        {key==='excellent'?'5/5':key==='good'?'3-4':'0-2'} ball
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={e => { addRipple(e as React.MouseEvent<HTMLButtonElement>); onStart() }}
                  className="ripple-host btn-3d flex items-center justify-center gap-2
                    px-8 py-4 rounded-2xl font-black text-lg text-white
                    hover:-translate-y-1 transition-all duration-200"
                  style={{
                    background:'linear-gradient(135deg, #f59e0b, #d97706)',
                    boxShadow:'0 6px 0 #92400e, 0 10px 24px rgba(245,158,11,0.4)',
                  }}>
                  <span>Boshlash</span>
                  <span style={{ animation:'wiggle 1.5s ease-in-out infinite' }}>🚀</span>
                </button>
              </div>

              {/* Right — sample question */}
              <div className="p-8 flex flex-col gap-3"
                style={{ background:'#fefce8', borderLeft:'3px solid #fde047' }}>
                <p className="font-black text-xs uppercase tracking-widest" style={{ color:'#92400e' }}>
                  Namuna savol 👇
                </p>
                <div className="rounded-2xl p-4 text-center"
                  style={{ background:'white', border:'2px solid #fde047' }}>
                  <span className="text-4xl">🤔</span>
                  <p className="font-black text-base mt-2" style={{ color:'#1e293b' }}>
                    {QUESTIONS[0].question}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {QUESTIONS[0].options.map((opt, i) => (
                    <div key={i} className="rounded-xl px-3 py-2 text-sm font-black text-center"
                      style={{
                        background: i===QUESTIONS[0].correctIndex ? '#dcfce7' : '#f1f5f9',
                        color:      i===QUESTIONS[0].correctIndex ? '#16a34a' : '#64748b',
                        border:     `2px solid ${i===QUESTIONS[0].correctIndex ? '#86efac' : '#e2e8f0'}`,
                      }}>
                      {i===QUESTIONS[0].correctIndex?'✅ ':''}{opt}
                    </div>
                  ))}
                </div>
                <p className="text-xs font-semibold" style={{ color:'#92400e' }}>
                  💡 {QUESTIONS[0].explanation}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}
