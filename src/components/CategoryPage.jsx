import ProductCard from './ProductCard'

export default function CategoryPage({ category, onBack }) {
  return (
    <div className="min-h-screen">
      {/* Page hero strip */}
      <div className="bg-stone-950 text-cream-100">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-14 md:py-20">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-cream-400 hover:text-cream-100 transition-colors mb-10 group"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
                className="group-hover:-translate-x-0.5 transition-transform" />
            </svg>
            <span className="text-xs tracking-widest2 uppercase">Каталог</span>
          </button>

          <div className="grid grid-cols-12 items-end gap-6">
            <div className="col-span-12 md:col-span-7">
              <p className="font-sans text-xs tracking-widest2 uppercase text-blush mb-4">
                {category.nameLatin}
              </p>
              <h2 className="font-display text-5xl md:text-7xl font-medium leading-tight">
                {category.name}
              </h2>
            </div>
            <div className="col-span-12 md:col-span-5 md:text-right">
              <p className="font-sans text-sm text-cream-300 leading-relaxed">
                {category.note}
              </p>
              <p className="index-label mt-3 text-stone-500">
                {category.products.length} найменувань
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-14">
        {category.products.length === 0 ? (
          <div className="py-32 text-center">
            <p className="font-display text-2xl text-stone-300 italic">Незабаром тут з'являться товари</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 group/grid">
            {category.products.map((product, i) => (
              <div key={product.id} className="group/card">
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom strip */}
      <div className="rule" />
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="link-underline text-xs tracking-widest2 uppercase font-sans text-stone-500 hover:text-stone-950 transition-colors"
        >
          ← Повернутись до каталогу
        </button>
        <p className="index-label">{category.name} / MAISON</p>
      </div>
    </div>
  )
}
