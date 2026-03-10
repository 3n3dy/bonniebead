import { useState } from 'react'
import { AdminProvider, useAdmin } from './admin/AdminContext'
import AdminLogin from './admin/AdminLogin'
import AdminPanel from './admin/AdminPanel'
import Header from './components/Header'
import Hero from './components/Hero'
import CatalogGrid from './components/CatalogGrid'
import CategoryPage from './components/CategoryPage'
import Footer from './components/Footer'

const IS_ADMIN_ROUTE =
  window.location.pathname === '/admin' ||
  window.location.search.includes('admin')

function PublicSite() {
  const { catalog } = useAdmin()
  const [activeCatId, setActiveCatId] = useState(null)
  const activeCategory = catalog.find(c => c.id === activeCatId)

  return (
    <div className="min-h-screen flex flex-col bg-cream-100">
      <Header onHome={() => setActiveCatId(null)} />
      <main className="flex-1">
        {activeCategory ? (
          <CategoryPage category={activeCategory} onBack={() => setActiveCatId(null)} />
        ) : (
          <>
            <Hero />
            <CatalogGrid categories={catalog} onSelect={setActiveCatId} />
          </>
        )}
      </main>
      <Footer />
    </div>
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
