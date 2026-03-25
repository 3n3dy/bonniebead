import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from './CartContext'
import CheckoutModal from './CheckoutModal'

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, remove, updateQty, totalCount } = useCart()
  const { t } = useTranslation()
  const [showCheckout, setShowCheckout] = useState(false)
  

  if (!isOpen && !showCheckout) return null

  const handleCheckout = () => {
    setIsOpen(false)
    // Невелика затримка щоб drawer закрився перед відкриттям чекауту
    setTimeout(() => setShowCheckout(true), 150)
  }

  return createPortal(
    <>
      {/* Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div
            className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm"
            style={{ animation: 'fadeIn 0.25s ease both' }}
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute top-0 right-0 h-full w-full max-w-sm bg-cream-100 flex flex-col shadow-2xl z-10"
            style={{ animation: 'slideIn 0.3s cubic-bezier(0.16,1,0.3,1) both' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-cream-300 flex-shrink-0">
              <div>
                <p className="text-xs tracking-widest2 uppercase font-sans text-stone-500">{t('cart.title')}</p>
                <p className="font-display text-xl font-medium text-stone-950 mt-0.5">{totalCount} {t('cart.positions')}</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-stone-950 transition-colors text-xl w-8 h-8 flex items-center justify-center">✕</button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
                  <div className="w-12 h-12 border border-cream-300 rounded-full flex items-center justify-center text-stone-300 text-xl">∅</div>
                  <p className="text-sm text-stone-400 font-sans">{t('cart.empty')}</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {items.map(({ product, catName, qty }) => {
                    const img = product.images?.[0] || product.image || ''
                    return (
                      <div key={product.id} className="flex gap-4">
                        <div className="w-20 h-20 bg-cream-200 flex-shrink-0 overflow-hidden">
                          {img
                            ? <img src={img} alt={product.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">фото</div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-800 leading-snug">{product.name}</p>
                          <p className="text-xs text-stone-400 mt-0.5">{catName}</p>
                          {product.price && <p className="text-sm text-stone-600 mt-1">{product.price}</p>}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-cream-300">
                              <button onClick={() => updateQty(product.id, qty - 1)}
                                className="w-7 h-7 flex items-center justify-center text-stone-500 hover:text-stone-950 hover:bg-cream-200 transition-colors text-lg leading-none">−</button>
                              <span className="w-7 text-center text-xs text-stone-700">{qty}</span>
                              <button onClick={() => updateQty(product.id, qty + 1)}
                                className="w-7 h-7 flex items-center justify-center text-stone-500 hover:text-stone-950 hover:bg-cream-200 transition-colors">+</button>
                            </div>
                            <button onClick={() => remove(product.id)}
                              className="text-xs text-stone-400 hover:text-red-500 transition-colors tracking-wide underline-offset-2 hover:underline">
                              {t('cart.remove')}
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-cream-300 flex-shrink-0">
                <button onClick={handleCheckout} className="btn-dark w-full py-3.5">
                  {t('cart.checkout')}
                </button>
                <p className="text-xs text-stone-400 text-center mt-3">{t('cart.note')}</p>
              </div>
            )}
          </div>

          <style>{`
            @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
            @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
          `}</style>
        </div>
      )}

      {/* Checkout — рендериться незалежно від drawer */}
      {showCheckout && (
        <CheckoutModal onClose={() => setShowCheckout(false)} />
      )}
    </>,
    document.body
  )
}
