import { writeFileSync } from 'fs'
import { CATEGORIES } from '../src/data/catalog.js'
import { SITE_ORIGIN, toSlug } from '../src/seo/shared.js'

async function generateSitemap() {
  console.log('📦 Завантажую каталог з KV...')

  let catalog = CATEGORIES

  try {
    const res = await fetch(`${SITE_ORIGIN}/catalog`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    catalog = data.catalog || CATEGORIES
  } catch (error) {
    console.warn(`⚠️ Не вдалося завантажити каталог з продакшну, використовую локальні дані: ${error.message}`)
  }

  const urls = []
  const lastmod = new Date().toISOString()

  // Головна (uk + en)
  urls.push({ loc: `${SITE_ORIGIN}/`, alternate: `${SITE_ORIGIN}/en`, xDefault: `${SITE_ORIGIN}/`, priority: '1.0', changefreq: 'daily', lastmod })
  urls.push({ loc: `${SITE_ORIGIN}/en`, alternate: `${SITE_ORIGIN}/`, xDefault: `${SITE_ORIGIN}/`, priority: '1.0', changefreq: 'daily', lastmod })

  // Категорії + товари
  for (const cat of catalog) {
    const catSlug = toSlug(cat.nameLatin || cat.name)

    // Категорія
    urls.push({
      loc: `${SITE_ORIGIN}/catalog/${catSlug}`,
      alternate: `${SITE_ORIGIN}/en/catalog/${catSlug}`,
      xDefault: `${SITE_ORIGIN}/catalog/${catSlug}`,
      priority: '0.9',
      changefreq: 'weekly',
      lastmod,
    })
    urls.push({
      loc: `${SITE_ORIGIN}/en/catalog/${catSlug}`,
      alternate: `${SITE_ORIGIN}/catalog/${catSlug}`,
      xDefault: `${SITE_ORIGIN}/catalog/${catSlug}`,
      priority: '0.9',
      changefreq: 'weekly',
      lastmod,
    })

    // Товари
    for (const product of cat.products || []) {
      const prodSlug = toSlug(product.nameEN || product.name)

      urls.push({
        loc: `${SITE_ORIGIN}/catalog/${catSlug}/${prodSlug}`,
        alternate: `${SITE_ORIGIN}/en/catalog/${catSlug}/${prodSlug}`,
        xDefault: `${SITE_ORIGIN}/catalog/${catSlug}/${prodSlug}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod,
      })
      urls.push({
        loc: `${SITE_ORIGIN}/en/catalog/${catSlug}/${prodSlug}`,
        alternate: `${SITE_ORIGIN}/catalog/${catSlug}/${prodSlug}`,
        xDefault: `${SITE_ORIGIN}/catalog/${catSlug}/${prodSlug}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod,
      })
    }
  }

  // Генеруємо XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <xhtml:link rel="alternate" hreflang="${u.loc.includes('/en') ? 'en' : 'uk'}" href="${u.loc}" />
    <xhtml:link rel="alternate" hreflang="${u.alternate.includes('/en') ? 'en' : 'uk'}" href="${u.alternate}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${u.xDefault}" />
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  writeFileSync('public/sitemap.xml', xml)
  console.log(`✅ sitemap.xml згенеровано — ${urls.length} URL`)
}

generateSitemap().catch(console.error)
