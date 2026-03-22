import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../cart/CartContext'
import { useUser } from '../user/UserContext'

export default function ProductModal({ product, catName, onClose }) {
  const { t, i18n } = useTranslation()
  const { add } = useCart()
  const { isWishlisted, toggleWishlist } = useUser()
  const [added, setAdded] = useState(false)
  const [active, setActive] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  const isEN = i18n.language === 'en'
  const name        = isEN && product.nameEN        ? product.nameEN        : product.name
  const description = isEN && product.descriptionEN ? product.descriptionEN : product.description

  const images = product.images?.length ? product.images : product.image ? [product.image] : []
  const wishlisted = isWishlisted(product.id)

  const handleAdd = () => {
    add(product, catName)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6"
        style={{ background: 'rgba(10,10,8,0.92)', backdropFilter: 'blur(12px)' }}
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <div
          className="w-full h-full md:h-auto md:max-h-[92vh] md:max-w-4xl bg-cream-100 flex flex-col md:flex-row overflow-hidden"
          style={{ animation: 'fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both' }}
        >
          {/* Фото */}
          <div className="w-full md:w-[55%] bg-cream-200 flex flex-col flex-shrink-0">
            <div className="relative overflow-hidden cursor-zoom-in" style={{ minHeight: '320px', maxHeight: '65vh' }}
              onClick={() => images.length > 0 && setZoomed(true)}>
              {images.length > 0 ? (
                <img src={images[active]} alt={name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" style={{ height: '65vh' }} />
              ) : (
                <div className="w-full flex flex-col items-center justify-center gap-3" style={{ height: '65vh' }}>
                  <div className="w-14 h-14 border border-cream-400 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-cream-400" />
                  </div>
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button onClick={e => { e.stopPropagation(); setActive(i => (i - 1 + images.length) % images.length) }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-cream-100/90 hover:bg-cream-100 flex items-center justify-center text-stone-600 hover:text-stone-950 transition-colors shadow-sm text-lg">‹</button>
                  <button onClick={e => { e.stopPropagation(); setActive(i => (i + 1) % images.length) }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-cream-100/90 hover:bg-cream-100 flex items-center justify-center text-stone-600 hover:text-stone-950 transition-colors shadow-sm text-lg">›</button>
                </>
              )}
              {images.length > 0 && (
                <span className="absolute bottom-3 right-3 bg-cream-100/80 px-2 py-1 text-xs text-stone-500 tracking-wide">🔍 {isEN ? 'zoom' : 'збільшити'}</span>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 p-3 bg-cream-100 border-t border-cream-300 flex-shrink-0">
                {images.map((src, i) => (
                  <button key={i} onClick={() => setActive(i)}
                    className={`w-16 h-16 overflow-hidden flex-shrink-0 transition-all border-2 ${i === active ? 'border-stone-800 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Інфо */}
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex justify-end px-5 pt-4 flex-shrink-0">
              <button onClick={onClose} className="text-stone-400 hover:text-stone-950 transition-colors text-xl w-8 h-8 flex items-center justify-center">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto px-7 pb-4">
              <p className="index-label mb-2">{catName}</p>
              <h2 className="font-display text-2xl md:text-3xl font-medium text-stone-950 leading-tight mb-3">{name}</h2>
              {product.price && <p className="font-display text-2xl font-medium text-stone-950 mb-5">{product.price}</p>}
              <div className="w-8 h-px bg-blush mb-5" />
              {product.material && (
                <div className="mb-5">
                  <p className="text-xs tracking-widest uppercase text-stone-400 mb-1.5">{t('product.material')}</p>
                  <p className="text-sm text-stone-700">{product.material}</p>
                </div>
              )}
              {description && (
                <div className="mb-6">
                  <p className="text-xs tracking-widest uppercase text-stone-400 mb-1.5">{t('product.description')}</p>
                  <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">{description}</p>
                </div>
              )}
            </div>

            <div className="px-7 py-5 border-t border-cream-300 flex-shrink-0 flex gap-3">
              <button onClick={handleAdd}
                className={`flex-1 py-3.5 text-xs tracking-widest uppercase font-medium transition-all duration-300 ${added ? 'bg-stone-950 text-cream-100 border border-stone-950' : 'btn-dark'}`}>
                {added ? t('product.added') : t('product.add_to_cart')}
              </button>
              <button onClick={() => toggleWishlist(product)}
                className={`w-12 h-12 flex items-center justify-center border-2 transition-all text-lg flex-shrink-0 ${wishlisted ? 'border-stone-950 text-stone-950' : 'border-cream-300 text-stone-400 hover:border-stone-400'}`}>
                {wishlisted ? '♥' : '♡'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {zoomed && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{ background: 'rgba(10,10,8,0.97)' }} onClick={() => setZoomed(false)}>
          <img src={images[active]} alt={name} className="object-contain" style={{ maxWidth: '95vw', maxHeight: '95vh' }} />
          <button onClick={() => setZoomed(false)} className="absolute top-5 right-5 text-stone-400 hover:text-white text-2xl w-10 h-10 flex items-center justify-center">✕</button>
          {images.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); setActive(i => (i - 1 + images.length) % images.length) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-2xl">‹</button>
              <button onClick={e => { e.stopPropagation(); setActive(i => (i + 1) % images.length) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-2xl">›</button>
            </>
          )}
        </div>
      )}
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </>,
    document.body
  )
}
