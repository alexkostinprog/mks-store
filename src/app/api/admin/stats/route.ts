import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { orders } from '@/lib/schema';
import { sql, eq, and, desc } from 'drizzle-orm';

export async function GET() {
  const session = await auth();

  // Используем переменную из .env
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  // 1. Общая выручка
  const [totalRevenue] = await db
    .select({
      total: sql<number>`SUM(amount)`,
    })
    .from(orders)
    .where(eq(orders.status, 'paid'));

  // 2. Продажи по дням (последние 7 дней)
  const salesHistory = await db
    .select({
      date: sql`date(created_at)`, // проверь имя колонки в схеме (createdAt или created_at)
      count: sql<number>`COUNT(*)`,
      sum: sql<number>`SUM(amount)`,
    })
    .from(orders)
    .where(eq(orders.status, 'paid'))
    .groupBy(sql`date(created_at)`)
    .orderBy(sql`date(created_at) DESC`)
    .limit(7);

  // 3. Самые продаваемые товары (парсинг JSON)
  const allPaidOrders = await db
    .select({ items: orders.items })
    .from(orders)
    .where(eq(orders.status, 'paid'));

  const productStats: Record<string, number> = {};

  allPaidOrders.forEach((order) => {
    try {
      const items =
        typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      if (Array.isArray(items)) {
        items.forEach((item: any) => {
          productStats[item.id] = (productStats[item.id] || 0) + item.quantity;
        });
      }
    } catch (e) {
      console.error('Ошибка парсинга items:', e);
    }
  });

  return NextResponse.json({
    total: totalRevenue?.total || 0,
    history: salesHistory,
    products: productStats,
  });
}
