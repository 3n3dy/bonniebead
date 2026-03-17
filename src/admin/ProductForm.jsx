import { useState } from 'react'
import { Modal, Field, Btn } from './AdminUI'

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

      {/* URL фото */}
      <div className="space-y-2">
        <label className="block text-xs tracking-widest uppercase text-stone-500">
          Фото (до 3 URL)
        </label>
        <p className="text-xs text-stone-600 leading-relaxed">
          Завантажте фото на{' '}
          <a href="https://imgbb.com" target="_blank" rel="noreferrer" className="text-blush underline hover:text-cream-100 transition-colors">
            imgbb.com
          </a>
          {' '}→ скопіюйте "Direct link" → вставте сюди
        </p>

        {urls.map((url, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1">
              <input
                type="url"
                value={url}
                onChange={e => setUrl(i, e.target.value)}
                placeholder={i === 0 ? 'Головне фото (URL)' : `Фото ${i + 1} (URL, необов'язково)`}
                className="w-full bg-stone-900 border border-stone-700 focus:border-blush text-cream-100 placeholder-stone-600 text-sm px-3 py-2.5 outline-none transition-colors"
              />
            </div>
            {/* Прев'ю */}
            {url.trim() && (
              <div className="w-10 h-10 flex-shrink-0 bg-stone-800 overflow-hidden border border-stone-700">
                <img
                  src={url.trim()}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={e => { e.target.style.display = 'none' }}
                />
              </div>
            )}
          </div>
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
