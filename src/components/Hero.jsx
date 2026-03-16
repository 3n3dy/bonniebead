export default function Hero() {
  return (
    <section className="max-w-screen-xl mx-auto px-6 md:px-12 pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="grid grid-cols-12 gap-4 items-end">
        {/* Big headline */}
        <div className="col-span-12 md:col-span-8">
          <p className="index-label mb-5">— Колекція 2026</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium leading-[1.05] tracking-tight text-stone-950">
            Прикраси,<br />
            <em className="font-normal italic">що лишаються</em><br />
            з вами.
          </h1>
        </div>

        {/* Side note */}
        <div className="col-span-12 md:col-span-4 md:text-right pb-2">
          <p className="font-sans text-sm text-stone-500 leading-relaxed max-w-xs md:ml-auto">
            Ювелірні вироби ручної роботи з дорогоцінних металів та каменів. Кожна прикраса — унікальна.
          </p>
        </div>
      </div>

      {/* Thin line with stats */}
      <div className="rule mt-12 mb-8" />
      <div className="flex flex-wrap gap-8 md:gap-16">
        {[
          ['9', 'Категорій'],
          ['400+', 'Виконаних індивідуальних замовлень'],
          ['AISI 316L/18К/24К', 'Проби металу'],
        ].map(([val, label]) => (
          <div key={label}>
            <p className="font-display text-xl font-medium text-stone-950">{val}</p>
            <p className="index-label mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
