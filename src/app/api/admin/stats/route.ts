import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import db from '@/lib/db';

export async function GET() {
  const session = await auth();
  // Простая защита: проверяем email
  if (session?.user?.email !== 'your-admin-email@test.com') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  // 1. Общая выручка (только оплаченные)
  const totalRevenue = db
    .prepare("SELECT SUM(amount) as total FROM orders WHERE status = 'paid'")
    .get() as any;

  // 2. Количество продаж по дням (последние 7 дней)
  const salesHistory = db
    .prepare(
      `
    SELECT date(createdAt) as date, COUNT(*) as count, SUM(amount) as sum
    FROM orders 
    WHERE status = 'paid'
    GROUP BY date(createdAt)
    ORDER BY date DESC LIMIT 7
  `,
    )
    .all();

  // 3. Самые продаваемые товары
  // (Тут нужно парсить JSON из колонки items, сделаем упрощенно)
  const allOrders = db
    .prepare("SELECT items FROM orders WHERE status = 'paid'")
    .all() as any[];
  const productStats: Record<string, number> = {};

  allOrders.forEach((order) => {
    const items = JSON.parse(order.items);
    items.forEach((item: any) => {
      productStats[item.id] = (productStats[item.id] || 0) + item.quantity;
    });
  });

  return NextResponse.json({
    total: totalRevenue?.total || 0,
    history: salesHistory,
    products: productStats,
  });
}
