import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { CATEGORIES } from '../data/catalog'

const AdminContext = createContext(null)

const ADMIN_PASSWORD = 'passpass2026' // ← ваш пароль

// ── KV API ────────────────────────────────────────────────────────────────

async function fetchCatalog() {
  try {
    const res = await fetch('/catalog')
    const data = await res.json()
    return data.catalog || null
  } catch {
    return null
  }
}

async function pushCatalog(catalog, password) {
  try {
    const res = await fetch('/catalog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Password': password,
      },
      body: JSON.stringify({ catalog }),
    })
    return res.ok
  } catch {
    return false
  }
}

// ── LocalStorage fallback (для локальної розробки) ─────────────────────────

const LS_KEY = 'maison_catalog_v1'

function lsLoad() {
  try { const r = localStorage.getItem(LS_KEY); return r ? JSON.parse(r) : null } catch { return null }
}
function lsSave(data) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)) } catch {}
}

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
}

// ── Provider ──────────────────────────────────────────────────────────────

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(
    () => sessionStorage.getItem('maison_admin') === '1'
  )
  const [catalog, setCatalog] = useState(lsLoad() || CATEGORIES)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  // Завантажуємо каталог з KV при старті
  useEffect(() => {
    fetchCatalog().then(data => {
      if (data) {
        setCatalog(data)
        lsSave(data) // кешуємо локально
      }
      setLoading(false)
    })
  }, [])

  // Зберігаємо і в KV і в localStorage
  const persist = useCallback((updater) => {
    setCatalog(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      lsSave(next)

      // Пушимо в KV якщо залогований
      if (sessionStorage.getItem('maison_admin') === '1') {
        setSyncing(true)
        pushCatalog(next, ADMIN_PASSWORD).finally(() => setSyncing(false))
      }

      return next
    })
  }, [])

  const login = (pw) => {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('maison_admin', '1')
      setIsAdmin(true)
      return true
    }
    return false
  }

  const logout = () => {
    sessionStorage.removeItem('maison_admin')
    setIsAdmin(false)
  }

  // ── Categories ───────────────────────────────────────────────────────────
  const addCategory = (data) => {
    const cat = { id: uid('cat'), products: [], ...data }
    persist(prev => [...prev, cat])
    return cat.id
  }
  const updateCategory = (id, data) =>
    persist(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
  const deleteCategory = (id) =>
    persist(prev => prev.filter(c => c.id !== id))
  const moveCategoryUp = (id) =>
    persist(prev => {
      const i = prev.findIndex(c => c.id === id)
      if (i <= 0) return prev
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]]
      return next
    })
  const moveCategoryDown = (id) =>
    persist(prev => {
      const i = prev.findIndex(c => c.id === id)
      if (i >= prev.length - 1) return prev
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]]
      return next
    })

  // ── Products ─────────────────────────────────────────────────────────────
  const addProduct = (catId, data) => {
    const product = { id: uid('prod'), ...data }
    persist(prev => prev.map(c =>
      c.id === catId ? { ...c, products: [...c.products, product] } : c
    ))
  }
  const updateProduct = (catId, pid, data) =>
    persist(prev => prev.map(c =>
      c.id === catId
        ? { ...c, products: c.products.map(p => p.id === pid ? { ...p, ...data } : p) }
        : c
    ))
  const deleteProduct = (catId, pid) =>
    persist(prev => prev.map(c =>
      c.id === catId
        ? { ...c, products: c.products.filter(p => p.id !== pid) }
        : c
    ))
  const moveProductUp = (catId, pid) =>
    persist(prev => prev.map(c => {
      if (c.id !== catId) return c
      const i = c.products.findIndex(p => p.id === pid)
      if (i <= 0) return c
      const prods = [...c.products];
      [prods[i - 1], prods[i]] = [prods[i], prods[i - 1]]
      return { ...c, products: prods }
    }))
  const moveProductDown = (catId, pid) =>
    persist(prev => prev.map(c => {
      if (c.id !== catId) return c
      const i = c.products.findIndex(p => p.id === pid)
      if (i >= c.products.length - 1) return c
      const prods = [...c.products];
      [prods[i], prods[i + 1]] = [prods[i + 1], prods[i]]
      return { ...c, products: prods }
    }))

  const resetToDefaults = () => {
    persist(CATEGORIES)
  }

  return (
    <AdminContext.Provider value={{
      isAdmin, login, logout,
      catalog, loading, syncing,
      addCategory, updateCategory, deleteCategory, moveCategoryUp, moveCategoryDown,
      addProduct, updateProduct, deleteProduct, moveProductUp, moveProductDown,
      resetToDefaults,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
