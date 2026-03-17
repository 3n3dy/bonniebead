import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useCart } from '../cart/CartContext'
import { useUser } from '../user/UserContext'

export default function ProductModal({ product, catName, onClose }) {
  const { add } = useCart()
  const { isWishlisted, toggleWishlist } = useUser()
  const [added, setAdded] = useState(false)
  const [active, setActive] = useState(0)

  const images = product.images?.length
    ? product.images
    : product.image ? [product.image] : []

  const wishlisted = isWishlisted(product.id)

  const handleAdd = () => {
    add(product, catName)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ background: 'rgba(10,10,8,0.88)', backdropFilter: 'blur(10px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-2xl bg-cream-100 flex flex-col md:flex-row overflow-hidden"
        style={{ maxHeight: '90vh', animation: 'fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both' }}
      >
        {/* Фото — ліва частина */}
        <div className="w-full md:w-1/2 bg-cream-200 relative flex-shrink-0">
          {images.length > 0 ? (
            <>
              <div className="aspect-square overflow-hidden">
                <img
                  src={images[active]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Dots */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        i === active ? 'bg-stone-950 scale-125' : 'bg-stone-950/30 hover:bg-stone-950/60'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Thumbnails — якщо 2-3 фото */}
              {images.length > 1 && (
                <div className="flex gap-1.5 p-3 bg-cream-100 border-t border-cream-300">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`w-12 h-12 overflow-hidden flex-shrink-0 transition-all ${
                        i === active ? 'ring-1 ring-stone-950 opacity-100' : 'opacity-50 hover:opacity-80'
                      }`}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-square flex items-center justify-center">
              <div className="w-14 h-14 border border-cream-400 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-cream-400" />
              </div>
            </div>
          )}
        </div>

        {/* Інфо — права частина */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Close */}
          <div className="flex justify-end px-5 pt-4 flex-shrink-0">
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-950 transition-colors text-xl w-7 h-7 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          <div className="px-6 pb-8 flex flex-col flex-1">
            {/* Category */}
            <p className="index-label mb-2">{catName}</p>

            {/* Name */}
            <h2 className="font-display text-2xl md:text-3xl font-medium text-stone-950 leading-tight mb-2">
              {product.name}
            </h2>

            {/* Price */}
            {product.price && (
              <p className="font-display text-2xl font-medium text-stone-950 mb-4">
                {product.price}
              </p>
            )}

            {/* Divider */}
            <div className="w-8 h-px bg-blush mb-5" />

            {/* Material */}
            {product.material && (
              <div className="mb-4">
                <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">Матеріал</p>
                <p className="text-sm text-stone-700">{product.material}</p>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="mb-6 flex-1">
                <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">Опис</p>
                <p className="text-sm text-stone-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-auto pt-4">
              <button
                onClick={handleAdd}
                className={`flex-1 py-3 text-xs tracking-widest uppercase font-medium transition-all duration-300 ${
                  added
                    ? 'bg-stone-950 text-cream-100 border border-stone-950'
                    : 'btn-dark'
                }`}
              >
                {added ? '✓ Додано в кошик' : 'Додати в кошик'}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`w-12 h-12 flex items-center justify-center border transition-all text-lg ${
                  wishlisted
                    ? 'border-stone-950 text-stone-950 bg-stone-950/5'
                    : 'border-cream-300 text-stone-400 hover:border-stone-400 hover:text-stone-700'
                }`}
                title={wishlisted ? 'Прибрати з обраного' : 'Додати в обране'}
              >
                {wishlisted ? '♥' : '♡'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  )
}
