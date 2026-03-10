export default function ProductCard({ product, index }) {
  return (
    <article
      className="product-card fade-up"
      style={{ animationDelay: `${index * 55}ms` }}
    >
      {/* Image area */}
      <div className="product-card-img bg-cream-200 relative">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          /* Placeholder with ornament */
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border border-cream-400 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-cream-400" />
            </div>
            <span className="index-label">{product.material?.split(' · ')[0]}</span>
          </div>
        )}

        {/* Hover overlay — price */}
        <div className="absolute inset-0 bg-stone-950/0 group-hover/card:bg-stone-950/5 transition-colors duration-500" />
      </div>

      {/* Info */}
      <div className="pt-4 pb-6">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-sans text-sm font-medium text-stone-950 leading-snug">
              {product.name}
            </h4>
            {product.material && (
              <p className="index-label mt-1">{product.material}</p>
            )}
          </div>
          {product.price && (
            <p className="font-display text-base font-medium text-stone-950 whitespace-nowrap">
              {product.price}
            </p>
          )}
        </div>

        {product.description && (
          <p className="font-sans text-xs text-stone-400 leading-relaxed mt-2 line-clamp-2">
            {product.description}
          </p>
        )}

        <button className="btn-outline mt-4 px-5 py-2 w-full">
          Дізнатись більше
        </button>
      </div>
    </article>
  )
}
