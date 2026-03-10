export default function Header({ onHome }) {
  return (
    <header className="sticky top-0 z-40 bg-cream-100/90 backdrop-blur-sm">
      <div className="rule" />

      <div className="max-w-screen-xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        {/* Left — nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#catalog" className="link-underline text-xs tracking-widest2 uppercase font-sans text-stone-500 hover:text-stone-950 transition-colors">
            Каталог
          </a>
          <a href="#about" className="link-underline text-xs tracking-widest2 uppercase font-sans text-stone-500 hover:text-stone-950 transition-colors">
            Про нас
          </a>
        </nav>

        {/* Center — wordmark */}
        <button
          onClick={onHome}
          className="absolute left-1/2 -translate-x-1/2 font-display text-2xl tracking-widest2 font-medium text-stone-950 hover:opacity-70 transition-opacity"
        >
          BONNIEBEAD
        </button>

        {/* Right — contacts */}
        <div className="hidden md:flex items-center gap-6">
          <span className="index-label">Уся Україна</span>
          <a
            href="tel:+380950571649"
            className="link-underline text-xs tracking-widest2 uppercase font-sans text-stone-500 hover:text-stone-950 transition-colors"
          >
            Зв'язатись
          </a>
        </div>

        {/* Mobile — burger placeholder */}
        <button className="md:hidden flex flex-col gap-1.5 p-1">
          <span className="w-5 h-px bg-stone-950 block" />
          <span className="w-4 h-px bg-stone-950 block" />
        </button>
      </div>

      <div className="rule" />
    </header>
  )
}
