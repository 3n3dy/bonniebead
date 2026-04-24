import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function LangSwitcher({ mobile = false }) {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const current = i18n.language

  const switchLang = (lang) => {
    i18n.changeLanguage(lang)
    const path = location.pathname

    if (lang === 'en') {
      // uk → en: додаємо /en prefix
      if (!path.startsWith('/en')) {
        navigate('/en' + (path === '/' ? '' : path))
      }
    } else {
      // en → uk: прибираємо /en prefix
      if (path.startsWith('/en')) {
        navigate(path.replace('/en', '') || '/')
      }
    }
  }

  const btn = (lang) => (
    <button
      key={lang}
      onClick={() => switchLang(lang)}
      className={`px-2.5 py-1 text-xs tracking-widest uppercase font-display transition-colors ${
        current === lang
          ? 'bg-stone-950 text-cream-100'
          : 'text-stone-500 hover:text-stone-950'
      }`}
    >
      {lang.toUpperCase()}
    </button>
  )

  return (
    <div className={`flex items-center overflow-hidden ${mobile ? 'border border-cream-300' : 'border border-stone-200'}`}>
      {btn('uk')}
      {btn('en')}
    </div>
  )
}
