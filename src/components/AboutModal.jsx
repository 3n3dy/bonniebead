export default function AboutModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ background: 'rgba(10,10,8,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl bg-cream-100 overflow-y-auto max-h-[90vh]">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-950 transition-colors z-10 text-xl leading-none"
        >
          ✕
        </button>

        {/* Header strip */}
        <div className="bg-stone-950 px-8 pt-10 pb-8">
          <p className="text-xs tracking-widest2 uppercase text-stone-500 mb-3 font-sans">
            Про автора
          </p>
          <h2 className="font-display text-4xl font-medium text-cream-100">
            Ганна
          </h2>
          <p className="font-display italic text-blush text-lg mt-1">
            BONNIEBEAD
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-8 space-y-5">

          <p className="font-sans text-sm text-stone-600 leading-relaxed">
            Тут буде ваш текст про себе. Розкажіть, як все починалось, що вас надихає і чому ви займаєтесь прикрасами.
          </p>

          <p className="font-sans text-sm text-stone-600 leading-relaxed">
            Другий абзац — про ваш підхід до роботи, матеріали, які використовуєте, або що робить ваші прикраси особливими.
          </p>

          <p className="font-sans text-sm text-stone-600 leading-relaxed">
            Третій абзац — пропозиції для клієнтів, індивідуальні замовлення, співпраця.
          </p>

        </div>

        {/* Bottom */}
        <div className="px-8 pb-8">
          <div className="w-8 h-px bg-blush mb-6" />
          <button
            onClick={onClose}
            className="btn-outline px-8 py-2.5 text-xs tracking-widest uppercase"
          >
            Закрити
          </button>
        </div>

      </div>
    </div>
  )
}
