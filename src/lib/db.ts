import Database from 'better-sqlite3';
import path from 'path';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

const dbPath = path.resolve(process.cwd(), 'orders.db');
const sqlite = new Database(dbPath);

// Оставляем ваш старый код создания таблиц
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    amount REAL,
    status TEXT DEFAULT 'pending',
    items TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    user_id TEXT,
    product_id TEXT,
    quantity INTEGER,
    PRIMARY KEY (user_id, product_id)
  );
`);

// Экспортируем именно обертку Drizzle
export const db = drizzle(sqlite, { schema });
export default db;
