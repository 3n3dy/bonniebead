import { createContext, useContext, useState, useCallback } from 'react'
import { CATEGORIES } from '../data/catalog'

const AdminContext = createContext(null)

const STORAGE_KEY = 'maison_catalog_v1'
const ADMIN_PASSWORD = 'maison2025' // ← змінити на свій пароль

function loadCatalog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return CATEGORIES
}

function saveCatalog(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
}

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(
    () => sessionStorage.getItem('maison_admin') === '1'
  )
  const [catalog, setCatalog] = useState(loadCatalog)

  const persist = useCallback((updater) => {
    setCatalog(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveCatalog(next)
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

  // Categories
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
      const next = [...prev]
      ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
      return next
    })
  const moveCategoryDown = (id) =>
    persist(prev => {
      const i = prev.findIndex(c => c.id === id)
      if (i >= prev.length - 1) return prev
      const next = [...prev]
      ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
      return next
    })

  // Products
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
      const prods = [...c.products]
      ;[prods[i - 1], prods[i]] = [prods[i], prods[i - 1]]
      return { ...c, products: prods }
    }))
  const moveProductDown = (catId, pid) =>
    persist(prev => prev.map(c => {
      if (c.id !== catId) return c
      const i = c.products.findIndex(p => p.id === pid)
      if (i >= c.products.length - 1) return c
      const prods = [...c.products]
      ;[prods[i], prods[i + 1]] = [prods[i + 1], prods[i]]
      return { ...c, products: prods }
    }))

  const resetToDefaults = () => {
    saveCatalog(CATEGORIES)
    setCatalog(CATEGORIES)
  }

  return (
    <AdminContext.Provider value={{
      isAdmin, login, logout, catalog,
      addCategory, updateCategory, deleteCategory, moveCategoryUp, moveCategoryDown,
      addProduct, updateProduct, deleteProduct, moveProductUp, moveProductDown,
      resetToDefaults,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
