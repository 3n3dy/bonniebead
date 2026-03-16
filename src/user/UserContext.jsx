import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const UserContext = createContext(null)

const KEYS = {
  profile:  'bb_profile',
  wishlist: 'bb_wishlist',
  history:  'bb_history',
  isLoggedIn: 'bb_logged',
}

function load(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback } catch { return fallback }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

export function UserProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => load(KEYS.isLoggedIn, false))
  const [profile,    setProfileState] = useState(() => load(KEYS.profile, { name: '', phone: '', email: '' }))
  const [wishlist,   setWishlistState] = useState(() => load(KEYS.wishlist, []))     // [product]
  const [history,    setHistoryState]  = useState(() => load(KEYS.history, []))      // [{ product, catName, seenAt }]

  // ── Auth ────────────────────────────────────────────────────────────────
  const login = (data) => {
    const p = { name: data.name.trim(), phone: data.phone.trim(), email: data.email.trim() }
    save(KEYS.profile, p)
    save(KEYS.isLoggedIn, true)
    setProfileState(p)
    setIsLoggedIn(true)
  }

  const logout = () => {
    save(KEYS.isLoggedIn, false)
    setIsLoggedIn(false)
  }

  const updateProfile = (data) => {
    const p = { ...profile, ...data }
    save(KEYS.profile, p)
    setProfileState(p)
  }

  // ── Wishlist ─────────────────────────────────────────────────────────────
  const toggleWishlist = useCallback((product) => {
    setWishlistState(prev => {
      const exists = prev.find(p => p.id === product.id)
      const next = exists ? prev.filter(p => p.id !== product.id) : [...prev, product]
      save(KEYS.wishlist, next)
      return next
    })
  }, [])

  const isWishlisted = useCallback((productId) =>
    wishlist.some(p => p.id === productId), [wishlist])

  const clearWishlist = () => { save(KEYS.wishlist, []); setWishlistState([]) }

  // ── History ──────────────────────────────────────────────────────────────
  const addToHistory = useCallback((product, catName) => {
    setHistoryState(prev => {
      const filtered = prev.filter(h => h.product.id !== product.id)
      const next = [{ product, catName, seenAt: Date.now() }, ...filtered].slice(0, 30)
      save(KEYS.history, next)
      return next
    })
  }, [])

  const clearHistory = () => { save(KEYS.history, []); setHistoryState([]) }

  return (
    <UserContext.Provider value={{
      isLoggedIn, profile, wishlist, history,
      login, logout, updateProfile,
      toggleWishlist, isWishlisted, clearWishlist,
      addToHistory, clearHistory,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
