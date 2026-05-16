import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './i18n.js'
import './index.css'

document.getElementById('seo-prerender')?.remove()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
)
