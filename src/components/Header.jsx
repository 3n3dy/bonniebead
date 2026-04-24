import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AboutModal from './AboutModal'
import LangSwitcher from './LangSwitcher'
import { useCart } from '../cart/CartContext'
import { useUser } from '../user/UserContext'
import AuthModal from '../user/AuthModal'
import UserDrawer from '../user/UserDrawer'

export default function Header({ onHome }) {
  const { t } = useTranslation()
  const [showAbout, setShowAbout] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showUser, setShowUser] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const { totalCount, setIsOpen: openCart } = useCart()
  const { isLoggedIn } = useUser()

  const scrollToFooter = () => {
    const footer = document.querySelector('footer')
    if (footer) footer.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const scrollToCatalog = () => {
    onHome()
    setTimeout(() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }), 80)
  }
  const closeMenu = () => setMenuOpen(false)
  const handleUserClick = () => isLoggedIn ? setShowUser(true) : setShowAuth(true)

  const UserIcon = () => (
    <button onClick={handleUserClick} className="relative flex items-center text-stone-500 hover:text-stone-950 transition-colors" title={isLoggedIn ? t('nav.cabinet') : t('nav.login')}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.2" />
        <path d="M2 16c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      {isLoggedIn && <span className="absolute -top-1 -right-1 w-2 h-2 bg-blush rounded-full" />}
    </button>
  )

  const CartIcon = () => (
    <button onClick={() => openCart(true)} className="relative flex items-center text-stone-500 hover:text-stone-950 transition-colors">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M1 1h2.5l1.8 8.5h8.4l1.5-5.5H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="15.5" r="1" fill="currentColor" />
        <circle cx="13" cy="15.5" r="1" fill="currentColor" />
      </svg>
      {totalCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-stone-950 text-cream-100 text-xs rounded-full flex items-center justify-center leading-none">
          {totalCount > 9 ? '9+' : totalCount}
        </span>
      )}
    </button>
  )

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream-100/90 backdrop-blur-sm">
        <div className="rule" />
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 h-16 flex items-center">

          {/* Left — desktop nav / mobile порожньо */}
<div className="flex-1">
  <nav className="hidden md:flex items-center gap-8 font-display">
    <a
      onClick={scrollToCatalog}
      className="link-underline text-xs tracking-widest2 uppercase text-stone-500 hover:text-stone-950 transition-colors cursor-pointer"
    >
      {t('nav.catalog')}
    </a>
    <a
      onClick={() => setShowAbout(true)}
      className="link-underline text-xs tracking-widest2 uppercase text-stone-500 hover:text-stone-950 transition-colors cursor-pointer"
    >
      {t('nav.about')}
    </a>
  </nav>
</div>



          {/* Center — wordmark завжди по центру */}
          <button
            onClick={onHome}
            style={{ fontFamily: 'Megrim, serif' }}
            className="text-xl tracking-widest2 md:text-2xl text-stone-950 hover:opacity-70 transition-opacity"
          >
            BONNIEBEAD
          </button>


          {/* Right — desktop + mobile */}
          <div className="flex-1 flex items-center justify-end gap-3 md:gap-4">
            {/* Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <LangSwitcher />
              <a onClick={scrollToFooter} className="link-underline text-xs tracking-widest2 uppercase font-display text-stone-500 hover:text-stone-950 transition-colors cursor-pointer">
                {t('nav.contact')}
              </a>
              <UserIcon />
              <CartIcon />
            </div>

            {/* Mobile */}
            <div className="md:hidden flex items-center gap-3">
              <LangSwitcher mobile />
              <UserIcon />
              <CartIcon />
              <button onClick={() => setMenuOpen(true)} className="flex flex-col gap-1.5 p-1" aria-label="Меню">
                <span className="w-5 h-px bg-stone-950 block" />
                <span className="w-4 h-px bg-stone-950 block" />
              </button>
            </div>
          </div>
        </div>
        <div className="rule" />
      </header>

      {/* Mobile sidebar */}
      {menuOpen && createPortal(
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-stone-950/50 backdrop-blur-sm" onClick={closeMenu} style={{ animation: 'fadeIn 0.25s ease both' }} />
          <div className="absolute top-0 right-0 h-full w-72 bg-cream-100 flex flex-col shadow-2xl" style={{ animation: 'slideIn 0.3s cubic-bezier(0.16,1,0.3,1) both' }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-cream-300">
              <span className="font-megrim text-xl tracking-widest2 font-medium text-stone-950">BONNIEBEAD</span>
              <button onClick={closeMenu} className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-950 text-xl">✕</button>
            </div>
            <nav className="flex flex-col px-6 py-6 flex-1">
              {[
                { label: t('nav.catalog'), action: () => { closeMenu(); scrollToCatalog() } },
                { label: t('nav.about'), action: () => { closeMenu(); setTimeout(() => setShowAbout(true), 300) } },
                { label: isLoggedIn ? t('nav.cabinet') : t('nav.login'), action: () => { closeMenu(); setTimeout(handleUserClick, 300) } },
                { label: t('nav.contact'), action: () => { closeMenu(); setTimeout(scrollToFooter, 300) } },
                { label: t('nav.cart'), action: () => { closeMenu(); openCart(true) } },
              ].map(({ label, action }) => (
                <a key={label} onClick={action} className="flex items-center justify-between py-4 border-b border-cream-300 text-sm tracking-widest2 uppercase font-display text-stone-600 hover:text-stone-950 transition-colors group cursor-pointer">
                  {label}
                  {label === t('nav.cart') && totalCount > 0
                    ? <span className="w-5 h-5 bg-stone-950 text-cream-100 text-xs rounded-full flex items-center justify-center">{totalCount}</span>
                    : <span className="text-stone-300 group-hover:text-stone-600 transition-colors">→</span>
                  }
                </a>
              ))}
            </nav>
            <div className="px-6 py-6 border-t border-cream-300">
              <p className="index-label text-stone-400">Worldwide shipping</p>
              <p className="font-display italic text-stone-400 text-sm mt-1">Handmade</p>
            </div>
          </div>
          <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
        </div>,
        document.body
      )}

      {showAbout && createPortal(<AboutModal onClose={() => setShowAbout(false)} />, document.body)}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showUser && <UserDrawer onClose={() => setShowUser(false)} />}
    </>
  )
}
