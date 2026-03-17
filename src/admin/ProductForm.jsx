import { useState, useRef } from 'react'
import { Modal, Field, Btn } from './AdminUI'
import { useImageUpload } from './useImageUpload'

// Один слот фото — URL або файл
function ImageSlot({ index, value, onChange, isMain }) {
  const { upload, uploading, error } = useImageUpload()
  const inputRef = useRef(null)
  const [mode, setMode] = useState(value ? 'url' : 'url') // 'url' | 'file'

  const handleFile = async (file) => {
    if (!file) return
    const url = await upload(file)
    if (url) onChange(url)
  }

  return (
    <div className="space-y-1.5">
      {/* Лейбл + перемикач */}
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-widest uppercase text-stone-500">
          {isMain ? 'Головне фото *' : `Фото ${index + 1}`}
        </span>
        <div className="flex border border-stone-700 text-xs overflow-hidden">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2.5 py-1 transition-colors ${mode === 'url' ? 'bg-stone-700 text-cream-100' : 'text-stone-500 hover:text-stone-300'}`}
          >
            URL
          </button>
          <button
            type="button"
            onClick={() => setMode('file')}
            className={`px-2.5 py-1 transition-colors ${mode === 'file' ? 'bg-stone-700 text-cream-100' : 'text-stone-500 hover:text-stone-300'}`}
          >
            З ПК
          </button>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <div className="flex-1">
          {mode === 'url' ? (
            <input
              type="url"
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder="https://i.ibb.co/..."
              className="w-full bg-stone-900 border border-stone-700 focus:border-blush text-cream-100 placeholder-stone-600 text-sm px-3 py-2.5 outline-none transition-colors"
            />
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="w-full bg-stone-900 border border-stone-700 hover:border-stone-500 text-stone-400 hover:text-stone-200 text-sm px-3 py-2.5 text-left transition-colors disabled:opacity-50"
            >
              {uploading ? '⏳ Завантаження...' : value ? '✓ Фото завантажено' : 'Обрати файл...'}
            </button>
          )}
          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>

        {/* Прев'ю */}
        {value?.trim() && (
          <div className="w-10 h-10 flex-shrink-0 bg-stone-800 overflow-hidden border border-stone-700">
            <img
              src={value.trim()}
              alt=""
              className="w-full h-full object-cover"
              onError={e => e.target.style.opacity = '0.2'}
            />
          </div>
        )}

        {/* Очистити */}
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-stone-600 hover:text-red-400 transition-colors text-sm w-5 flex-shrink-0"
          >
            ✕
          </button>
        )}
      </div>

      {/* Прихований file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}

export default function ProductForm({ initial = {}, onSave, onClose }) {
  const [name, setName]               = useState(initial.name || '')
  const [price, setPrice]             = useState(initial.price || '')
  const [material, setMaterial]       = useState(initial.material || '')
  const [description, setDescription] = useState(initial.description || '')
  const [urls, setUrls] = useState(() => {
    if (initial.images?.length) return [...initial.images, '', ''].slice(0, 3)
    if (initial.image) return [initial.image, '', '']
    return ['', '', '']
  })

  const setUrl = (i, val) => setUrls(prev => prev.map((u, idx) => idx === i ? val : u))
  const valid = name.trim()

  const handleSave = () => {
    if (!valid) return
    const images = urls.map(u => u.trim()).filter(Boolean)
    onSave({
      name: name.trim(),
      price: price.trim(),
      material: material.trim(),
      description: description.trim(),
      images,
      image: images[0] || '',
    })
    onClose()
  }

  return (
    <Modal title={initial.id ? 'Редагувати товар' : 'Новий товар'} onClose={onClose}>
      <Field label="Назва *" value={name} onChange={setName} placeholder="Золоті кульчики" />

      <div className="grid grid-cols-2 gap-3">
        <Field label="Ціна" value={price} onChange={setPrice} placeholder="2 400 ₴" />
        <Field label="Матеріал" value={material} onChange={setMaterial} placeholder="Золото 585" />
      </div>

      <Field label="Опис" value={description} onChange={setDescription} multiline placeholder="Короткий опис..." />

      {/* Фото */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-stone-800" />
          <span className="text-xs tracking-widest uppercase text-stone-600">Фото (до 3 штук)</span>
          <div className="h-px flex-1 bg-stone-800" />
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          <span className="text-stone-400">URL:</span> завантажте на{' '}
          <a href="https://imgbb.com" target="_blank" rel="noreferrer"
            className="text-blush underline hover:text-cream-100 transition-colors">
            imgbb.com
          </a>
          {' '}→ скопіюйте "Direct link"
          <br />
          <span className="text-stone-400">З ПК:</span> потрібне налаштування R2 в Cloudflare
        </p>

        {urls.map((url, i) => (
          <ImageSlot
            key={i}
            index={i}
            value={url}
            onChange={val => setUrl(i, val)}
            isMain={i === 0}
          />
        ))}
      </div>

      <div className="flex gap-3 pt-1">
        <Btn onClick={handleSave} disabled={!valid} className="flex-1">
          {initial.id ? 'Зберегти' : 'Додати'}
        </Btn>
        <Btn variant="ghost" onClick={onClose} className="flex-1">Скасувати</Btn>
      </div>
    </Modal>
  )
}
