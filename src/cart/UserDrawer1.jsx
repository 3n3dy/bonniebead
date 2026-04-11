import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useUser } from './UserContext'
import { useCart } from '../cart/CartContext'

const TABS = ['profile', 'wishlist', 'history']

export default function UserDrawer({ onClose }) {
  const [tab, setTab] = useState('profile')
  const { t } = useTranslation()
  const {
    profile, updateProfile, logout,
    wishlist, toggleWishlist, clearWishlist,
    history, clearHistory,
  } = useUser()

  const saveProfile = () => { updateProfile(draft); setEditing(false) }

  const tabLabels = {
    profile: t('user.profile_tab'),
    wishlist: t('user.wishlist_tab'),
    history:  t('user.history_tab'),
  }

  const addToCartAndOpen = (product, catName) => {
    add(product, catName)
    onClose()
    setTimeout(() => openCart(true), 300)
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-stone-950/50 backdrop-blur-sm" onClick={onClose} style={{ animation: 'fadeIn 0.25s ease both' }} />

      <div className="absolute top-0 right-0 h-full w-full max-w-sm bg-cream-100 flex flex-col shadow-2xl" style={{ animation: 'slideIn 0.3s cubic-bezier(0.16,1,0.3,1) both' }}>

        {/* Header */}
        <div className="bg-stone-950 px-6 py-5 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs tracking-widest2 uppercase text-stone-500 font-sans">{t('user.cabinet')}</p>
              <p className="font-display text-xl text-cream-100 mt-0.5">{profile.name || t('user.guest')}</p>
            </div>
            <button onClick={onClose} className="text-stone-500 hover:text-cream-100 transition-colors text-xl w-7 h-7 flex items-center justify-center mt-0.5">✕</button>
          </div>

          {/* Tabs + cart icon */}
          <div className="flex items-end justify-between mt-5">
            <div className="flex gap-4">
              {TABS.map(tabKey => (
                <button key={tabKey} onClick={() => setTab(tabKey)}
                  className={`text-xs tracking-widest uppercase font-sans pb-2 border-b transition-colors ${
                    tab === tabKey ? 'text-cream-100 border-blush' : 'text-stone-500 border-transparent hover:text-stone-300'
                  }`}>
                  {tabLabels[tabKey]}
                  {tabKey === 'wishlist' && wishlist.length > 0 && (
                    <span className="ml-1.5 text-blush">({wishlist.length})</span>
                  )}
                </button>
              ))}
            </div>

            {/* Іконка кошика */}
            <button
              onClick={() => { onClose(); setTimeout(() => openCart(true), 300) }}
              className="relative pb-2 text-stone-500 hover:text-cream-100 transition-colors"
              title="Кошик"
            >
              <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                <path d="M1 1h2.5l1.8 8.5h8.4l1.5-5.5H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="8" cy="15.5" r="1" fill="currentColor"/>
                <circle cx="13" cy="15.5" r="1" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Профіль ── */}
          {tab === 'profile' && (
            <div className="px-6 py-6">
              {editing ? (
                <div className="space-y-4">
                  {[
                    { label: t('user.name_label'),  key: 'name',  placeholder: 'Марія Іваненко' },
                    { label: t('user.phone_label'), key: 'phone', placeholder: '+38 (050) 000-00-00', type: 'tel' },
                    { label: t('user.email_label'), key: 'email', placeholder: 'maria@email.com', type: 'email' },
                  ].map(({ label, key, placeholder, type = 'text' }) => (
                    <div key={key}>
                      <label className="block text-xs tracking-widest uppercase text-stone-400 mb-1.5">{label}</label>
                      <input type={type} value={draft[key]}
                        onChange={e => setDraft(p => ({ ...p, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full bg-cream-200 border border-cream-300 focus:border-stone-400 text-stone-800 placeholder-stone-400 text-sm px-3 py-2.5 outline-none transition-colors" />
                    </div>
                  ))}
                  <div className="flex gap-2 pt-1">
                    <button onClick={saveProfile} className="btn-dark flex-1 py-2.5">{t('user.save')}</button>
                    <button onClick={() => { setDraft(profile); setEditing(false) }} className="btn-outline flex-1 py-2.5">{t('user.cancel')}</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { label: t('user.name_label'),  val: profile.name },
                    { label: t('user.phone_label'), val: profile.phone },
                    { label: t('user.email_label'), val: profile.email },
                  ].map(({ label, val }) => (
                    <div key={label} className="border-b border-cream-300 pb-3">
                      <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">{label}</p>
                      <p className="text-sm text-stone-700">{val || <span className="text-stone-400 italic">{t('user.not_set')}</span>}</p>
                    </div>
                  ))}
                  <button onClick={() => { setDraft(profile); setEditing(true) }} className="btn-outline w-full py-2.5 mt-2">{t('user.edit')}</button>
                  <button onClick={logout} className="w-full text-xs text-stone-400 hover:text-red-500 transition-colors py-1 tracking-wide">{t('user.logout')}</button>
                </div>
              )}
            </div>
          )}

          {/* ── Обране ── */}
          {tab === 'wishlist' && (
            <div className="px-6 py-6">
              {wishlist.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-2xl mb-3">♡</p>
                  <p className="text-sm text-stone-400">{t('user.wishlist_empty')}</p>
                  <p className="text-xs text-stone-500 mt-1">{t('user.wishlist_hint')}</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-4">
                    {wishlist.map(product => {
                      const img = product.images?.[0] || product.image || ''
                      return (
                        <div key={product.id} className="flex gap-3 items-center">
                          <div className="w-14 h-14 bg-cream-200 flex-shrink-0 overflow-hidden">
                            {img ? <img src={img} alt={product.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">фото</div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-stone-800 truncate">{product.name}</p>
                            {product.price && <p className="text-xs text-stone-500">{product.price}</p>}
                            {/* Кнопка + кошик */}
                            <button
                              onClick={() => addToCartAndOpen(product, '—')}
                              className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-800 transition-colors mt-1"
                            >
                              <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                                <path d="M1 1h2.5l1.8 8.5h8.4l1.5-5.5H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="8" cy="15.5" r="1" fill="currentColor"/>
                                <circle cx="13" cy="15.5" r="1" fill="currentColor"/>
                              </svg>
                              {t('user.add_to_cart')}
                            </button>
                          </div>
                          <button onClick={() => toggleWishlist(product)} className="text-stone-400 hover:text-red-400 transition-colors text-sm px-2">✕</button>
                        </div>
                      )
                    })}
                  </div>
                  <button onClick={clearWishlist} className="text-xs text-stone-400 hover:text-red-500 transition-colors tracking-wide">{t('user.clear_wishlist')}</button>
                </>
              )}
            </div>
          )}

          {/* ── Переглянуті ── */}
          {tab === 'history' && (
            <div className="px-6 py-6">
              {history.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-2xl mb-3">◷</p>
                  <p className="text-sm text-stone-400">{t('user.history_empty')}</p>
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
                            {img ? <img src={img} alt={product.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">фото</div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-stone-800 truncate">{product.name}</p>
                            <p className="text-xs text-stone-400 truncate">{catName}</p>
                            <p className="index-label mt-0.5">{date}</p>
                          </div>
                          {/* Кнопка + кошик */}
                          <button
                            onClick={() => addToCartAndOpen(product, catName)}
                            className="text-stone-400 hover:text-stone-800 transition-colors px-1 flex-shrink-0"
                            title={t('user.add_to_cart')}
                          >
                            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                              <path d="M1 1h2.5l1.8 8.5h8.4l1.5-5.5H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                              <circle cx="8" cy="15.5" r="1" fill="currentColor"/>
                              <circle cx="13" cy="15.5" r="1" fill="currentColor"/>
                            </svg>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                  <button onClick={clearHistory} className="text-xs text-stone-400 hover:text-red-500 transition-colors tracking-wide">{t('user.clear_history')}</button>
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
