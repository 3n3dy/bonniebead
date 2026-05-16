import { CATEGORIES } from '../data/catalog.js'

export const SITE_ORIGIN = 'https://bonniebead.store'
export const BRAND_NAME = 'BONNIEBEAD'
export const DEFAULT_TITLE = `${BRAND_NAME} · Handmade Beaded Jewelry`
export const DEFAULT_DESCRIPTION = 'Handmade jewelry from beads and minerals. Custom orders, bracelets, earrings, necklaces. Worldwide shipping from Ukraine.'
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.jpg`

export function toSlug(str = '') {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0400-\u04FF-]/g, '')
    .replace(/--+/g, '-')
    .trim()
}

export function getCatalogWithFallback(catalog) {
  return Array.isArray(catalog) && catalog.length ? catalog : CATEGORIES
}

export function stripTrailingSlash(pathname = '/') {
  if (!pathname || pathname === '/') return '/'
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

export function detectLang(pathname = '/') {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'uk'
}

export function getPathWithoutLang(pathname = '/') {
  if (pathname === '/en') return '/'
  if (pathname.startsWith('/en/')) return pathname.slice(3) || '/'
  return pathname || '/'
}

export function localizedCategoryName(category, lang) {
  if (!category) return ''
  return lang === 'en' && category.nameEN ? category.nameEN : category.name
}

export function localizedCategoryNote(category, lang) {
  if (!category) return ''
  return lang === 'en' && category.noteEN ? category.noteEN : category.note
}

export function localizedProductName(product, lang) {
  if (!product) return ''
  return lang === 'en' && product.nameEN ? product.nameEN : product.name
}

export function localizedProductDescription(product, lang) {
  if (!product) return ''
  return lang === 'en' && product.descriptionEN ? product.descriptionEN : product.description
}

export function toAbsoluteUrl(url = '') {
  if (!url) return DEFAULT_OG_IMAGE
  if (/^https?:\/\//i.test(url)) return url
  return `${SITE_ORIGIN}${url.startsWith('/') ? url : `/${url}`}`
}

function buildPath(lang, segments = []) {
  const prefix = lang === 'en' ? '/en' : ''
  const suffix = segments.filter(Boolean).join('/')
  if (!suffix) return prefix || '/'
  return `${prefix}/${suffix}`
}

function makeUrl(path) {
  return `${SITE_ORIGIN}${path === '/' ? '' : path}`
}

function makeAlternateLinks(ukPath, enPath) {
  return [
    { lang: 'uk', href: makeUrl(ukPath) },
    { lang: 'en', href: makeUrl(enPath) },
    { lang: 'x-default', href: makeUrl(ukPath) },
  ]
}

function truncate(text = '', max = 160) {
  const normalized = String(text).replace(/\s+/g, ' ').trim()
  if (normalized.length <= max) return normalized
  return `${normalized.slice(0, max - 1).trim()}…`
}

function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND_NAME,
    url: SITE_ORIGIN,
    logo: DEFAULT_OG_IMAGE,
  }
}

function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BRAND_NAME,
    url: SITE_ORIGIN,
    inLanguage: ['uk', 'en'],
  }
}

function buildCollectionJsonLd({ name, description, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
  }
}

function buildProductJsonLd({ name, description, url, image, material, price, availability, categoryName }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url,
    category: categoryName,
    image: image ? [image] : undefined,
    material: material || undefined,
    brand: {
      '@type': 'Brand',
      name: BRAND_NAME,
    },
  }

  if (price) {
    const amount = Number.parseFloat(
      String(price)
        .replace(/\s/g, '')
        .replace(/[^\d.,]/g, '')
        .replace(',', '.')
    )
    if (!Number.isNaN(amount)) {
      data.offers = {
        '@type': 'Offer',
        priceCurrency: 'UAH',
        price: amount.toFixed(2),
        availability: availability === 'in_stock'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/PreOrder',
        url,
      }
    }
  }

  return data
}

export function resolveRouteSeo(rawPathname, rawCatalog) {
  const pathname = stripTrailingSlash(rawPathname || '/')
  const lang = detectLang(pathname)
  const pathWithoutLang = stripTrailingSlash(getPathWithoutLang(pathname))
  const catalog = getCatalogWithFallback(rawCatalog)
  const locale = lang === 'en' ? 'en_US' : 'uk_UA'
  const base = {
    lang,
    locale,
    pathname,
    robots: 'index,follow,max-image-preview:large',
  }

  if (pathname === '/admin') {
    return {
      ...base,
      type: 'admin',
      title: `Admin · ${BRAND_NAME}`,
      description: 'Admin area.',
      canonical: makeUrl('/admin'),
      alternates: [],
      image: DEFAULT_OG_IMAGE,
      jsonLd: [],
      status: 200,
      robots: 'noindex,nofollow',
    }
  }

  if (pathWithoutLang === '/') {
    const title = lang === 'en'
      ? `${BRAND_NAME} · Handmade Beaded Jewelry from Ukraine`
      : `${BRAND_NAME} · Прикраси ручної роботи з бісеру`
    const description = lang === 'en'
      ? 'Handmade beaded jewelry, custom designs, earrings, bracelets, rings, necklaces, and gifts from Ukraine.'
      : 'Прикраси ручної роботи з бісеру та мінералів: сережки, браслети, каблучки, намисто та подарунки з України.'

    return {
      ...base,
      type: 'home',
      title,
      description,
      canonical: makeUrl(buildPath(lang)),
      alternates: makeAlternateLinks('/', '/en'),
      image: DEFAULT_OG_IMAGE,
      category: null,
      product: null,
      catalog,
      jsonLd: [buildOrganizationJsonLd(), buildWebsiteJsonLd()],
      status: 200,
    }
  }

  const segments = pathWithoutLang.split('/').filter(Boolean)

  if (segments[0] === 'catalog' && segments.length >= 2) {
    const [, categorySlug, productSlug] = segments
    const category = catalog.find((item) =>
      toSlug(item.nameLatin || '') === categorySlug || toSlug(item.name || '') === categorySlug
    )

    if (!category) {
      return {
        ...base,
        type: 'not_found',
        title: `${BRAND_NAME} · Page not found`,
        description: DEFAULT_DESCRIPTION,
        canonical: makeUrl(pathname),
        alternates: [],
        image: DEFAULT_OG_IMAGE,
        jsonLd: [],
        status: 404,
        robots: 'noindex,follow',
      }
    }

    if (!productSlug) {
      const categoryName = localizedCategoryName(category, lang)
      const categoryNote = localizedCategoryNote(category, lang)
      const description = truncate(
        lang === 'en'
          ? `${categoryName} by ${BRAND_NAME}. ${categoryNote || 'Browse handcrafted jewelry pieces available in this collection.'}`
          : `${categoryName} від ${BRAND_NAME}. ${categoryNote || 'Перегляньте прикраси ручної роботи з цієї колекції.'}`
      )
      const catSlug = toSlug(category.nameLatin || category.name)

      return {
        ...base,
        type: 'category',
        title: `${categoryName} · ${BRAND_NAME}`,
        description,
        canonical: makeUrl(buildPath(lang, ['catalog', catSlug])),
        alternates: makeAlternateLinks(
          buildPath('uk', ['catalog', catSlug]),
          buildPath('en', ['catalog', catSlug])
        ),
        image: DEFAULT_OG_IMAGE,
        category,
        product: null,
        catalog,
        jsonLd: [
          buildCollectionJsonLd({
            name: categoryName,
            description,
            url: makeUrl(buildPath(lang, ['catalog', catSlug])),
          }),
        ],
        status: 200,
      }
    }

    const product = category.products?.find((item) =>
      toSlug(item.nameEN || item.name || '') === productSlug || toSlug(item.name || '') === productSlug
    )

    if (!product) {
      return {
        ...base,
        type: 'not_found',
        title: `${BRAND_NAME} · Page not found`,
        description: DEFAULT_DESCRIPTION,
        canonical: makeUrl(pathname),
        alternates: [],
        image: DEFAULT_OG_IMAGE,
        jsonLd: [],
        status: 404,
        robots: 'noindex,follow',
      }
    }

    const categoryName = localizedCategoryName(category, lang)
    const productName = localizedProductName(product, lang)
    const productDescription = truncate(product.seoDescription || localizedProductDescription(product, lang) || DEFAULT_DESCRIPTION)
    const catSlug = toSlug(category.nameLatin || category.name)
    const prodSlug = toSlug(product.nameEN || product.name)
    const canonicalPath = buildPath(lang, ['catalog', catSlug, prodSlug])
    const image = toAbsoluteUrl(product.images?.[0] || product.image || DEFAULT_OG_IMAGE)

    return {
      ...base,
      type: 'product',
      title: `${productName} · ${BRAND_NAME}`,
      description: productDescription,
      canonical: makeUrl(canonicalPath),
      alternates: makeAlternateLinks(
        buildPath('uk', ['catalog', catSlug, prodSlug]),
        buildPath('en', ['catalog', catSlug, prodSlug])
      ),
      image,
      category,
      product,
      catalog,
      jsonLd: [
        buildProductJsonLd({
          name: productName,
          description: productDescription,
          url: makeUrl(canonicalPath),
          image,
          material: product.material,
          price: product.price,
          availability: product.availability,
          categoryName,
        }),
      ],
      status: 200,
    }
  }

  return {
    ...base,
    type: 'not_found',
    title: `${BRAND_NAME} · Page not found`,
    description: DEFAULT_DESCRIPTION,
    canonical: makeUrl(pathname),
    alternates: [],
    image: DEFAULT_OG_IMAGE,
    jsonLd: [],
    status: 404,
    robots: 'noindex,follow',
  }
}
