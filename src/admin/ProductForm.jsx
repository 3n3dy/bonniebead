import { useState } from 'react'
import { Modal, Field, Btn } from './AdminUI'

export default function ProductForm({ initial = {}, onSave, onClose }) {
  const [name, setName]               = useState(initial.name || '')
  const [price, setPrice]             = useState(initial.price || '')
  const [material, setMaterial]       = useState(initial.material || '')
  const [description, setDescription] = useState(initial.description || '')
  const [image, setImage]             = useState(initial.image || '')

  const valid = name.trim()

  const handleSave = () => {
    if (!valid) return
    onSave({ name: name.trim(), price: price.trim(), material: material.trim(), description: description.trim(), image: image.trim() })
    onClose()
  }

  return (
    <Modal title={initial.id ? 'Редагувати товар' : 'Новий товар'} onClose={onClose}>
      <Field label="Назва *" value={name} onChange={setName} placeholder="Золоті кульчики" />

      <div className="grid grid-cols-2 gap-3">
        <Field label="Ціна" value={price} onChange={setPrice} placeholder="2 400 ₴" />
        <Field label="Матеріал" value={material} onChange={setMaterial} placeholder="Золото 585" />
      </div>

      <Field label="Опис" value={description} onChange={setDescription} placeholder="Короткий опис товару..." multiline />

      <div>
        <Field label="URL фото" value={image} onChange={setImage} placeholder="https://..." />
        {image && (
          <div className="mt-2 w-16 h-16 border border-stone-700 overflow-hidden">
            <img
              src={image} alt=""
              className="w-full h-full object-cover"
              onError={e => e.target.style.opacity = '0.2'}
            />
          </div>
        )}
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
