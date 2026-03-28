import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ProductCard from './ProductCard'

function parsePrice(priceStr = '') {
  const num = parseFloat(priceStr.replace(/[^\d.]/g, ''))
  return isNaN(num) ? Infinity : num
}

export default function CategoryPage({ category, onBack, onProductClick }) {
  const { t, i18n } = useTranslation()
  const isEN = i18n.language === 'en'
  const [sort, setSort] = useState('default')

  const name = isEN && category.nameEN ? category.nameEN : category.name
  const note = isEN && category.noteEN ? category.noteEN : category.note

  const sortedProducts = useMemo(() => {
    const products = [...category.products]
    if (sort === 'az') {
      return products.sort((a, b) => {
        const nameA = isEN && a.nameEN ? a.nameEN : a.name
        const nameB = isEN && b.nameEN ? b.nameEN : b.name
        return nameA.localeCompare(nameB, isEN ? 'en' : 'uk')
      })
      if (sort === 'price_desc') {
        return products.sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
      }
    }
    if (sort === 'price_asc') {
      return products.sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
    }
    return products
  }, [category.products, sort, isEN])

  return (
    <div className="min-h-screen">
      <div className="bg-stone-950 text-cream-100">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-14 md:py-20">
          <button onClick={onBack} className="flex items-center gap-2 text-cream-400 hover:text-cream-100 transition-colors mb-10 group">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs tracking-widest2 uppercase">{t('catalog.label')}</span>
          </button>
          <div className="grid grid-cols-12 items-end gap-6">
            <div className="col-span-12 md:col-span-7">
              <p className="font-sans text-xs tracking-widest2 uppercase text-blush mb-4">{category.nameLatin}</p>
              <h2 className="font-display text-5xl md:text-7xl font-medium leading-tight">{name}</h2>
            </div>
            <div className="col-span-12 md:col-span-5 md:text-right">
              <p className="font-sans text-sm text-cream-300 leading-relaxed">{note}</p>
              <p className="index-label mt-3 text-stone-500">{category.products.length} {t('catalog.items')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-8">
        {/* Сортування */}
        {category.products.length > 1 && (
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xs tracking-widest uppercase text-stone-400 font-sans">
              {isEN ? 'Sort:' : 'Сортувати:'}
            </span>
            <div className="flex gap-1">
              {[
                { value: 'default', label: isEN ? 'Default' : 'За замовч.' },
                { value: 'az', label: isEN ? 'A → Z' : 'А → Я' },
                { value: 'price_asc', label: isEN ? 'Price ↑' : 'Ціна ↑' },
                { value: 'price_desc', label: isEN ? 'Price ↓' : 'Ціна ↓' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className={`px-3 py-1.5 text-xs tracking-wide font-sans border transition-colors ${sort === opt.value
                      ? 'bg-stone-950 text-cream-100 border-stone-950'
                      : 'border-cream-300 text-stone-500 hover:border-stone-400 hover:text-stone-800'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {category.products.length === 0 ? (
          <div className="py-32 text-center">
            <p className="font-display text-2xl text-stone-300 italic">{t('product.no_products')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product, i) => (
              <div key={product.id} style={{ animationDelay: `${i * 55}ms` }}>
                <ProductCard
                  product={product}
                  catName={name}
                  onOpenProduct={onProductClick ? () => onProductClick(product) : null}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rule" />
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-8 flex items-center justify-between">
        <button onClick={onBack} className="link-underline text-xs tracking-widest2 uppercase font-sans text-stone-500 hover:text-stone-950 transition-colors">
          ← {t('catalog.back')}
        </button>
        <p className="index-label">{name} / BONNIEBEAD</p>
      </div>
    </div>
  )
}
