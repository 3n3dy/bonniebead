// Хук для завантаження фото на R2 через Pages Function
import { useState } from 'react'

export function useImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const upload = async (file) => {
    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Помилка завантаження')

      return data.url
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading, error }
}
