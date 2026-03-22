import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
import ProductPage from './components/ProductPage'
import Footer from './components/Footer'

// ── Slug утиліта ─────────────────────────────────────────────────────────
export function toSlug(str = '') {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0400-\u04FF-]/g, '')
    .replace(/--+/g, '-')
    .trim()
}

// ── Layout ───────────────────────────────────────────────────────────────
function Layout({ children }) {
  const navigate = useNavigate()
  const { i18n } = useTranslation()

  const goHome = () => {
    navigate(i18n.language === 'en' ? '/en' : '/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-100">
      <Header onHome={goHome} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  )
}

// ── Головна ──────────────────────────────────────────────────────────────
function HomePage() {
  const { catalog, loading } = useAdmin()
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const lang = i18n.language

  const handleSelect = (catId) => {
    const cat = catalog.find(c => c.id === catId)
    if (!cat) return
    const slug = toSlug(cat.nameLatin || cat.name)
    navigate(lang === 'en' ? `/en/catalog/${slug}` : `/catalog/${slug}`)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-8 h-8 border border-stone-300 border-t-stone-800 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs tracking-widest uppercase text-stone-400">Завантаження...</p>
      </div>
    </div>
  )

  return (
    <>
      <Hero />
      <CatalogGrid categories={catalog} onSelect={handleSelect} />
    </>
  )
}

// ── Сторінка категорії ───────────────────────────────────────────────────
function CategoryRoute() {
  const { categorySlug } = useParams()
  const navigate = useNavigate()
  const { catalog } = useAdmin()
  const { i18n } = useTranslation()
  const lang = i18n.language

  const category = catalog.find(c =>
    toSlug(c.nameLatin || '') === categorySlug || toSlug(c.name) === categorySlug
  )

  if (!category) return <Navigate to={lang === 'en' ? '/en' : '/'} replace />

  const handleProductClick = (product) => {
    const slug = toSlug(product.nameEN || product.name)
    const catSlug = toSlug(category.nameLatin || category.name)
    navigate(lang === 'en'
      ? `/en/catalog/${catSlug}/${slug}`
      : `/catalog/${catSlug}/${slug}`
    )
  }

  return (
    <CategoryPage
      category={category}
      onBack={() => navigate(lang === 'en' ? '/en' : '/')}
      onProductClick={handleProductClick}
    />
  )
}

// ── Сторінка товару ──────────────────────────────────────────────────────
function ProductRoute() {
  const { categorySlug, productSlug } = useParams()
  const navigate = useNavigate()
  const { catalog } = useAdmin()
  const { i18n } = useTranslation()
  const lang = i18n.language

  const category = catalog.find(c =>
    toSlug(c.nameLatin || '') === categorySlug || toSlug(c.name) === categorySlug
  )
  const product = category?.products.find(p =>
    toSlug(p.nameEN || p.name) === productSlug || toSlug(p.name) === productSlug
  )

  if (!category || !product) return <Navigate to={lang === 'en' ? '/en' : '/'} replace />

  const catSlug = toSlug(category.nameLatin || category.name)

  return (
    <ProductPage
      product={product}
      category={category}
      onBack={() => navigate(lang === 'en' ? `/en/catalog/${catSlug}` : `/catalog/${catSlug}`)}
    />
  )
}

// ── Публічний сайт ───────────────────────────────────────────────────────
function PublicSite() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const path = window.location.pathname
    if (path.startsWith('/en') && i18n.language !== 'en') i18n.changeLanguage('en')
    if (!path.startsWith('/en') && i18n.language !== 'uk') i18n.changeLanguage('uk')
  }, [])

  return (
    <UserProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/catalog/:categorySlug" element={<Layout><CategoryRoute /></Layout>} />
          <Route path="/catalog/:categorySlug/:productSlug" element={<Layout><ProductRoute /></Layout>} />

          <Route path="/en" element={<Layout><HomePage /></Layout>} />
          <Route path="/en/catalog/:categorySlug" element={<Layout><CategoryRoute /></Layout>} />
          <Route path="/en/catalog/:categorySlug/:productSlug" element={<Layout><ProductRoute /></Layout>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </UserProvider>
  )
}

// ── Адмін ────────────────────────────────────────────────────────────────
function AdminRoute() {
  const { isAdmin } = useAdmin()
  return isAdmin ? <AdminPanel /> : <AdminLogin />
}

export default function App() {
  const isAdmin = window.location.pathname === '/admin' || window.location.search.includes('admin')
  return (
    <BrowserRouter>
      <AdminProvider>
        {isAdmin ? <AdminRoute /> : <PublicSite />}
      </AdminProvider>
    </BrowserRouter>
  )
}
