import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/schema.ts', // путь к твоей схеме
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'orders.db', // имя твоего файла базы
  },
});
