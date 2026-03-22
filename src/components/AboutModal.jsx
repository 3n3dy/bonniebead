import { useTranslation } from 'react-i18next'

export default function AboutModal({ onClose }) {
  const { t } = useTranslation()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ background: 'rgba(10,10,8,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl bg-cream-100 overflow-y-auto max-h-[90vh]">

        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-950 transition-colors z-10 text-xl leading-none"
        >
          ✕
        </button>

        <div className="bg-stone-950 px-8 pt-10 pb-8">
          <p className="text-xs tracking-widest2 uppercase text-stone-500 mb-3 font-sans">
            {t('about.label')}
          </p>
          <h2 className="font-display text-4xl font-medium text-cream-100">Hanna</h2>
          <p className="font-display italic text-blush text-lg mt-1">BONNIEBEAD</p>
        </div>

        <div className="px-8 py-8 space-y-5">
          {['p1','p2','p3','p4','p5','p6'].map(key => (
            <p key={key} className="font-sans text-sm text-stone-600 leading-relaxed">
              {t(`about.${key}`)}
            </p>
          ))}
        </div>

        <div className="px-8 pb-8">
          <div className="w-8 h-px bg-blush mb-6" />
          <button onClick={onClose} className="btn-outline px-8 py-2.5 text-xs tracking-widest uppercase">
            {t('about.close')}
          </button>
        </div>

      </div>
    </div>
  )
}
