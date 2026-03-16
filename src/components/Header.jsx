import { useState } from 'react'
import { createPortal } from 'react-dom'
import AboutModal from './AboutModal'
import { useCart } from '../cart/CartContext'
import { useUser } from '../user/UserContext'
import AuthModal from '../user/AuthModal'
import UserDrawer from '../user/UserDrawer'

export default function Header({ onHome }) {
  const [showAbout, setShowAbout] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showUser, setShowUser] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const { totalCount, setIsOpen: openCart } = useCart()
  const { isLoggedIn, wishlist } = useUser()

  const scrollToFooter = () => {
    const footer = document.querySelector('footer')
    if (footer) footer.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const closeMenu = () => setMenuOpen(false)

  const handleUserClick = () => {
    if (isLoggedIn) setShowUser(true)
    else setShowAuth(true)
  }

  // Іконка профілю
  const UserIcon = () => (
    <button onClick={handleUserClick} className="relative flex items-center text-stone-500 hover:text-stone-950 transition-colors" title={isLoggedIn ? 'Кабінет' : 'Увійти'}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.2" />
        <path d="M2 16c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      {isLoggedIn && <span className="absolute -top-1 -right-1 w-2 h-2 bg-blush rounded-full" />}
      {!isLoggedIn && wishlist.length > 0 && (
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blush text-white text-xs rounded-full flex items-center justify-center leading-none">
          {wishlist.length}
        </span>
      )}
    </button>
  )

  // Іконка кошика
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
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">

          {/* Desktop — left */}
          <nav className="hidden md:flex items-center gap-8">
            <a onClick={() => { onHome(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="link-underline text-xs tracking-widest2 uppercase font-sans text-stone-500 hover:text-stone-950 transition-colors cursor-pointer">Каталог</a>
            <a onClick={() => setShowAbout(true)} className="link-underline text-xs tracking-widest2 uppercase font-sans text-stone-500 hover:text-stone-950 transition-colors cursor-pointer">Про мене</a>
          </nav>

          {/* Center */}
          <button onClick={() => { onHome(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="absolute left-1/2 -translate-x-1/2 font-display text-2xl tracking-widest2 font-medium text-stone-950 hover:opacity-70 transition-opacity">
            BONNIEBEAD
          </button>

          {/* Desktop — right */}
          <div className="hidden md:flex items-center gap-5">
            <a onClick={scrollToFooter} className="link-underline text-xs tracking-widest2 uppercase font-sans text-stone-500 hover:text-stone-950 transition-colors cursor-pointer">Зв&apos;язатись</a>
            <UserIcon />
            <CartIcon />
          </div>

          {/* Mobile — right */}
          <div className="md:hidden flex items-center gap-4 ml-auto">
            <UserIcon />
            <CartIcon />
            <button onClick={() => setMenuOpen(true)} className="flex flex-col gap-1.5 p-1" aria-label="Меню">
              <span className="w-5 h-px bg-stone-950 block" />
              <span className="w-4 h-px bg-stone-950 block" />
            </button>
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
              <span className="font-display text-xl tracking-widest2 font-medium text-stone-950">BONNIEBEAD</span>
              <button onClick={closeMenu} className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-950 text-xl">✕</button>
            </div>
            <nav className="flex flex-col px-6 py-6 flex-1">
              {[
                { label: 'Каталог', action: () => { closeMenu(); onHome(); window.scrollTo({ top: 0, behavior: 'smooth' }) } },
                { label: 'Про мене', action: () => { closeMenu(); setTimeout(() => setShowAbout(true), 300) } },
                { label: isLoggedIn ? 'Мій кабінет' : 'Увійти', action: () => { closeMenu(); setTimeout(handleUserClick, 300) } },
                { label: 'Зв\'язатись', action: () => { closeMenu(); setTimeout(scrollToFooter, 300) } },
                { label: 'Кошик', action: () => { closeMenu(); openCart(true) } },
              ].map(({ label, action }) => (
                <a key={label} onClick={action} className="flex items-center justify-between py-4 border-b border-cream-300 text-sm tracking-widest2 uppercase font-sans text-stone-600 hover:text-stone-950 transition-colors group cursor-pointer">
                  {label}
                  {label === 'Кошик' && totalCount > 0
                    ? <span className="w-5 h-5 bg-stone-950 text-cream-100 text-xs rounded-full flex items-center justify-center">{totalCount}</span>
                    : <span className="text-stone-300 group-hover:text-stone-600 transition-colors">→</span>
                  }
                </a>
              ))}
            </nav>
            <div className="px-6 py-6 border-t border-cream-300">
              <p className="index-label text-stone-400">Уся Україна</p>
              <p className="font-display italic text-stone-400 text-sm mt-1">Ручна робота</p>
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
