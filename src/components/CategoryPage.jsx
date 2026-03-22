import { useTranslation } from 'react-i18next'
import ProductCard from './ProductCard'

export default function CategoryPage({ category, onBack, onProductClick }) {
  const { t, i18n } = useTranslation()
  const isEN = i18n.language === 'en'

  const name = isEN && category.nameEN ? category.nameEN : category.name
  const note = isEN && category.noteEN ? category.noteEN : category.note

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

      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-14">
        {category.products.length === 0 ? (
          <div className="py-32 text-center">
            <p className="font-display text-2xl text-stone-300 italic">{t('product.no_products')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {category.products.map((product, i) => (
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
