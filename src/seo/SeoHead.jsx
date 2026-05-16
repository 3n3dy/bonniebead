import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAdmin } from '../admin/AdminContext'
import { resolveRouteSeo } from './shared'

function upsertMeta(selector, attrs) {
  let node = document.head.querySelector(selector)

  if (!node) {
    node = document.createElement('meta')
    const firstKey = Object.keys(attrs).find((key) => key === 'name' || key === 'property')
    if (firstKey) node.setAttribute(firstKey, attrs[firstKey])
    document.head.appendChild(node)
  }

  Object.entries(attrs).forEach(([key, value]) => {
    if (value == null) return
    node.setAttribute(key, value)
  })

  return node
}

function syncAlternateLinks(alternates = []) {
  document.head.querySelectorAll('link[data-seo-alternate="true"]').forEach((node) => node.remove())

  alternates.forEach(({ lang, href }) => {
    const link = document.createElement('link')
    link.setAttribute('rel', 'alternate')
    link.setAttribute('hreflang', lang)
    link.setAttribute('href', href)
    link.setAttribute('data-seo-alternate', 'true')
    document.head.appendChild(link)
  })
}

function syncJsonLd(items = []) {
  document.head.querySelectorAll('script[data-seo-jsonld="true"]').forEach((node) => node.remove())

  items.forEach((item) => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-seo-jsonld', 'true')
    script.textContent = JSON.stringify(item)
    document.head.appendChild(script)
  })
}

export default function SeoHead() {
  const location = useLocation()
  const { i18n } = useTranslation()
  const { catalog } = useAdmin()

  useEffect(() => {
    const seo = resolveRouteSeo(location.pathname, catalog)
    document.title = seo.title
    document.documentElement.lang = seo.lang

    upsertMeta('meta[name="description"]', { name: 'description', content: seo.description })
    upsertMeta('meta[name="robots"]', { name: 'robots', content: seo.robots })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: seo.description })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: seo.canonical })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: seo.type === 'product' ? 'product' : 'website' })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: seo.image })
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: seo.locale })
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.description })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: seo.image })

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', seo.canonical)

    syncAlternateLinks(seo.alternates)
    syncJsonLd(seo.jsonLd)

    if (i18n.language !== seo.lang) {
      i18n.changeLanguage(seo.lang)
    }
  }, [catalog, i18n, location.pathname])

  return null
}
