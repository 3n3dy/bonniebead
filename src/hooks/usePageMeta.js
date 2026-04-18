import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const HOSTNAME = 'https://bonniebead.store'

// Returns { uk, en } canonical paths for a given pathname
function getHreflangPaths(pathname) {
  if (pathname.startsWith('/en')) {
    const ukPath = pathname.slice(3) || '/'
    return { uk: ukPath, en: pathname }
  }
  return {
    uk: pathname,
    en: '/en' + (pathname === '/' ? '' : pathname),
  }
}

function ensureMetaName(name) {
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  return el
}

function ensureMetaProp(prop) {
  let el = document.querySelector(`meta[property="${prop}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', prop)
    document.head.appendChild(el)
  }
  return el
}

function ensureLink(rel, hreflang) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`
  let el = document.querySelector(selector)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    if (hreflang) el.setAttribute('hreflang', hreflang)
    document.head.appendChild(el)
  }
  return el
}

/**
 * Manages all page-level SEO meta tags:
 * - document.title
 * - meta description
 * - Open Graph (title, description, url, locale, image)
 * - canonical link
 * - hreflang alternates (uk, en, x-default)
 * - html[lang] attribute
 *
 * @param {object} params
 * @param {string} params.title       Full page title (e.g. "Earrings · BONNIEBEAD")
 * @param {string} params.description Meta description text
 * @param {string} [params.ogImage]   Absolute URL for og:image (falls back to existing)
 * @param {string} params.lang        'uk' | 'en'
 */
export function usePageMeta({ title, description, ogImage, lang }) {
  const { pathname } = useLocation()

  useEffect(() => {
    const { uk: ukPath, en: enPath } = getHreflangPaths(pathname)
    const canonicalUrl = HOSTNAME + (lang === 'en' ? enPath : ukPath)
    const ukUrl = HOSTNAME + ukPath
    const enUrl = HOSTNAME + enPath

    // Title + html lang
    document.title = title
    document.documentElement.lang = lang === 'en' ? 'en' : 'uk'

    // Meta description
    ensureMetaName('description').setAttribute('content', description)

    // Open Graph
    ensureMetaProp('og:title').setAttribute('content', title)
    ensureMetaProp('og:description').setAttribute('content', description)
    ensureMetaProp('og:url').setAttribute('content', canonicalUrl)
    ensureMetaProp('og:locale').setAttribute('content', lang === 'en' ? 'en_US' : 'uk_UA')
    if (ogImage) ensureMetaProp('og:image').setAttribute('content', ogImage)

    // Canonical (update existing tag or create one)
    ensureLink('canonical', null).setAttribute('href', canonicalUrl)

    // hreflang alternates
    ensureLink('alternate', 'uk').setAttribute('href', ukUrl)
    ensureLink('alternate', 'en').setAttribute('href', enUrl)
    ensureLink('alternate', 'x-default').setAttribute('href', ukUrl)
  }, [title, description, ogImage, lang, pathname])
}
