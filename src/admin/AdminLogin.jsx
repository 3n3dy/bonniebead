import { useState } from 'react'
import { useAdmin } from './AdminContext'

export default function AdminLogin() {
  const { login } = useAdmin()
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!login(pw)) {
      setError(true)
      setPw('')
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-6">
      <div className="w-full max-w-xs">
        <p className="font-display text-4xl text-cream-100 tracking-widest2 text-center mb-2">
          MAISON
        </p>
        <p className="text-center text-xs tracking-widest uppercase text-stone-500 mb-10">
          Адмін-панель
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={pw}
            onChange={e => { setPw(e.target.value); setError(false) }}
            placeholder="Пароль"
            autoFocus
            className={`w-full bg-stone-900 border ${error ? 'border-red-500' : 'border-stone-700'} text-cream-100 placeholder-stone-600 text-sm px-4 py-3 outline-none focus:border-blush transition-colors tracking-wide`}
          />
          {error && (
            <p className="text-red-400 text-xs tracking-wide">Невірний пароль</p>
          )}
          <button
            type="submit"
            className="w-full bg-cream-100 text-stone-950 text-xs tracking-widest uppercase font-medium py-3 hover:bg-cream-200 transition-colors"
          >
            Увійти
          </button>
        </form>
      </div>
    </div>
  )
}
