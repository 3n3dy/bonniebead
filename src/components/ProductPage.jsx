import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../cart/CartContext'
import { useUser } from '../user/UserContext'

// Оновлює мета теги в <head> для поточного товару
function useProductMeta(product, name, description) {
  useEffect(() => {
    const prevTitle = document.title

    // Title
    document.title = `${name} · BONNIEBEAD`

    // Meta description — SEO поле або звичайний опис
    const metaDesc = document.querySelector('meta[name="description"]')
    const prevDesc = metaDesc?.getAttribute('content') || ''
    const seoText = product.seoDescription || description || ''
    if (metaDesc) metaDesc.setAttribute('content', seoText)

    // OG теги
    const ogTitle = document.querySelector('meta[property="og:title"]')
    const ogDesc = document.querySelector('meta[property="og:description"]')
    const ogImage = document.querySelector('meta[property="og:image"]')

    const prevOgTitle = ogTitle?.getAttribute('content')
    const prevOgDesc = ogDesc?.getAttribute('content')
    const prevOgImage = ogImage?.getAttribute('content')

    if (ogTitle) ogTitle.setAttribute('content', `${name} · BONNIEBEAD`)
    if (ogDesc) ogDesc.setAttribute('content', seoText)
    if (ogImage && product.images?.[0]) ogImage.setAttribute('content', product.images[0])

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]')
    const prevCanonical = canonical?.getAttribute('href')
    if (canonical) canonical.setAttribute('href', window.location.href)

    // Cleanup — відновлюємо при виході зі сторінки
    return () => {
      document.title = prevTitle
      if (metaDesc) metaDesc.setAttribute('content', prevDesc)
      if (ogTitle && prevOgTitle) ogTitle.setAttribute('content', prevOgTitle)
      if (ogDesc && prevOgDesc) ogDesc.setAttribute('content', prevOgDesc)
      if (ogImage && prevOgImage) ogImage.setAttribute('content', prevOgImage)
      if (canonical && prevCanonical) canonical.setAttribute('href', prevCanonical)
    }
  }, [product.id, name])
}

export default function ProductPage({ product, category, onBack }) {
  const { t, i18n } = useTranslation()
  const { add } = useCart()
  const { isWishlisted, toggleWishlist, addToHistory } = useUser()
  const [added, setAdded] = useState(false)
  const [active, setActive] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [copied, setCopied] = useState(false)

  const isEN = i18n.language === 'en'
  const name = isEN && product.nameEN ? product.nameEN : product.name
  const description = isEN && product.descriptionEN ? product.descriptionEN : product.description
  const catName = isEN && category.nameEN ? category.nameEN : category.name

  // Оновлюємо мета теги
  useProductMeta(product, name, description)

  const images = product.images?.length ? product.images : product.image ? [product.image] : []
  const wishlisted = isWishlisted(product.id)

  const handleAdd = () => {
    add(product, catName)
    addToHistory(product, catName)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-4">
        <div className="flex items-center gap-2 text-xs text-stone-400 font-display tracking-wide">
          <button onClick={onBack} className="hover:text-stone-700 transition-colors">{catName}</button>
          <span>/</span>
          <span className="text-stone-600">{name}</span>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 md:px-12 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

          {/* Фото */}
          <div>
            <div className="relative bg-cream-200 overflow-hidden cursor-zoom-in mb-3"
              style={{ aspectRatio: '1/1' }}
              onClick={() => images.length > 0 && setZoomed(true)}>
              {images.length > 0 ? (
                <img src={images[active]} alt={name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-16 h-16 border border-cream-400 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-cream-400" />
                  </div>
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button onClick={e => { e.stopPropagation(); setActive(i => (i - 1 + images.length) % images.length) }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-cream-100/90 hover:bg-cream-100 flex items-center justify-center text-stone-600 hover:text-stone-950 text-xl shadow-sm">‹</button>
                  <button onClick={e => { e.stopPropagation(); setActive(i => (i + 1) % images.length) }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-cream-100/90 hover:bg-cream-100 flex items-center justify-center text-stone-600 hover:text-stone-950 text-xl shadow-sm">›</button>
                </>
              )}
              {images.length > 0 && <span className="absolute bottom-3 right-3 bg-cream-100/80 px-2 py-1 text-xs text-stone-500">🔍</span>}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((src, i) => (
                  <button key={i} onClick={() => setActive(i)}
                    className={`w-20 h-20 overflow-hidden flex-shrink-0 border-2 transition-all ${i === active ? 'border-stone-800' : 'border-transparent opacity-50 hover:opacity-80'}`}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Інфо */}
          <div className="flex flex-col">
            <p className="index-label mb-2">{catName}</p>
            <h1 className="font-display text-3xl md:text-4xl font-medium text-stone-950 leading-tight mb-3">{name}</h1>

            {product.price && (
              <p className="font-display text-3xl font-medium text-stone-950 mb-3">{product.price}</p>
            )}
            {product.availability && (
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs tracking-wide font-display mb-5 ${product.availability === 'in_stock'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                }`}>
                {product.availability === 'in_stock'
                  ? (isEN ? '✓ In stock' : '✓ Є в наявності')
                  : (isEN ? '◷ On order' : '◷ Під замовлення')
                }
              </div>
            )}

            <div className="w-8 h-px bg-blush mb-6" />

            {product.material && (
              <div className="mb-5">
                <p className="text-xs tracking-widest uppercase text-stone-400 mb-1.5">{t('product.material')}</p>
                <p className="text-sm text-stone-700">{product.material}</p>
              </div>
            )}

            {description && (
              <div className="mb-8 flex-1">
                <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">{t('product.description')}</p>
                <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">{description}</p>
              </div>
            )}

            <div className="flex gap-3 mb-4">
              <button onClick={handleAdd}
                className={`flex-1 py-4 text-xs tracking-widest uppercase font-medium transition-all duration-300 ${added ? 'bg-stone-950 text-cream-100 border border-stone-950' : 'btn-dark'}`}>
                {added ? t('product.added') : t('product.add_to_cart')}
              </button>
              <button onClick={() => toggleWishlist(product)}
                className={`w-14 h-14 flex items-center justify-center border-2 transition-all text-xl flex-shrink-0 ${wishlisted ? 'border-stone-950 text-stone-950' : 'border-cream-300 text-stone-400 hover:border-stone-400'}`}>
                {wishlisted ? '♥' : '♡'}
              </button>
            </div>

            <button onClick={copyLink}
              className="flex items-center gap-2 text-xs text-stone-400 hover:text-stone-700 transition-colors tracking-wide w-fit">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M8 1h4v4M12 1L6 7M5 3H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              {copied
                ? (isEN ? '✓ Copied!' : '✓ Скопійовано!')
                : (isEN ? 'Copy link' : 'Скопіювати посилання')
              }
            </button>
          </div>
        </div>
      </div>

      {/* Зум */}
      {zoomed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(10,10,8,0.97)' }} onClick={() => setZoomed(false)}>
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
    </div>
  )
}
