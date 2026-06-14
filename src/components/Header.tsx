'use client'

import { useEffect, useState } from 'react'
import { ShieldIcon } from '@/components/Icons'

interface HeaderProps {
  mode: 'landing' | 'app'
  screen?: string
  score?: number
  totalQuestions?: number
  onLogoClick?: () => void
}

const NAV_LINKS = [
  { href: '#hero',  label: '🏠 Bosh sahifa' },
  { href: '#learn', label: '📚 Darslar'      },
  { href: '#stats', label: '🎮 O\'yin'        },
]

export default function Header({
  mode, screen, score = 0, totalQuestions = 5, onLogoClick,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const screenLabel: Record<string, string> = {
    learn:  '📚 Darslar',
    quiz:   '📝 Viktorina',
    game:   '🎮 Kiber O\'yin',
    result: '🏆 Natija',
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled || mode === 'app'
          ? 'rgba(255,255,255,0.95)'
          : 'transparent',
        backdropFilter: scrolled || mode === 'app' ? 'blur(16px)' : 'none',
        borderBottom: scrolled || mode === 'app' ? '3px solid #fde047' : 'none',
        boxShadow: scrolled || mode === 'app' ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <button onClick={onLogoClick} className="flex items-center gap-2 group">
          <ShieldIcon className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" animate={true} />
          <div className="leading-tight">
            <p className="font-black text-base" style={{ color: '#1e293b' }}>
              Internet
            </p>
            <p className="font-black text-sm text-yellow-500">Xavfsizligi</p>
          </div>
        </button>

        {/* Landing nav */}
        {mode === 'landing' && (
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="font-bold text-sm px-4 py-2 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{ color: '#475569' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = '#fef9c3'
                  ;(e.currentTarget as HTMLElement).style.color = '#1e293b'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent'
                  ;(e.currentTarget as HTMLElement).style.color = '#475569'
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {/* App breadcrumb */}
        {mode === 'app' && screen && screen !== 'intro' && (
          <div className="flex items-center gap-2">
            <span
              className="font-black text-sm px-4 py-1.5 rounded-xl"
              style={{ background: '#fef9c3', color: '#1e293b' }}
            >
              {screenLabel[screen] ?? screen}
            </span>
            {(screen === 'quiz' || screen === 'game') && (
              <span
                className="font-black text-base px-4 py-1.5 rounded-xl"
                style={{ background: '#fde047', color: '#1e293b' }}
              >
                ⭐ {screen === 'quiz' ? `${score}/${totalQuestions}` : `${score} ball`}
              </span>
            )}
          </div>
        )}

        {/* Mobile hamburger */}
        {mode === 'landing' && (
          <button
            className="md:hidden p-2 rounded-xl transition-colors"
            style={{ color: '#1e293b' }}
            onClick={() => setMenuOpen(p => !p)}
            aria-label="Menyu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`block h-0.5 bg-slate-700 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-slate-700 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-slate-700 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        )}
      </div>

      {/* Mobile menu */}
      {mode === 'landing' && menuOpen && (
        <div className="md:hidden border-t-2 border-yellow-300 px-4 py-3 flex flex-col gap-1"
          style={{ background: 'rgba(255,255,255,0.98)' }}>
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-bold text-base px-4 py-3 rounded-xl transition-all hover:bg-yellow-50"
              style={{ color: '#1e293b' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
