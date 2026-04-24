export default function MarqueeBanner() {
  const text1 = 'Більше фото та відео в інстаграм — підписуйся'
  const text2 = 'По Україні безкоштовна доставка від 1000 грн'

  const handleClickTop = () => {
    const footer = document.querySelector('footer')
    if (!footer) return
    footer.scrollIntoView({ behavior: 'smooth', block: 'start' })

    setTimeout(() => {
      const igLink = document.querySelector('a[href*="instagram"]')
      if (igLink) {
        igLink.classList.add('instagram-highlight')
        setTimeout(() => igLink.classList.remove('instagram-highlight'), 2500)
      }
    }, 700)
  }

  const handleClickBottom = () => {
    const catalogLink = document.querySelector('a[href*="catalog"], .catalog-link, #catalog')
    if (catalogLink) {
      catalogLink.click()
    } else {
      document.querySelector('.catalog-section')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="w-full select-none group" style={{ background: '#d4c0c9' }}>
      <div className="marquee-wrapper">
        {/* ПЕРШИЙ НЕЗАЛЕЖНИЙ РЯДОК */}
        <div className="marquee-row independent-row-top" onClick={handleClickTop}>
          <div className="marquee-track marquee-track--ltr">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={`top-${i}`} className="marquee-item">
                {text1}
              </span>
            ))}
          </div>
        </div>

        <div className="h-px mx-auto bg-white"></div>

        <div className="marquee-row independent-row-bottom" onClick={handleClickBottom}>
          <div className="marquee-track marquee-track--rtl">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={`bottom-${i}`} className="marquee-item">
                {text2}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .marquee-wrapper {
          overflow: hidden;
          padding: 0.75rem 0;
        }

        /* ПЕРШИЙ РЯДОК - незалежний */
        .independent-row-top {
          height: 1.5rem;
          overflow: hidden;
          position: relative;
          margin-bottom: 0;
        }

        .independent-row-top .marquee-track {
          position: absolute;
          bottom: 45.5%;
          left: 0;
          right: 0;
          display: inline-flex;
          white-space: nowrap;
          width: max-content;
          animation: marquee 60s linear infinite;
          font-family: 'Arvo', Georgia, serif;
          font-size: 0.75rem;
          line-height: 1;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgb(87, 83, 78);
          align-items: flex-start;
        }

        .independent-row-bottom {
          height: 1.5rem;
          overflow: hidden;
          position: relative;
          margin-top: 0;
        }

        .independent-row-bottom .marquee-track {
          position: absolute;
          bottom: -1.5%;
          left: 0;
          right: 0;
          display: inline-flex;
          white-space: nowrap;
          width: max-content;
          animation: marquee-rtl 60s linear infinite;
          font-family: 'Arvo', Georgia, serif;
          font-size: 0.75rem;
          line-height: 1;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgb(87, 83, 78);
          align-items: flex-start;
        }

        .marquee-track:hover {
          animation-play-state: paused !important;
        }

        .group:hover .marquee-track {
          color: rgb(12, 10, 9);
        }

        .marquee-item {
          padding-inline: 3rem;
          flex-shrink: 0;
        }

        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes marquee-rtl {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }

        @keyframes igPulse {
          0% { color: #d4c0c9; text-shadow: 0 0 0px #d4c0c9; }
          30% { color: #9d4e6b; text-shadow: 0 0 12px rgba(212,192,201,0.6); }
          60% { color: #d4c0c9; text-shadow: 0 0 0px #d4c0c9; }
          80% { color: #9d4e6b; }
          100% { color: inherit; text-shadow: none; }
        }

        .instagram-highlight {
          animation: igPulse 2.5s ease forwards !important;
        }
      `}</style>
    </div>
  )
}
