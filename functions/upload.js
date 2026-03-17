export async function onRequestPost(context) {
  const { request, env } = context

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  try {
    // Перевіряємо наявність R2 binding
    if (!env.IMAGES) {
      return new Response(JSON.stringify({ error: 'R2 binding IMAGES не налаштовано' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return new Response(JSON.stringify({ error: 'Файл не знайдено' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    // Генеруємо унікальне ім'я файлу
    const ext = file.name.split('.').pop().toLowerCase() || 'jpg'
    const allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif']
    if (!allowed.includes(ext)) {
      return new Response(JSON.stringify({ error: 'Дозволені формати: JPG, PNG, WEBP' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const arrayBuffer = await file.arrayBuffer()

    // Зберігаємо в R2
    await env.IMAGES.put(filename, arrayBuffer, {
      httpMetadata: { contentType: file.type || 'image/jpeg' },
    })

    // Повертаємо публічний URL
    const publicUrl = `${env.R2_PUBLIC_URL || 'https://pub-09eaaa79c46c4ec7992e67ad4a5c36b6.r2.dev'}/${filename}`

    return new Response(JSON.stringify({ url: publicUrl, filename }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
}

// Обробка preflight CORS
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
