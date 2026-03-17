import { useState } from 'react'
import { AdminProvider, useAdmin } from './admin/AdminContext'
import AdminLogin from './admin/AdminLogin'
import AdminPanel from './admin/AdminPanel'
import { CartProvider } from './cart/CartContext'
import CartDrawer from './cart/CartDrawer'
import { UserProvider } from './user/UserContext'
import Header from './components/Header'
import Hero from './components/Hero'
import CatalogGrid from './components/CatalogGrid'
import CategoryPage from './components/CategoryPage'
import Footer from './components/Footer'

const IS_ADMIN_ROUTE =
  window.location.pathname === '/admin' ||
  window.location.search.includes('admin')

function PublicSite() {
  const { catalog, loading } = useAdmin()
  const [activeCatId, setActiveCatId] = useState(null)
  const activeCategory = catalog.find(c => c.id === activeCatId)

  return (
    <UserProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-cream-100">
          <Header onHome={() => { setActiveCatId(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
          <main className="flex-1">
            {loading ? (
              // Лоадер поки каталог завантажується з KV
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                  <div className="w-8 h-8 border border-stone-300 border-t-stone-800 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-xs tracking-widest uppercase text-stone-400">Завантаження...</p>
                </div>
              </div>
            ) : activeCategory ? (
              <CategoryPage category={activeCategory} onBack={() => setActiveCatId(null)} />
            ) : (
              <>
                <Hero />
                <CatalogGrid categories={catalog} onSelect={setActiveCatId} />
              </>
            )}
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </UserProvider>
  )
}

function AdminRoute() {
  const { isAdmin } = useAdmin()
  return isAdmin ? <AdminPanel /> : <AdminLogin />
}

export default function App() {
  return (
    <AdminProvider>
      {IS_ADMIN_ROUTE ? <AdminRoute /> : <PublicSite />}
    </AdminProvider>
  )
}
