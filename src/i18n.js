import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import uk from './locales/uk.json'
import en from './locales/en.json'

// Визначаємо мову з URL: /en/* → англійська, все інше → українська
const getLangFromURL = () => {
  return window.location.pathname.startsWith('/en') ? 'en' : 'uk'
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      uk: { translation: uk },
      en: { translation: en },
    },
    lng: getLangFromURL(),
    fallbackLng: 'uk',
    interpolation: { escapeValue: false },
  })

export default i18n
