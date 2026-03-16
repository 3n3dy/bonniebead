import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useCart } from './CartContext'
import { useUser } from '../user/UserContext'

// ─── EmailJS — замініть на свої ключі ──────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'service_s0iormm'
const EMAILJS_TEMPLATE_ID = 'template_oyp97fl'
const EMAILJS_PUBLIC_KEY  = 'uLfQX6hFuI8kCtoZw'
// ──────────────────────────────────────────────────────────────────────────

async function sendEmail(params) {
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: params,
    }),
  })
  if (!res.ok) throw new Error('EmailJS: ' + res.status)
}

export default function CheckoutModal({ onClose }) {
  const { items, clear } = useCart()
  const { profile } = useUser()
  const [name, setName]   = useState(profile?.name  || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [email, setEmail] = useState(profile?.email || '')
  const [note, setNote]   = useState('')
  const [status, setStatus] = useState('idle')

  const valid = name.trim() && phone.trim() && email.trim()

  const handleSubmit = async () => {
    if (!valid) return
    setStatus('sending')
    const orderList = items.map(({ product, catName, qty }) =>
      `• ${product.name} (${catName}) x${qty}${product.price ? ' — ' + product.price : ''}`
    ).join('\n')
    try {
      await sendEmail({
        to_name: 'Ганна',
        from_name: name.trim(),
        from_phone: phone.trim(),
        from_email: email.trim(),
        note: note.trim() || '—',
        order_list: orderList,
        order_count: items.reduce((s, i) => s + i.qty, 0),
        sent_at: new Date().toLocaleString('uk'),
      })
      setStatus('success')
      clear()
    } catch {
      setStatus('error')
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,10,8,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && status !== 'sending' && onClose()}
    >
      <div className="w-full max-w-2xl bg-cream-100 overflow-y-auto max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-cream-300 flex-shrink-0">
          <p className="text-xs tracking-widest2 uppercase font-sans text-stone-500">Оформлення замовлення</p>
          {status !== 'sending' && (
            <button onClick={onClose} className="text-stone-400 hover:text-stone-950 transition-colors text-xl w-7 h-7 flex items-center justify-center">✕</button>
          )}
        </div>

        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-20 px-7 text-center flex-1">
            <div className="w-12 h-12 border border-stone-300 rounded-full flex items-center justify-center mb-6 text-xl">✓</div>
            <h3 className="font-display text-3xl font-medium text-stone-950 mb-3">Дякуємо!</h3>
            <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
              Ваше замовлення надіслано. Ганна зв'яжеться з вами найближчим часом.
            </p>
            <button onClick={onClose} className="btn-dark mt-8 px-8 py-3">Закрити</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] flex-1 min-h-0">

            {/* Список товарів */}
            <div className="border-b md:border-b-0 md:border-r border-cream-300 p-6 overflow-y-auto">
              <p className="text-xs tracking-widest2 uppercase text-stone-400 mb-4 font-sans">
                Ваш вибір · {items.reduce((s, i) => s + i.qty, 0)} од.
              </p>
              <div className="space-y-4">
                {items.map(({ product, catName, qty }) => {
                  const img = product.images?.[0] || product.image || ''
                  return (
                    <div key={product.id} className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-cream-300 flex-shrink-0 overflow-hidden">
                        {img
                          ? <img src={img} alt={product.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">фото</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-stone-800 truncate">{product.name}</p>
                        <p className="text-xs text-stone-400 truncate">{catName}</p>
                        <p className="text-xs text-stone-500">x{qty}{product.price ? ' · ' + product.price : ''}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Форма */}
            <div className="p-6 flex flex-col">
              <p className="text-xs tracking-widest2 uppercase text-stone-400 mb-5 font-sans">Ваші дані</p>
              <div className="space-y-4 flex-1">
                {[
                  { label: "Ім'я та прізвище *", val: name, set: setName, placeholder: "Марія Іваненко" },
                  { label: "Телефон *", val: phone, set: setPhone, placeholder: "+38 (050) 000-00-00", type: "tel" },
                  { label: "Email *", val: email, set: setEmail, placeholder: "maria@email.com", type: "email" },
                ].map(({ label, val, set, placeholder, type = 'text' }) => (
                  <div key={label}>
                    <label className="block text-xs tracking-widest uppercase text-stone-400 mb-1.5">{label}</label>
                    <input
                      type={type} value={val} onChange={e => set(e.target.value)} placeholder={placeholder}
                      className="w-full bg-cream-200 border border-cream-300 focus:border-stone-400 text-stone-800 placeholder-stone-400 text-sm px-3 py-2.5 outline-none transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs tracking-widest uppercase text-stone-400 mb-1.5">Коментар</label>
                  <textarea
                    value={note} onChange={e => setNote(e.target.value)}
                    placeholder="Побажання до замовлення..." rows={3}
                    className="w-full bg-cream-200 border border-cream-300 focus:border-stone-400 text-stone-800 placeholder-stone-400 text-sm px-3 py-2.5 outline-none transition-colors resize-none"
                  />
                </div>
              </div>
              {status === 'error' && (
                <p className="text-xs text-red-500 mt-3">Помилка відправки. Спробуйте ще раз або напишіть напряму на email.</p>
              )}
              <button
                onClick={handleSubmit} disabled={!valid || status === 'sending'}
                className="btn-dark mt-5 w-full py-3 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'sending' ? (
                  <><span className="w-3 h-3 border border-cream-400 border-t-transparent rounded-full animate-spin" />Відправляємо...</>
                ) : 'Підтвердити замовлення'}
              </button>
              <p className="text-xs text-stone-400 mt-3 text-center leading-relaxed">
                Після підтвердження Ганна зв'яжеться з вами для уточнення деталей
              </p>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
