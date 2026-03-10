const CONTACTS = {
  phone: '+38 (095) 057-16-49',
  email: 'bonniebead@gmail.com',
  instagram: '@bonniebead',
  address: 'Уся Україна',
  hours: 'Пн–Сб, 10:00–19:00',
}

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-cream-200 mt-0">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 pt-16 pb-10">
        {/* Top */}
        <div className="grid grid-cols-1 text-gray-800 md:grid-cols-3 gap-10 md:gap-16 pb-12">
          {/* Brand */}
          <div>
            <p className="font-display text-4xl font-medium tracking-widest2 text-cream-100 mb-4">
              BONNIEBEAD
            </p>
            <p className="font-sans text-sm text-stone-400 leading-relaxed max-w-xs">
              Ексклюзивні прикраси з бісеру тадорогоцінних металів. Ручна робота. Уся Україна.
            </p>
          </div>

          {/* Contacts */}
          <div>
            <p className="text-xs tracking-widest2 uppercase text-stone-500 mb-5 font-sans">Контакти</p>
            <ul className="space-y-3 text-sm text-stone-300">
              <li>{CONTACTS.phone}</li>
              <li>{CONTACTS.email}</li>
              <li>{CONTACTS.address}</li>
              <li className="text-stone-500 text-xs">{CONTACTS.hours}</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-xs tracking-widest2 uppercase text-stone-500 mb-5 font-sans">Соціальні мережі</p>
            <p className="text-sm text-stone-300">{CONTACTS.instagram}</p>
            <div className="rule w-12 mt-6 mb-2" style={{ background: '#C4A882' }} />
            <p className="font-sans text-xs text-stone-600 leading-relaxed">
              Слідкуйте за новими надходженнями та закулісним виготовленням.
            </p>
          </div>
        </div>

        {/* Bottom rule + copyright */}
        <div className="border-t border-stone-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="index-label text-stone-600">© 2026 BONNIEBEAD · Всі права захищено</p>
          <p className="font-display italic text-stone-400 text-sm">Зроблено з увагою до деталей</p>
        </div>
      </div>
    </footer>
  )
}
