import { useTranslation } from 'react-i18next'
import MarqueeBanner from './MarqueeBanner'

export default function Hero() {
  const { t } = useTranslation()

  return (
    <>
      {/* Бігучий рядок */}
      <MarqueeBanner />

      <section className="max-w-screen-xl mx-auto px-6 md:px-12 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid grid-cols-12 gap-4 items-end">
          <div className="col-span-12 md:col-span-8">
            <a
              href="#catalog"
              onClick={e => { e.preventDefault(); document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="index-label mb-5 cursor-pointer hover:text-stone-700 transition-colors inline-block"
            >
              {t('hero.collection')}
            </a>
            <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] tracking-tight text-stone-950">
              <span className="font-normal">{t('hero.title_1')}</span><br />

              <span className="sparkle-text font-normal italic inline-block">
                {t('hero.title_2')}
              </span>

              <br />
              <span className="font-normal">{t('hero.title_3')}</span>
            </h1>


          </div>
          <div className="col-span-12 md:col-span-4 md:text-right pb-2">
            <p className="font-serif text-sm text-stone-500 leading-relaxed max-w-xs md:ml-auto">
              {t('hero.description')}
            </p>
          </div>
        </div>

        <div className="rule mt-12 mb-8" />
        <div className="flex flex-wrap gap-8 md:gap-16">
          {[
            ['400+', t('hero.stat_orders')],
            ['AISI 316L/18К/24К', t('hero.stat_metal')],
          ].map(([val, label]) => (
            <div key={label}>
              <p className="font-arvo text-xl font-medium text-stone-950">{val}</p>
              <p className="index-label mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
