import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useUser } from './UserContext'
import { useCart } from '../cart/CartContext'

const TABS = ['Профіль', 'Обране', 'Переглянуті']

export default function UserDrawer({ onClose }) {
  const [tab, setTab] = useState('Профіль')
  const {
    profile, updateProfile, logout,
    wishlist, toggleWishlist, clearWishlist,
    history, clearHistory,
  } = useUser()
  const { add } = useCart()

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(profile)

  const saveProfile = () => { updateProfile(draft); setEditing(false) }

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-stone-950/50 backdrop-blur-sm" onClick={onClose} style={{ animation: 'fadeIn 0.25s ease both' }} />

      <div className="absolute top-0 right-0 h-full w-full max-w-sm bg-cream-100 flex flex-col shadow-2xl" style={{ animation: 'slideIn 0.3s cubic-bezier(0.16,1,0.3,1) both' }}>

        {/* Header */}
        <div className="bg-stone-950 px-6 py-5 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs tracking-widest2 uppercase text-stone-500 font-sans">Кабінет</p>
              <p className="font-display text-xl text-cream-100 mt-0.5">{profile.name || 'Гість'}</p>
            </div>
            <button onClick={onClose} className="text-stone-500 hover:text-cream-100 transition-colors text-xl w-7 h-7 flex items-center justify-center mt-0.5">✕</button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-5">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-xs tracking-widest uppercase font-sans pb-2 border-b transition-colors ${
                  tab === t
                    ? 'text-cream-100 border-blush'
                    : 'text-stone-500 border-transparent hover:text-stone-300'
                }`}
              >
                {t}
                {t === 'Обране' && wishlist.length > 0 && (
                  <span className="ml-1.5 text-blush">({wishlist.length})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Профіль ── */}
          {tab === 'Профіль' && (
            <div className="px-6 py-6">
              {editing ? (
                <div className="space-y-4">
                  {[
                    { label: "Ім'я", key: 'name', placeholder: 'Марія Іваненко' },
                    { label: 'Телефон', key: 'phone', placeholder: '+38 (050) 000-00-00', type: 'tel' },
                    { label: 'Email', key: 'email', placeholder: 'maria@email.com', type: 'email' },
                  ].map(({ label, key, placeholder, type = 'text' }) => (
                    <div key={key}>
                      <label className="block text-xs tracking-widest uppercase text-stone-400 mb-1.5">{label}</label>
                      <input
                        type={type} value={draft[key]}
                        onChange={e => setDraft(p => ({ ...p, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full bg-cream-200 border border-cream-300 focus:border-stone-400 text-stone-800 placeholder-stone-400 text-sm px-3 py-2.5 outline-none transition-colors"
                      />
                    </div>
                  ))}
                  <div className="flex gap-2 pt-1">
                    <button onClick={saveProfile} className="btn-dark flex-1 py-2.5">Зберегти</button>
                    <button onClick={() => { setDraft(profile); setEditing(false) }} className="btn-outline flex-1 py-2.5">Скасувати</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { label: "Ім'я", val: profile.name },
                    { label: 'Телефон', val: profile.phone },
                    { label: 'Email', val: profile.email },
                  ].map(({ label, val }) => (
                    <div key={label} className="border-b border-cream-300 pb-3">
                      <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">{label}</p>
                      <p className="text-sm text-stone-700">{val || <span className="text-stone-400 italic">не вказано</span>}</p>
                    </div>
                  ))}
                  <button onClick={() => { setDraft(profile); setEditing(true) }} className="btn-outline w-full py-2.5 mt-2">
                    Редагувати дані
                  </button>
                  <button onClick={logout} className="w-full text-xs text-stone-400 hover:text-red-500 transition-colors py-1 tracking-wide">
                    Вийти з кабінету
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Обране ── */}
          {tab === 'Обране' && (
            <div className="px-6 py-6">
              {wishlist.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-2xl mb-3">♡</p>
                  <p className="text-sm text-stone-400">Поки нічого не додано</p>
                  <p className="text-xs text-stone-500 mt-1">Натисніть ♡ на товарі щоб зберегти</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-4">
                    {wishlist.map(product => {
                      const img = product.images?.[0] || product.image || ''
                      return (
                        <div key={product.id} className="flex gap-3 items-center">
                          <div className="w-14 h-14 bg-cream-200 flex-shrink-0 overflow-hidden">
                            {img
                              ? <img src={img} alt={product.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">фото</div>
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-stone-800 truncate">{product.name}</p>
                            {product.price && <p className="text-xs text-stone-500">{product.price}</p>}
                            <button
                              onClick={() => add(product, '—')}
                              className="text-xs text-stone-400 hover:text-stone-800 transition-colors mt-1 underline-offset-2 hover:underline"
                            >
                              + в кошик
                            </button>
                          </div>
                          <button onClick={() => toggleWishlist(product)} className="text-stone-400 hover:text-red-400 transition-colors text-sm px-2">✕</button>
                        </div>
                      )
                    })}
                  </div>
                  <button onClick={clearWishlist} className="text-xs text-stone-400 hover:text-red-500 transition-colors tracking-wide">
                    Очистити список
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── Переглянуті ── */}
          {tab === 'Переглянуті' && (
            <div className="px-6 py-6">
              {history.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-2xl mb-3">◷</p>
                  <p className="text-sm text-stone-400">Історія порожня</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-4">
                    {history.map(({ product, catName, seenAt }) => {
                      const img = product.images?.[0] || product.image || ''
                      const date = new Date(seenAt).toLocaleDateString('uk', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                      return (
                        <div key={product.id + seenAt} className="flex gap-3 items-center">
                          <div className="w-14 h-14 bg-cream-200 flex-shrink-0 overflow-hidden">
                            {img
                              ? <img src={img} alt={product.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">фото</div>
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-stone-800 truncate">{product.name}</p>
                            <p className="text-xs text-stone-400 truncate">{catName}</p>
                            <p className="index-label mt-0.5">{date}</p>
                          </div>
                          <button
                            onClick={() => add(product, catName)}
                            className="text-xs text-stone-400 hover:text-stone-800 transition-colors px-2 shrink-0"
                            title="В кошик"
                          >
                            +
                          </button>
                        </div>
                      )
                    })}
                  </div>
                  <button onClick={clearHistory} className="text-xs text-stone-400 hover:text-red-500 transition-colors tracking-wide">
                    Очистити історію
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>,
    document.body
  )
}
