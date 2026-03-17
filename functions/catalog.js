// functions/catalog.js
// GET  /catalog — повертає каталог з KV
// POST /catalog — зберігає каталог в KV (тільки з паролем)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
}

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  })

// GET — читаємо каталог
export async function onRequestGet({ env }) {
  if (!env.CATALOG) return json({ error: 'KV binding CATALOG не налаштовано' }, 500)

  const raw = await env.CATALOG.get('catalog')
  if (!raw) return json({ catalog: null }) // null = використовуй дефолтні дані

  return json({ catalog: JSON.parse(raw) })
}

// POST — зберігаємо каталог
export async function onRequestPost({ request, env }) {
  if (!env.CATALOG) return json({ error: 'KV binding CATALOG не налаштовано' }, 500)

  // Перевіряємо пароль адміна
  const password = request.headers.get('X-Admin-Password')
  if (password !== env.ADMIN_PASSWORD) {
    return json({ error: 'Невірний пароль' }, 401)
  }

  const body = await request.json()
  if (!body.catalog) return json({ error: 'Каталог не знайдено в тілі запиту' }, 400)

  await env.CATALOG.put('catalog', JSON.stringify(body.catalog))
  return json({ ok: true })
}

// CORS preflight
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS })
}
