import { db } from './src/lib/db';
import { orders } from './src/lib/schema';
import { eq } from 'drizzle-orm';

async function forcePay() {
  const id = 'b8b871ee-5ddb-4d87-a0e4-06e6ad673c4a';
  await db.update(orders).set({ status: 'paid' }).where(eq(orders.id, id));
  console.log('✅ Статус обновлен на paid');
}

forcePay();
