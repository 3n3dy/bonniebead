import { useTranslation } from 'react-i18next'

const CONTACTS = {
  email: 'bonniebeadshop@gmail.com',
  instagram: 'https://www.instagram.com/bonniebead/',
  facebook: 'https://www.facebook.com/bonniebeadshop',
  etsy: 'https://www.etsy.com/shop/hannabonniebead/',
}

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-stone-950 text-cream-200 mt-0">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-10 md:gap-8 pb-12 items-start">
          <div className="md:pr-16">
            <p className="font-display text-4xl font-medium tracking-widest2 text-cream-100 mb-1">HANNA</p>
            <p className="font-display text-lg tracking-widest2 text-blush mb-6">BONNIEBEAD</p>
            <div className="w-8 h-px bg-blush mb-6" />
            <p className="font-sans text-sm text-stone-400 leading-relaxed max-w-md">{t('footer.tagline')}</p>
          </div>

          <div className="md:border-l md:border-stone-800 md:pl-10">
            <p className="text-xs tracking-widest2 uppercase text-stone-500 mb-6 font-sans">{t('footer.contact')}</p>
            <div className="space-y-6 text-sm text-stone-300">
              <div>
                <span className="block text-xs uppercase tracking-widest2 text-stone-500 mb-1.5">Email</span>
                <a href={`mailto:${CONTACTS.email}`} className="hover:text-cream-100 underline-offset-4 hover:underline transition-colors break-all">
                  {CONTACTS.email}
                </a>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-widest2 text-stone-500 mb-2">{t('footer.social')}</span>
                <ul className="space-y-2">
                  {[
                    { label: 'Instagram', href: CONTACTS.instagram },
                    { label: 'Facebook',  href: CONTACTS.facebook },
                    { label: 'Etsy',      href: CONTACTS.etsy },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <a href={href} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 text-stone-300 hover:text-cream-100 transition-colors group">
                        <span className="w-3 h-px bg-stone-700 group-hover:bg-blush group-hover:w-5 transition-all duration-300" />
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
<div className="border-t border-stone-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
  <p className="index-label text-stone-600">{t('footer.copyright')}</p>
  <a
    href="https://w3bedy.com"
    target="_blank"
    rel="noreferrer"
    className="index-label text-stone-700 hover:text-stone-500 transition-colors">
    Розробка - w3bedy.com
  </a>
  <p className="font-display italic text-stone-700 text-sm">{t('footer.made_with')}</p>
</div>
      </div>
    </footer>
  )
}
