import { db } from './db'; // Прямая ссылка на db.ts в этой же папке
import { products } from './schema'; // Ссылка на схему в подпапке d

const PRODUCTS = [
  {
    id: '1',
    name: 'Самая первая песня',
    price: 5000,
    img: '/tsoy.webp',
    description: 'Легендарный хит в цифровом качестве.',
  },
  {
    id: '2',
    name: 'Вторая песня',
    price: 7500,
    img: '/man.jpg',
    description: 'Эксклюзивная аранжировка.',
  },
  {
    id: '3',
    name: 'Третья песня',
    price: 4200,
    img: '/person.jpg',
    description: 'Студийная запись 2024 года.',
  },
  {
    id: '4',
    name: 'Песня номер 4',
    price: 3000,
    img: '/cat.jpeg',
    description: 'Бонус-трек для истинных фанатов.',
  },
];

async function seed() {
  console.log('Загрузка товаров в БД...');
  for (const p of PRODUCTS) {
    await db
      .insert(products)
      .values(p)
      .onConflictDoUpdate({
        target: products.id,
        set: {
          name: p.name,
          price: p.price,
          img: p.img,
          description: p.description,
        },
      });
  }
  console.log('Готово!');
}

seed();
