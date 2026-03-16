import { useState, useRef } from 'react'
import { Modal, Field, Btn } from './AdminUI'

function ImageUploader({ images, onChange }) {
  const inputRef = useRef(null)

  const handleFiles = (files) => {
    const remaining = 3 - images.length
    const toProcess = Array.from(files).slice(0, remaining)

    toProcess.forEach(file => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = (e) => {
        onChange(prev => [...prev, e.target.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const removeImage = (i) => {
    onChange(prev => prev.filter((_, idx) => idx !== i))
  }

  return (
    <div>
      <label className="block text-xs tracking-widest uppercase text-stone-500 mb-2">
        Фото (до 3 штук)
      </label>

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {images.map((src, i) => (
            <div key={i} className="relative aspect-square bg-stone-800 overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-stone-950/80 text-cream-100 flex items-center justify-center text-xs hover:bg-red-900 transition-colors"
              >
                ✕
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-xs bg-stone-950/70 text-stone-400 px-1">
                  головне
                </span>
              )}
            </div>
          ))}
          {/* Empty slots */}
          {Array.from({ length: 3 - images.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="aspect-square border border-dashed border-stone-700 flex items-center justify-center text-stone-700 text-xs cursor-pointer hover:border-stone-500 transition-colors"
              onClick={() => inputRef.current?.click()}
            >
              +
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {images.length < 3 && (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border border-dashed border-stone-700 hover:border-stone-400 transition-colors p-6 text-center cursor-pointer"
        >
          <p className="text-xs text-stone-500 tracking-wide">
            Перетягніть фото або <span className="text-stone-300 underline">оберіть файл</span>
          </p>
          <p className="text-xs text-stone-700 mt-1">JPG, PNG, WEBP · залишилось {3 - images.length}</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />
    </div>
  )
}

export default function ProductForm({ initial = {}, onSave, onClose }) {
  const [name, setName]               = useState(initial.name || '')
  const [price, setPrice]             = useState(initial.price || '')
  const [material, setMaterial]       = useState(initial.material || '')
  const [description, setDescription] = useState(initial.description || '')
  const [images, setImages]           = useState(() => {
    if (initial.images?.length) return initial.images
    if (initial.image) return [initial.image]
    return []
  })

  const valid = name.trim()

  const handleSave = () => {
    if (!valid) return
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

      <ImageUploader images={images} onChange={setImages} />

      <div className="flex gap-3 pt-1">
        <Btn onClick={handleSave} disabled={!valid} className="flex-1">
          {initial.id ? 'Зберегти' : 'Додати'}
        </Btn>
        <Btn variant="ghost" onClick={onClose} className="flex-1">Скасувати</Btn>
      </div>
    </Modal>
  )
}
