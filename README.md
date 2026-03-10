# MAISON · Ювелірний каталог

Editorial-мінімалізм. Кремовий фон, темна типографіка, чисті лінії.

## Запуск
```bash
npm install
npm run dev
```

## Що редагувати

| Що змінити | Файл |
|---|---|
| Назва сайту | `src/components/Header.jsx` → `MAISON` |
| Категорії та товари | `src/data/catalog.js` |
| Контакти, адреса | `src/components/Footer.jsx` → `CONTACTS` |
| Слоган на головній | `src/components/Hero.jsx` |
| Кольори | `tailwind.config.js` + `src/index.css` |
| Шрифти | `index.html` (Google Fonts) + `tailwind.config.js` |

## Додати товар
У `src/data/catalog.js` знайди потрібну категорію і додай об'єкт:
```js
{ id: 'новий_id', name: 'Назва', price: '1 000 ₴', material: 'Золото 585', description: '...', image: 'https://...' }
```

## Додати категорію
Додай новий об'єкт у масив `CATEGORIES` у `src/data/catalog.js`:
```js
{
  id: 'unique_id',
  name: 'Назва укр',
  nameLatin: 'Name EN',
  note: 'Підзаголовок',
  products: [],
}
```
# bbtest
