export const CATEGORIES = [
  {
    id: 'earrings',
    name: 'Сережки',
    nameLatin: 'Earrings',
    note: 'Класика та авангард',
    products: [
      { id: 'e1', name: 'Крапля з берилом', price: '3 200 ₴', material: 'Золото 585 · Берил', description: 'Витончені підвіски у формі краплі з натуральним бериловим каменем.' },
      { id: 'e2', name: 'Гвоздики Round', price: '1 650 ₴', material: 'Срібло 925 · CZ', description: 'Мінімалістичні гвоздики з кубічним цирконієм у закритій оправі.' },
      { id: 'e3', name: 'Hoops Classique', price: '2 100 ₴', material: 'Золото 585', description: 'Тонкі золоті кільця діаметром 20 мм. Вічна класика.' },
      { id: 'e4', name: 'Leaf Drop', price: '4 400 ₴', material: 'Золото 750 · Смарагд', description: 'Листоподібні підвіски з вставкою смарагду огранки marquise.' },
    ],
  },
  {
    id: 'rings',
    name: 'Каблучки',
    nameLatin: 'Rings',
    note: 'Символи та обіцянки',
    products: [
      { id: 'r1', name: 'Soleil Solitaire', price: '9 800 ₴', material: 'Золото 585 · Діамант', description: 'Класичний солітер з діамантом 0.20 ct. Ідеальна лінія оправи.' },
      { id: 'r2', name: 'Stack Thin', price: '1 200 ₴', material: 'Срібло 925', description: 'Тонке кільце для стекінгу. Носіть одне або три.' },
      { id: 'r3', name: 'Signet Oval', price: '5 500 ₴', material: 'Золото 585', description: 'Печатка з овальним щитком. Гравіювання на замовлення.' },
      { id: 'r4', name: 'Twisted Band', price: '3 300 ₴', material: 'Золото 585', description: 'Каблучка з плетінням "косичка". Текстурна поверхня.' },
    ],
  },
  {
    id: 'bracelets',
    name: 'Браслети',
    nameLatin: 'Bracelets',
    note: 'Акцент на зап\'ясті',
    products: [
      { id: 'b1', name: 'Tennis Classic', price: '14 500 ₴', material: 'Золото 585 · CZ', description: 'Тенісний браслет з 38 каменями у закритій оправі.' },
      { id: 'b2', name: 'Chain Figaro', price: '2 800 ₴', material: 'Срібло 925', description: 'Браслет плетіння "Фігаро", ширина 3 мм.' },
      { id: 'b3', name: 'Cuff Minimal', price: '3 700 ₴', material: 'Золото 585', description: 'Жорсткий браслет-манжета з матовою обробкою.' },
    ],
  },
  {
    id: 'children',
    name: 'Дитячі',
    nameLatin: 'Children',
    note: 'Для маленьких',
    products: [
      { id: 'ch1', name: 'Зірочка перша', price: '980 ₴', material: 'Золото 585', description: 'Перші сережки для дівчинки. Безпечний замок.' },
      { id: 'ch2', name: 'Bracelet Star', price: '820 ₴', material: 'Срібло 925 · Емаль', description: 'Дитячий браслет з яскравою кольоровою емаллю.' },
      { id: 'ch3', name: 'Підвіска Ангел', price: '1 100 ₴', material: 'Срібло 925', description: 'Ніжна підвіска-ангел на тонкому ланцюжку.' },
    ],
  },
  {
    id: 'pairs',
    name: 'Парні',
    nameLatin: 'Pairs',
    note: 'Двоє як одне',
    products: [
      { id: 'p1', name: 'Together Forever', price: '8 900 ₴', material: 'Золото 585', description: 'Пара обручок з відповідним гравіюванням і матчинг-текстурою.' },
      { id: 'p2', name: 'Half & Half', price: '3 200 ₴', material: 'Срібло 925', description: 'Два браслети, що разом утворюють єдиний орнамент.' },
    ],
  },
  {
    id: 'necklaces',
    name: 'Намисто',
    nameLatin: 'Necklaces',
    note: 'Рамка для декольте',
    products: [
      { id: 'n1', name: 'Choker Velvet', price: '1 900 ₴', material: 'Срібло 925 · Оксамит', description: 'Оксамитовий чокер зі срібною застібкою-каменем.' },
      { id: 'n2', name: 'Pearl Strand 40', price: '4 600 ₴', material: 'Натуральні перли · Золото', description: '40 см нитка натуральних перлів на золотій застібці.' },
      { id: 'n3', name: 'Layered Chain', price: '2 300 ₴', material: 'Золото 585', description: 'Три ланцюжки різної довжини в єдиному з\'єднанні.' },
    ],
  },
  {
    id: 'pendants',
    name: 'Підвіски',
    nameLatin: 'Pendants',
    note: 'Особиста деталь',
    products: [
      { id: 'pd1', name: 'Moon Phase', price: '1 350 ₴', material: 'Срібло 925', description: 'Підвіска у формі місяця з мікронасічкою.' },
      { id: 'pd2', name: 'Initial Letter', price: '2 100 ₴', material: 'Золото 585', description: 'Ваша літера у класичному скрипті. Персоналізація безкоштовно.' },
      { id: 'pd3', name: 'Evil Eye', price: '1 700 ₴', material: 'Золото 585 · Емаль', description: 'Синє "Наззар боньюзу" в оправі з жовтого золота.' },
    ],
  },
  {
    id: 'brooches',
    name: 'Броші',
    nameLatin: 'Brooches',
    note: 'Акцент образу',
    products: [
      { id: 'br1', name: 'Botanica Leaf', price: '2 600 ₴', material: 'Золото 585 · Цирконій', description: 'Гілочка з листям та дрібними кристалами. Живий об\'єм.' },
      { id: 'br2', name: 'Bow Classic', price: '1 800 ₴', material: 'Срібло 925', description: 'Срібний бант — вічний та доречний.' },
    ],
  },
  {
    id: 'accessories',
    name: 'Аксесуари',
    nameLatin: 'Accessories',
    note: 'Шпильки · Анклети · Чармси',
    products: [
      { id: 'a1', name: 'Anklet Dainty', price: '1 400 ₴', material: 'Золото 585', description: 'Тонкий анклет з підвіскою-зіркою. Для літа та не тільки.' },
      { id: 'a2', name: 'Hair Pin Set', price: '680 ₴', material: 'Срібло 925', description: 'Набір з 3 шпильок з кристалами різного розміру.' },
      { id: 'a3', name: 'Charm Horseshoe', price: '750 ₴', material: 'Золото 585', description: 'Підкова на щастя — мініатюрний шарм для браслету або ланцюжка.' },
    ],
  },
]
