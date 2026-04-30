import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    // 1. Правильно достаем orderId из URL
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { message: 'ID заказа не указан' },
        { status: 400 },
      );
    }

    // 2. Ищем заказ в базе
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    if (!order) {
      return NextResponse.json({ message: 'Заказ не найден' }, { status: 404 });
    }

    // 3. Возвращаем статус
    return NextResponse.json({
      status: order.status, // 'pending', 'paid' и т.д.
      amount: order.amount,
    });
  } catch (error) {
    console.error('Ошибка проверки статуса:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}
