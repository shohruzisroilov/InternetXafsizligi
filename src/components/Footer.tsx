export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>

      {/* Top wave */}
      <div className="pointer-events-none -mb-1">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0 C360 60 1080 0 1440 40 L1440 0 L0 0 Z" fill="white" fillOpacity="0.06" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col items-center gap-8">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className="text-4xl" style={{ animation: 'float 3s ease-in-out infinite' }}>🛡️</span>
          <div>
            <p className="font-black text-white text-xl">Internet Xavfsizligi</p>
            <p className="text-sm font-semibold" style={{ color:'#94a3b8' }}>
              Bolalar uchun bepul ta&apos;lim 💚
            </p>
          </div>
        </div>

        {/* 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-center md:text-left">

          {/* About */}
          <div className="flex flex-col gap-3">
            <h3 className="font-black text-base text-white">📖 Haqida</h3>
            <p className="text-sm font-medium leading-relaxed" style={{ color:'#94a3b8' }}>
              Bolalar internetda xavfsiz yurishni o&apos;rganadigan
              interaktiv o&apos;yin platformasi.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-black text-base text-white">🔗 Bo&apos;limlar</h3>
            <div className="flex flex-col gap-2">
              {[
                { icon:'📚', label:'Darslar',   href:'#learn' },
                { icon:'🎮', label:'O\'yin',    href:'#stats' },
                { icon:'🏆', label:'Mukofotlar',href:'#stats' },
              ].map(item => (
                <a key={item.label} href={item.href}
                  className="flex items-center gap-2 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 justify-center md:justify-start"
                  style={{ color:'#94a3b8' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fde047'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#94a3b8'}>
                  <span>{item.icon}</span>{item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Safety tip */}
          <div className="flex flex-col gap-3">
            <h3 className="font-black text-base text-white">💡 Maslahat</h3>
            <div className="rounded-2xl p-3" style={{ background:'rgba(253,224,71,0.1)', border:'2px solid rgba(253,224,71,0.2)' }}>
              <p className="text-sm font-bold" style={{ color:'#fde047' }}>
                Har sayt uchun boshqa parol ishlatgin — bu seni himoya qiladi! 🔐
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px" style={{ background:'rgba(255,255,255,0.08)' }} />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-3">
          <p className="text-xs font-semibold" style={{ color:'#475569' }}>
            © 2024 Internet Xavfsizligi
          </p>
          <div className="flex items-center gap-3">
            {['🔒','🛡️','✅','🎓','🌈'].map((emoji, i) => (
              <span key={i} className="text-xl icon-interactive"
                style={{ opacity:0.5, animationDelay:`${i*0.25}s` }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0.5'}>
                {emoji}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
