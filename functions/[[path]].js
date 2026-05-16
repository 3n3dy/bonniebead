import { CATEGORIES } from '../src/data/catalog.js'
import {
  BRAND_NAME,
  DEFAULT_OG_IMAGE,
  resolveRouteSeo,
  SITE_ORIGIN,
  toAbsoluteUrl,
  toSlug,
  localizedCategoryName,
  localizedProductDescription,
  localizedProductName,
} from '../src/seo/shared.js'

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function isAssetPath(pathname) {
  return pathname.includes('.') || pathname.startsWith('/assets/')
}

async function loadCatalog(env) {
  try {
    if (!env.CATALOG) return CATEGORIES
    const raw = await env.CATALOG.get('catalog')
    return raw ? JSON.parse(raw) : CATEGORIES
  } catch {
    return CATEGORIES
  }
}

function renderHomeContent(seo) {
  const intro = seo.lang === 'en'
    ? 'Browse handmade beaded jewelry collections, custom designs, and gift ideas.'
    : 'Перегляньте колекції прикрас ручної роботи з бісеру, індивідуальні дизайни та ідеї подарунків.'

  const items = (seo.catalog || []).map((category) => {
    const slug = toSlug(category.nameLatin || category.name)
    const name = localizedCategoryName(category, seo.lang)
    const href = `${SITE_ORIGIN}${seo.lang === 'en' ? '/en' : ''}/catalog/${slug}`
    return `<li><a href="${href}">${escapeHtml(name)}</a></li>`
  }).join('')

  return `<main id="seo-prerender"><h1>${escapeHtml(seo.title)}</h1><p>${escapeHtml(intro)}</p><ul>${items}</ul></main>`
}

function renderCategoryContent(seo) {
  const categoryName = localizedCategoryName(seo.category, seo.lang)
  const categorySlug = toSlug(seo.category.nameLatin || seo.category.name)
  const items = (seo.category.products || []).map((product) => {
    const productName = localizedProductName(product, seo.lang)
    const href = `${SITE_ORIGIN}${seo.lang === 'en' ? '/en' : ''}/catalog/${categorySlug}/${toSlug(product.nameEN || product.name)}`
    return `<li><a href="${href}">${escapeHtml(productName)}</a></li>`
  }).join('')

  return `<main id="seo-prerender"><nav><a href="${SITE_ORIGIN}${seo.lang === 'en' ? '/en' : ''}">${BRAND_NAME}</a></nav><h1>${escapeHtml(categoryName)}</h1><p>${escapeHtml(seo.description)}</p><ul>${items}</ul></main>`
}

function renderProductContent(seo) {
  const categoryName = localizedCategoryName(seo.category, seo.lang)
  const productName = localizedProductName(seo.product, seo.lang)
  const description = localizedProductDescription(seo.product, seo.lang) || seo.description
  const image = toAbsoluteUrl(seo.product.images?.[0] || seo.product.image || DEFAULT_OG_IMAGE)
  const price = seo.product.price ? `<p>${escapeHtml(seo.product.price)}</p>` : ''
  const material = seo.product.material ? `<p>${escapeHtml(seo.product.material)}</p>` : ''

  return `<main id="seo-prerender"><nav><a href="${SITE_ORIGIN}${seo.lang === 'en' ? '/en' : ''}">${BRAND_NAME}</a> / <span>${escapeHtml(categoryName)}</span></nav><article><h1>${escapeHtml(productName)}</h1><img src="${image}" alt="${escapeHtml(productName)}" /><p>${escapeHtml(description)}</p>${price}${material}</article></main>`
}

function renderFallbackContent(seo) {
  const message = seo.lang === 'en' ? 'Page not found.' : 'Сторінку не знайдено.'
  return `<main id="seo-prerender"><h1>${escapeHtml(BRAND_NAME)}</h1><p>${escapeHtml(message)}</p></main>`
}

function buildPrerenderContent(seo) {
  if (seo.type === 'home') return renderHomeContent(seo)
  if (seo.type === 'category') return renderCategoryContent(seo)
  if (seo.type === 'product') return renderProductContent(seo)
  return renderFallbackContent(seo)
}

function buildAlternateTags(alternates = []) {
  return alternates
    .map(({ lang, href }) => `<link rel="alternate" hreflang="${lang}" href="${href}" />`)
    .join('')
}

function buildJsonLd(seo) {
  return seo.jsonLd
    .map((item) => `<script type="application/ld+json">${JSON.stringify(item)}</script>`)
    .join('')
}

function injectSeo(html, seo) {
  const headTags = [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
    `<meta name="robots" content="${escapeHtml(seo.robots)}" />`,
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(seo.canonical)}" />`,
    `<meta property="og:type" content="${seo.type === 'product' ? 'product' : 'website'}" />`,
    `<meta property="og:image" content="${escapeHtml(seo.image)}" />`,
    `<meta property="og:locale" content="${escapeHtml(seo.locale)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(seo.image)}" />`,
    `<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`,
    buildAlternateTags(seo.alternates),
    buildJsonLd(seo),
  ].join('')

  const withoutOldCanonical = html.replace(/<link rel="canonical"[^>]*>/gi, '')
  const withoutOldTitle = withoutOldCanonical.replace(/<title>[\s\S]*?<\/title>/gi, '')
  const withoutOldMeta = withoutOldTitle
    .replace(/<meta name="description"[^>]*>/gi, '')
    .replace(/<meta name="robots"[^>]*>/gi, '')
    .replace(/<meta property="og:title"[^>]*>/gi, '')
    .replace(/<meta property="og:description"[^>]*>/gi, '')
    .replace(/<meta property="og:url"[^>]*>/gi, '')
    .replace(/<meta property="og:type"[^>]*>/gi, '')
    .replace(/<meta property="og:image"[^>]*>/gi, '')
    .replace(/<meta property="og:locale"[^>]*>/gi, '')
    .replace(/<meta name="twitter:card"[^>]*>/gi, '')
    .replace(/<meta name="twitter:title"[^>]*>/gi, '')
    .replace(/<meta name="twitter:description"[^>]*>/gi, '')
    .replace(/<meta name="twitter:image"[^>]*>/gi, '')
    .replace(/<link rel="alternate"[^>]*hreflang="[^"]*"[^>]*>/gi, '')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '')
  const prerender = buildPrerenderContent(seo)

  return withoutOldMeta
    .replace(/<html lang="[^"]*">/i, `<html lang="${seo.lang}">`)
    .replace('</head>', `${headTags}</head>`)
    .replace('<body>', `<body>${prerender}`)
}

export async function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)

  if (
    request.method !== 'GET' ||
    url.pathname === '/catalog' ||
    url.pathname === '/upload' ||
    isAssetPath(url.pathname)
  ) {
    return context.next()
  }

  const response = await context.next()
  const contentType = response.headers.get('content-type') || ''

  if (!contentType.includes('text/html')) {
    return response
  }

  const html = await response.text()
  const catalog = await loadCatalog(context.env)
  const seo = resolveRouteSeo(url.pathname, catalog)
  const transformed = injectSeo(html, seo)

  const headers = new Headers(response.headers)
  headers.set('content-type', 'text/html; charset=UTF-8')

  return new Response(transformed, {
    status: seo.status === 404 ? 404 : response.status,
    headers,
  })
}
