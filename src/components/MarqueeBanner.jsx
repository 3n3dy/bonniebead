export default function MarqueeBanner() {
  const text = 'більше фото та відео в інстаграм — підписуйся'
  // Повторюємо текст щоб заповнити рядок
  const items = Array(8).fill(text)

  const handleClick = () => {
    const footer = document.querySelector('footer')
    if (footer) footer.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div
      onClick={handleClick}
      className="w-full overflow-hidden cursor-pointer group"
      style={{ background: '#d4c0c9' }}
    >
      <div className="flex items-center py-2.5 marquee-track">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-4 flex-shrink-0 px-6">
            <span className="text-xs tracking-widest uppercase font-sans text-stone-700 group-hover:text-stone-950 transition-colors whitespace-nowrap">
              {item}
            </span>
            <span className="text-stone-500 text-xs">✦</span>
          </span>
        ))}
        {/* Дублюємо для безшовної анімації */}
        {items.map((item, i) => (
          <span key={`dup-${i}`} className="flex items-center gap-4 flex-shrink-0 px-6">
            <span className="text-xs tracking-widest uppercase font-sans text-stone-700 group-hover:text-stone-950 transition-colors whitespace-nowrap">
              {item}
            </span>
            <span className="text-stone-500 text-xs">✦</span>
          </span>
        ))}
      </div>

      <style>{`
        .marquee-track {
          animation: marquee 25s linear infinite;
          width: max-content;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
