// Просте поле вводу
export function Field({ label, value, onChange, placeholder, type = 'text', multiline = false }) {
  const cls = `w-full bg-stone-900 border border-stone-700 focus:border-blush text-cream-100 placeholder-stone-600 text-sm px-3 py-2.5 outline-none transition-colors resize-none`
  return (
    <div>
      <label className="block text-xs tracking-widest uppercase text-stone-500 mb-1.5">{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className={cls} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      }
    </div>
  )
}

// Кнопка — основна
export function Btn({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }) {
  const base = 'text-xs tracking-widest uppercase font-medium px-5 py-2.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-cream-100 text-stone-950 hover:bg-cream-200',
    ghost:   'border border-stone-600 text-stone-300 hover:border-stone-400 hover:text-cream-100',
    danger:  'border border-red-800 text-red-400 hover:bg-red-900/30',
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

// Модальне вікно
export function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,10,8,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-stone-950 border border-stone-800 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
          <p className="text-sm tracking-widest uppercase text-cream-200">{title}</p>
          <button onClick={onClose} className="text-stone-500 hover:text-cream-100 transition-colors text-lg leading-none">×</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {children}
        </div>
      </div>
    </div>
  )
}

// Підтвердження видалення
export function ConfirmModal({ text, onConfirm, onClose }) {
  return (
    <Modal title="Підтвердження" onClose={onClose}>
      <p className="text-sm text-stone-400 leading-relaxed">{text}</p>
      <div className="flex gap-3 pt-2">
        <Btn variant="danger" onClick={onConfirm} className="flex-1">Видалити</Btn>
        <Btn variant="ghost" onClick={onClose} className="flex-1">Скасувати</Btn>
      </div>
    </Modal>
  )
}
