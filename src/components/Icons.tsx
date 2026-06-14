'use client'

import React from 'react'

// Premium Gradient Shield Icon
export function ShieldIcon({ className = 'w-8 h-8', animate = true }: { className?: string; animate?: boolean }) {
  return (
    <svg
      className={`${className} ${animate ? 'animate-float' : ''} transition-transform duration-300`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="shieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="shieldBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <filter id="shieldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Outer shield structure */}
      <path
        d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z"
        fill="url(#shieldBlue)"
        stroke="url(#shieldGold)"
        strokeWidth="1.5"
        filter="url(#shieldGlow)"
      />
      {/* Inner secure highlight */}
      <path
        d="M12 4L5 7.5V12c0 4.5 3 8.5 7 9.5 4-1 7-5 7-9.5V7.5L12 4z"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1"
        strokeDasharray="2 2"
        opacity="0.6"
      />
      {/* Central emblem: checkmark inside shield */}
      <path
        d="M9 11.5L11 13.5L15 9.5"
        stroke="url(#shieldGold)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Premium Lock Icon
export function LockIcon({ className = 'w-12 h-12', color = '#ef4444' }: { className?: string; color?: string }) {
  return (
    <svg
      className={`${className} transition-all duration-300 hover:scale-105`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="lockBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={`${color}cc`} />
        </linearGradient>
        <filter id="lockShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.25" />
        </filter>
      </defs>
      {/* Shackle */}
      <path
        d="M6 10V7C6 3.69 8.69 1 12 1C15.31 1 18 3.69 18 7V10"
        stroke="#475569"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Lock Body */}
      <rect
        x="4"
        y="9"
        width="16"
        height="12"
        rx="3"
        fill="url(#lockBodyGrad)"
        stroke="#ffffff"
        strokeWidth="1"
        filter="url(#lockShadow)"
      />
      {/* Keyhole */}
      <circle cx="12" cy="14" r="1.5" fill="#ffffff" />
      <path d="M12 15.5V17.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// Premium Unlock Icon
export function UnlockIcon({ className = 'w-12 h-12', color = '#22c55e' }: { className?: string; color?: string }) {
  return (
    <svg
      className={`${className} transition-all duration-300 hover:scale-105`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="unlockBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={`${color}cc`} />
        </linearGradient>
        <filter id="unlockShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.25" />
        </filter>
      </defs>
      {/* Shackle (Open) */}
      <path
        d="M6 10V7C6 3.69 8.69 1 12 1C15.31 1 18 3.69 18 7V8.5"
        stroke="#475569"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="animate-unlock-shackle"
      />
      {/* Lock Body */}
      <rect
        x="4"
        y="9"
        width="16"
        height="12"
        rx="3"
        fill="url(#unlockBodyGrad)"
        stroke="#ffffff"
        strokeWidth="1"
        filter="url(#unlockShadow)"
      />
      {/* Keyhole */}
      <circle cx="12" cy="14" r="1.5" fill="#ffffff" />
      <path d="M12 15.5V17.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// Premium Warning Icon (glowing amber triangle)
export function WarningIcon({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg
      className={`${className} animate-pulse-slow`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="warnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <filter id="warnGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <path
        d="M12 3L2 21H22L12 3Z"
        fill="url(#warnGrad)"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinejoin="round"
        filter="url(#warnGlow)"
      />
      {/* Exclamation point */}
      <path d="M12 9V14" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.25" fill="#ffffff" />
    </svg>
  )
}

// Premium Trophy Icon (unlocked badge reward)
export function TrophyIcon({ className = 'w-12 h-12', color = '#f59e0b', animate = true }: { className?: string; color?: string; animate?: boolean }) {
  return (
    <svg
      className={`${className} ${animate ? 'animate-float-3d' : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="trophyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="50%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Trophy Base */}
      <path d="M7 21H17V22H7V21Z" fill="#78350f" stroke="#ffffff" strokeWidth="0.5" />
      <path d="M10 18H14V21H10V18Z" fill="#92400e" />
      <path d="M8 18H16L15 16H9L8 18Z" fill="url(#trophyGrad)" />
      {/* Trophy Handles */}
      <path d="M5 9C5 6.5 7 5.5 8 5.5V7C7.5 7 6.5 7.5 6.5 9C6.5 11 8 11.5 8.5 11.5V13C7 13 5 11.5 5 9ZM19 9C19 6.5 17 5.5 16 5.5V7C16.5 7 17.5 7.5 17.5 9C17.5 11 16 11.5 15.5 11.5V13C17 13 19 11.5 19 9Z" fill="url(#trophyGrad)" />
      {/* Trophy Cup */}
      <path
        d="M6 5.5H18V11C18 14.31 15.31 17 12 17C8.69 17 6 14.31 6 11V5.5Z"
        fill="url(#trophyGrad)"
        stroke="#ffffff"
        strokeWidth="0.75"
        filter="url(#goldGlow)"
      />
      {/* Star detailing on the cup */}
      <path d="M12 7.5L13.1 9.7L15.5 10L13.7 11.7L14.2 14.1L12 12.9L9.8 14.1L10.3 11.7L8.5 10L10.9 9.7L12 7.5Z" fill="#ffffff" />
    </svg>
  )
}

// Premium Star Badge / Score Icon
export function StarIcon({ className = 'w-6 h-6', color = '#fde047', animate = false }: { className?: string; color?: string; animate?: boolean }) {
  return (
    <svg
      className={`${className} ${animate ? 'animate-pulse' : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.5L15.09 8.76L22 9.77L17 14.64L18.18 21.5L12 18.25L5.82 21.5L7 14.64L2 9.77L8.91 8.76L12 2.5Z"
        fill="url(#starGrad)"
        stroke="#ffffff"
        strokeWidth="0.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Premium Graduation Cap Badge Icon
export function GraduationIcon({ className = 'w-12 h-12', color = '#3b82f6', unlocked = true }: { className?: string; color?: string; unlocked?: boolean }) {
  return (
    <svg
      className={`${className} transition-all duration-300 ${unlocked ? 'animate-float' : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gradCap" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={unlocked ? color : '#94a3b8'} />
          <stop offset="100%" stopColor={unlocked ? '#1e40af' : '#64748b'} />
        </linearGradient>
        <filter id="capShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Cap base (underpart) */}
      <path
        d="M6 13.5V17C6 18.5 8.5 19.5 12 19.5C15.5 19.5 18 18.5 18 17V13.5C18 13.5 15.5 15 12 15C8.5 15 6 13.5 6 13.5Z"
        fill="url(#gradCap)"
        stroke="#ffffff"
        strokeWidth="0.5"
      />
      {/* Rhombus (top cap board) */}
      <path
        d="M12 4L2 9L12 14L22 9L12 4Z"
        fill="url(#gradCap)"
        stroke="#ffffff"
        strokeWidth="1"
        filter="url(#capShadow)"
      />
      {/* Tassel */}
      <path
        d="M17 9.5V15.5L18.5 16.5V18.5L17.5 19.5L16.5 18.5V16.5L18 15.5"
        stroke={unlocked ? '#f59e0b' : '#cbd5e1'}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Wrapper for raw emojis to look 3D and premium with customized colorful pastel gradient background containers
export function EmojiWrapper({
  emoji,
  size = 'md',
  bgType = 'blue',
  className = '',
}: {
  emoji: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  bgType?: 'blue' | 'purple' | 'orange' | 'green' | 'yellow' | 'pink' | 'glass'
  className?: string
}) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-sm',
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-24 h-24 text-5xl',
  }

  const bgClasses = {
    blue: 'bg-gradient-to-br from-blue-50 to-blue-200 border-blue-200/60 shadow-blue-200/50',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-200 border-purple-200/60 shadow-purple-200/50',
    orange: 'bg-gradient-to-br from-orange-50 to-orange-200 border-orange-200/60 shadow-orange-200/50',
    green: 'bg-gradient-to-br from-green-50 to-green-200 border-green-200/60 shadow-green-200/50',
    yellow: 'bg-gradient-to-br from-yellow-50 to-yellow-200 border-yellow-200/60 shadow-yellow-200/50',
    pink: 'bg-gradient-to-br from-pink-50 to-pink-200 border-pink-200/60 shadow-pink-200/50',
    glass: 'bg-white/40 backdrop-blur-md border-white/60 shadow-black/5',
  }

  return (
    <div
      className={`
        inline-flex items-center justify-center rounded-2xl border shadow-lg
        transition-all duration-300 hover:scale-110 hover:-translate-y-0.5
        ${sizeClasses[size]}
        ${bgClasses[bgType]}
        ${className}
      `}
      style={{
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.06))',
      }}
    >
      <span
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
        }}
        className="select-none leading-none animate-float-slow"
      >
        {emoji}
      </span>
    </div>
  )
}
