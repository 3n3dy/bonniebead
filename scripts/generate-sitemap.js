import { writeFileSync } from 'fs'

const HOSTNAME = 'https://bonniebead.store'

function toSlug(str = '') {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0400-\u04FF-]/g, '')
    .replace(/--+/g, '-')
    .trim()
}

async function generateSitemap() {
  console.log('📦 Завантажую каталог з KV...')

  const res = await fetch(`${HOSTNAME}/catalog`)
  const data = await res.json()
  const catalog = data.catalog || []

  const urls = []

  // Головна (uk + en)
  urls.push({ loc: `${HOSTNAME}/`, priority: '1.0', changefreq: 'daily' })
  urls.push({ loc: `${HOSTNAME}/en`, priority: '1.0', changefreq: 'daily' })

  // Категорії + товари
  for (const cat of catalog) {
    const catSlug = toSlug(cat.nameLatin || cat.name)

    // Категорія
    urls.push({ loc: `${HOSTNAME}/catalog/${catSlug}`, priority: '0.9', changefreq: 'weekly' })
    urls.push({ loc: `${HOSTNAME}/en/catalog/${catSlug}`, priority: '0.9', changefreq: 'weekly' })

    // Товари
    for (const product of cat.products || []) {
      const prodSlug = toSlug(product.nameEN || product.name)

      urls.push({ loc: `${HOSTNAME}/catalog/${catSlug}/${prodSlug}`, priority: '0.8', changefreq: 'weekly' })
      urls.push({ loc: `${HOSTNAME}/en/catalog/${catSlug}/${prodSlug}`, priority: '0.8', changefreq: 'weekly' })
    }
  }

  // Генеруємо XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  writeFileSync('public/sitemap.xml', xml)
  console.log(`✅ sitemap.xml згенеровано — ${urls.length} URL`)
}

generateSitemap().catch(console.error)
