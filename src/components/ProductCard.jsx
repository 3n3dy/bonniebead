import { useState } from 'react'
import { useCart } from '../cart/CartContext'
import { useUser } from '../user/UserContext'
import ProductModal from './ProductModal'

export default function ProductCard({ product, catName }) {
  const { add } = useCart()
  const { isWishlisted, toggleWishlist, addToHistory } = useUser()
  const [added, setAdded] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const images = product.images?.length
    ? product.images
    : product.image ? [product.image] : []
  const [active, setActive] = useState(0)
  const wishlisted = isWishlisted(product.id)

  const handleAdd = (e) => {
    e.stopPropagation()
    add(product, catName)
    addToHistory(product, catName)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleOpen = () => {
    addToHistory(product, catName)
    setShowModal(true)
  }

  return (
    <>
      <article className="product-card fade-up cursor-pointer group/card" onClick={handleOpen}>

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

          {/* Wishlist */}
          <button
            onClick={e => { e.stopPropagation(); toggleWishlist(product) }}
            className={`absolute top-3 left-3 w-7 h-7 flex items-center justify-center transition-all ${
              wishlisted ? 'text-stone-950 scale-110' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            {wishlisted ? '♥' : '♡'}
          </button>

          {/* Hover overlay — підказка */}
          <div className="absolute inset-0 bg-stone-950/0 group-hover/card:bg-stone-950/10 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 bg-cream-100/90 text-stone-800 text-xs tracking-widest uppercase px-3 py-1.5">
              Переглянути
            </span>
          </div>

          {/* Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <button key={i}
                  onClick={e => { e.stopPropagation(); setActive(i) }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === active ? 'bg-stone-950 scale-125' : 'bg-stone-950/30'}`}
                />
              ))}
            </div>
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
            onClick={handleAdd}
            className={`mt-4 w-full py-2.5 text-xs tracking-widest uppercase font-medium transition-all duration-300 ${
              added ? 'bg-stone-950 text-cream-100 border border-stone-950' : 'btn-outline'
            }`}
          >
            {added ? '✓ Додано' : 'Додати в кошик'}
          </button>
        </div>
      </article>

      {showModal && (
        <ProductModal
          product={product}
          catName={catName}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
