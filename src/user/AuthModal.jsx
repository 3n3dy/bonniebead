import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useUser } from './UserContext'

export default function AuthModal({ onClose }) {
  const { login } = useUser()
  const [name,  setName]  = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const valid = name.trim() && (phone.trim() || email.trim())

  const handleSubmit = () => {
    if (!valid) { setError("Введіть ім'я та хоча б один контакт"); return }
    login({ name, phone, email })
    onClose()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,10,8,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-cream-100" style={{ animation: 'fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both' }}>
        <div className="bg-stone-950 px-7 py-6">
          <p className="text-xs tracking-widest2 uppercase text-stone-500 font-sans mb-1">Особистий кабінет</p>
          <h2 className="font-display text-2xl font-medium text-cream-100">Увійти / Зареєструватись</h2>
        </div>

        <div className="px-7 py-6 space-y-4">
          <p className="text-xs text-stone-400 leading-relaxed">
            Збережіть свої дані, щоб не вводити їх щоразу. Дані зберігаються лише у вашому браузері.
          </p>

          {[
            { label: "Ім'я *", val: name, set: setName, placeholder: "Марія Іваненко" },
            { label: "Телефон", val: phone, set: setPhone, placeholder: "+38 (050) 000-00-00", type: "tel" },
            { label: "Email",   val: email, set: setEmail, placeholder: "maria@email.com", type: "email" },
          ].map(({ label, val, set, placeholder, type = 'text' }) => (
            <div key={label}>
              <label className="block text-xs tracking-widest uppercase text-stone-400 mb-1.5">{label}</label>
              <input
                type={type} value={val}
                onChange={e => { set(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder={placeholder}
                className="w-full bg-cream-200 border border-cream-300 focus:border-stone-400 text-stone-800 placeholder-stone-400 text-sm px-3 py-2.5 outline-none transition-colors"
              />
            </div>
          ))}

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button onClick={handleSubmit} disabled={!valid} className="btn-dark w-full py-3 mt-2 disabled:opacity-40">
            Зберегти і увійти
          </button>
          <button onClick={onClose} className="w-full text-xs text-stone-400 hover:text-stone-700 transition-colors py-1">
            Пропустити
          </button>
        </div>
      </div>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>,
    document.body
  )
}
