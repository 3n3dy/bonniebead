import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../cart/CartContext'
import { useUser } from '../user/UserContext'

const AVAILABILITY = {
  in_stock: { label: 'Є в наявності',   labelEN: 'In stock',    bg: 'bg-green-900/80',  text: 'text-green-300' },
  on_order: { label: 'Під замовлення',  labelEN: 'On order',    bg: 'bg-yellow-900/80', text: 'text-yellow-300' },
}

export default function ProductCard({ product, catName, onOpenProduct }) {
  const { t, i18n } = useTranslation()
  const { add } = useCart()
  const { isWishlisted, toggleWishlist, addToHistory } = useUser()
  const [added, setAdded] = useState(false)

  const isEN = i18n.language === 'en'
  const name = isEN && product.nameEN ? product.nameEN : product.name

  const images = product.images?.length ? product.images : product.image ? [product.image] : []
  const [active, setActive] = useState(0)
  const wishlisted = isWishlisted(product.id)

  const avail = product.availability ? AVAILABILITY[product.availability] : null

  const handleAdd = (e) => {
    e.stopPropagation()
    add(product, catName)
    addToHistory(product, catName)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleOpen = () => {
    addToHistory(product, catName)
    if (onOpenProduct) onOpenProduct()
  }

  return (
    <article className="product-card fade-up cursor-pointer group/card" onClick={handleOpen}>
      <div className="product-card-img bg-cream-200 relative group/img">
        {images.length > 0 ? (
          <img src={images[active]} alt={name} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border border-cream-400 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-cream-400" />
            </div>
          </div>
        )}

        {/* Бейдж наявності */}
        {avail && (
          <div className={`absolute bottom-2 left-2 px-2 py-0.5 text-xs font-sans tracking-wide rounded-sm ${avail.bg} ${avail.text}`}>
            {isEN ? avail.labelEN : avail.label}
          </div>
        )}

        <button onClick={e => { e.stopPropagation(); toggleWishlist(product) }}
          className={`absolute top-3 left-3 w-7 h-7 flex items-center justify-center transition-all ${wishlisted ? 'text-stone-950 scale-110' : 'text-stone-400 hover:text-stone-700'}`}>
          {wishlisted ? '♥' : '♡'}
        </button>

        <div className="absolute inset-0 bg-stone-950/0 group-hover/card:bg-stone-950/10 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 bg-cream-100/90 text-stone-800 text-xs tracking-widest uppercase px-3 py-1.5">
            {t('product.view')}
          </span>
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setActive(i) }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === active ? 'bg-stone-950 scale-125' : 'bg-stone-950/30'}`} />
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-sans text-sm font-medium text-stone-950 leading-snug">{name}</h4>
            {product.material && <p className="index-label mt-1">{product.material}</p>}
          </div>
          {product.price && <p className="font-display text-base font-medium text-stone-950 whitespace-nowrap">{product.price}</p>}
        </div>
        {product.description && (
          <p className="font-sans text-xs text-stone-400 leading-relaxed mt-2 line-clamp-2 whitespace-pre-wrap">
            {isEN && product.descriptionEN ? product.descriptionEN : product.description}
          </p>
        )}
        <button onClick={handleAdd}
          className={`mt-4 w-full py-2.5 text-xs tracking-widest uppercase font-medium transition-all duration-300 ${added ? 'bg-stone-950 text-cream-100 border border-stone-950' : 'btn-outline'}`}>
          {added ? t('product.added') : t('product.add_to_cart')}
        </button>
      </div>
    </article>
  )
}
