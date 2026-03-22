export default function MarqueeBanner() {
  const text = 'більше фото та відео в інстаграм — підписуйся'
  const items = Array(8).fill(text)

  const handleClick = () => {
    const footer = document.querySelector('footer')
    if (!footer) return

    footer.scrollIntoView({ behavior: 'smooth', block: 'start' })

    // Підсвічуємо Instagram посилання після скролу
    setTimeout(() => {
      const igLink = document.querySelector('a[href*="instagram"]')
      if (!igLink) return

      igLink.classList.add('instagram-highlight')
      setTimeout(() => igLink.classList.remove('instagram-highlight'), 2500)
    }, 700)
  }

  return (
    <div
      onClick={handleClick}
      className="w-full overflow-hidden cursor-pointer group select-none"
      style={{ background: '#d4c0c9' }}
    >
      <div className="flex items-center py-3 marquee-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-5 flex-shrink-0 px-8">
            <span className="text-xs tracking-widest uppercase font-sans text-stone-600 group-hover:text-stone-950 transition-colors duration-300 whitespace-nowrap">
              {item}
            </span>
            <span className="text-stone-400 text-xs group-hover:text-stone-600 transition-colors">✦</span>
          </span>
        ))}
      </div>

      <style>{`
        .marquee-track {
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes igPulse {
          0%   { color: #d4c0c9; text-shadow: 0 0 0px #d4c0c9; }
          30%  { color: #9d4e6b; text-shadow: 0 0 12px rgba(212,192,201,0.6); }
          60%  { color: #d4c0c9; text-shadow: 0 0 0px #d4c0c9; }
          80%  { color: #9d4e6b; }
          100% { color: inherit; text-shadow: none; }
        }
        .instagram-highlight {
          animation: igPulse 2.5s ease forwards !important;
        }
      `}</style>
    </div>
  )
}
