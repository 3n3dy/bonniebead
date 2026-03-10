import { useState } from 'react'
import { Modal, Field, Btn } from './AdminUI'

export default function CategoryForm({ initial = {}, onSave, onClose }) {
  const [name, setName]             = useState(initial.name || '')
  const [nameLatin, setNameLatin]   = useState(initial.nameLatin || '')
  const [note, setNote]             = useState(initial.note || '')

  const valid = name.trim()

  const handleSave = () => {
    if (!valid) return
    onSave({ name: name.trim(), nameLatin: nameLatin.trim(), note: note.trim() })
    onClose()
  }

  return (
    <Modal title={initial.id ? 'Редагувати категорію' : 'Нова категорія'} onClose={onClose}>
      <Field label="Назва (укр) *" value={name} onChange={setName} placeholder="Сережки" />
      <Field label="Назва (англ)" value={nameLatin} onChange={setNameLatin} placeholder="Earrings" />
      <Field label="Підзаголовок" value={note} onChange={setNote} placeholder="Класика та авангард" />
      <div className="flex gap-3 pt-1">
        <Btn onClick={handleSave} disabled={!valid} className="flex-1">
          {initial.id ? 'Зберегти' : 'Створити'}
        </Btn>
        <Btn variant="ghost" onClick={onClose} className="flex-1">Скасувати</Btn>
      </div>
    </Modal>
  )
}
