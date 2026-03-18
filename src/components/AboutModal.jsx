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
            Hanna
          </h2>
          <p className="font-display italic text-blush text-lg mt-1">
            BONNIEBEAD
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-8 space-y-5">

          <p className="font-sans text-sm text-stone-600 leading-relaxed">
            Моя історія: Від першого браслета до BonnieBead.
            </p>
            
          <p className="font-sans text-sm text-stone-600 leading-relaxed">
            Моя подорож у світ бісеру почалася з випадковості. Я побачила на чиємусь зап'ясті приголомшливий браслет-джгут і в ту ж мить відчула: я МОЖУ зробити такий сама. Мені було 23, я жила в Києві й тоді навіть не здогадувалася, що цей імпульс перетвориться на справу мого натхнення.
          </p>

          <p className="font-sans text-sm text-stone-600 leading-relaxed">
            Все почалося з того першого джгута, який я сплела для себе. Потім такий само захотіли сестри, згодом — колеги на роботі. Друзі почали приносити ідеї з інтернету, просячи створити щось унікальне саме для них. Не встигла я озирнутися, як моя квартира заповнилася коробками з бісером, нитками та фурнітурою, а вільного місця майже не залишилося!
          </p>

          <p className="font-sans text-sm text-stone-600 leading-relaxed">
            Так у 2019 році з’явився мій бренд BonnieBead. Кожен виріб, який я створюю, — це баланс між класикою та сучасністю, вишуканістю та лаконічністю. Для мене важливо, щоб прикраса була не просто аксесуаром, а маленькою історією.
          </p>

          <p className="font-sans text-sm text-stone-600 leading-relaxed">
            Особливе місце в моїй творчості посідає дитяча колекція. Вона народилася у 2020 році, коли я створила кулон-цуценя для маленької дівчинки, яка втратила улюбленця. Це надихнуло мене на цілу серію прикрас із тваринами, які тепер люблять і діти, і дорослі.
          </p>

          <p className="font-sans text-sm text-stone-600 leading-relaxed">
            Після невеликої перерви (2022-2024) я повертаюся до роботи з новими силами та сотнями ідей у блокноті. Я знову відкриваю свій магазин на Etsy, створюю сайт і готова ділитися з вами красою, яка захована в кожній дрібній деталі.
            Дякую, що ви зі мною в цій подорожі.
            З любов’ю, Б.Б.
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
