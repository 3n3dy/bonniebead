export default function CatalogGrid({ categories, onSelect }) {
  return (
    <section id="catalog" className="max-w-screen-xl mx-auto px-6 md:px-12 pb-24">
      {/* Section label */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="rule-blush w-8" />
          <p className="text-xs tracking-widest2 uppercase font-sans text-stone-500">Каталог</p>
        </div>
        
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-cream-300">
        {categories.map((cat, i) => (
          <CategoryTile key={cat.id} cat={cat} index={i} onSelect={onSelect} />
        ))}
      </div>
    </section>
  )
}

function CategoryTile({ cat, index, onSelect }) {
  return (
    <button
      onClick={() => onSelect(cat.id)}
      className="group bg-cream-100 hover:bg-cream-200 transition-colors duration-300 text-left p-8 md:p-10 flex flex-col justify-between min-h-[220px]"
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <span className="index-label">{String(index + 1).padStart(2, '0')}</span>
        <span className="font-sans text-xs text-stone-400 tracking-widest uppercase">
          {cat.products.length} од.
        </span>
      </div>

      {/* Name block */}
      <div>
        <p className="font-sans text-xs tracking-widest2 uppercase text-blush mb-2">
          {cat.nameLatin}
        </p>
        <h3 className="font-display text-3xl md:text-4xl font-medium text-stone-950 group-hover:italic transition-all duration-300">
          {cat.name}
        </h3>
        <div className="flex items-center justify-between mt-4">
          <p className="font-sans text-xs text-stone-400">{cat.note}</p>
          {/* Arrow */}
          <span className="w-7 h-7 border border-stone-300 group-hover:border-stone-950 group-hover:bg-stone-950 rounded-full flex items-center justify-center transition-all duration-300">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke="currentColor" strokeWidth="1.2"
                className="text-stone-400 group-hover:text-cream-100 transition-colors duration-300" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
    </button>
  )
}
