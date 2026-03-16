import { useState } from 'react'
import { useCart } from '../cart/CartContext'
import { useUser } from '../user/UserContext'

export default function ProductCard({ product, catName }) {
  const { add } = useCart()
  const { isWishlisted, toggleWishlist, addToHistory } = useUser()
  const [added, setAdded] = useState(false)

  const images = product.images?.length
    ? product.images
    : product.image ? [product.image] : []
  const [active, setActive] = useState(0)
  const wishlisted = isWishlisted(product.id)

  const handleAdd = () => {
    add(product, catName)
    addToHistory(product, catName)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleView = () => {
    addToHistory(product, catName)
  }

  return (
    <article className="product-card fade-up" onClick={handleView}>

      {/* Image */}
      <div className="product-card-img bg-cream-200 relative group/img">
        {images.length > 0 ? (
          <img src={images[active]} alt={product.name} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border border-cream-400 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-cream-400" />
            </div>
            <span className="index-label">{product.material?.split(' · ')[0]}</span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={e => { e.stopPropagation(); toggleWishlist(product) }}
          className={`absolute top-3 left-3 w-7 h-7 flex items-center justify-center transition-all ${
            wishlisted
              ? 'text-stone-950 scale-110'
              : 'text-stone-400 hover:text-stone-700'
          }`}
          title={wishlisted ? 'Прибрати з обраного' : 'Додати в обране'}
        >
          {wishlisted ? '♥' : '♡'}
        </button>

        {/* Image dots / arrows */}
        {images.length > 1 && (
          <>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <button key={i} onClick={e => { e.stopPropagation(); setActive(i) }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === active ? 'bg-stone-950 scale-125' : 'bg-stone-950/30'}`}
                />
              ))}
            </div>
            <button onClick={e => { e.stopPropagation(); setActive(i => (i - 1 + images.length) % images.length) }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-cream-100/80 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity text-stone-600 hover:text-stone-950">‹</button>
            <button onClick={e => { e.stopPropagation(); setActive(i => (i + 1) % images.length) }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-cream-100/80 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity text-stone-600 hover:text-stone-950">›</button>
          </>
        )}
      </div>

      {/* Info */}
      <div className="pt-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-sans text-sm font-medium text-stone-950 leading-snug">{product.name}</h4>
            {product.material && <p className="index-label mt-1">{product.material}</p>}
          </div>
          {product.price && (
            <p className="font-display text-base font-medium text-stone-950 whitespace-nowrap">{product.price}</p>
          )}
        </div>
        {product.description && (
          <p className="font-sans text-xs text-stone-400 leading-relaxed mt-2 line-clamp-2">{product.description}</p>
        )}
        <button
          onClick={e => { e.stopPropagation(); handleAdd() }}
          className={`mt-4 w-full py-2.5 text-xs tracking-widest uppercase font-medium transition-all duration-300 ${
            added ? 'bg-stone-950 text-cream-100 border border-stone-950' : 'btn-outline'
          }`}
        >
          {added ? '✓ Додано' : 'Додати в кошик'}
        </button>
      </div>
    </article>
  )
}
