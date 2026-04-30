import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
} from 'drizzle-orm/sqlite-core';

// Таблица юзеров
export const users = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  password: text('password'),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
});

// Ваша таблица заказов
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  amount: real('amount'),
  status: text('status').default('pending'),
  items: text('items'),
  createdAt: text('createdAt'),
});

export const cartItems = sqliteTable(
  'cart_items',
  {
    userId: text('user_id').notNull(),
    productId: text('product_id').notNull(),
    quantity: integer('quantity').notNull().default(1),
  },
  // Используйте этот формат для extraConfig (составных ключей)
  (t) => [primaryKey({ columns: [t.userId, t.productId] })],
);

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  img: text('img'),
  description: text('description'),
});

export const verificationTokens = sqliteTable('verification_tokens', {
  identifier: text('identifier').primaryKey(), // это будет email
  token: text('token').notNull(), // сам код (например, 123456)
  expires: integer('expires', { mode: 'timestamp' }).notNull(),
});
