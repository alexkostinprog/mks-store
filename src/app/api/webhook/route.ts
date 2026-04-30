import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { eq } from 'drizzle-orm';
import { orders, cartItems } from '@/lib/schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ЮKassa присылает событие payment.succeeded, когда деньги списаны
    if (body.event === 'payment.succeeded') {
      const payment = body.object;

      // Достаем orderId, который мы сохранили в metadata при создании платежа
      const orderId = payment.metadata?.orderId;

      if (orderId) {
        console.log(`✅ Платеж получен для заказа: ${orderId}`);

        // 1. Обновляем статус заказа
        await db
          .update(orders)
          .set({ status: 'paid' })
          .where(eq(orders.id, orderId));

        // 2. Очищаем корзину пользователя
        // Предполагается, что у вас есть объект order с полем userId
        await db.delete(cartItems).where(eq(cartItems.userId, orderId)); //фигня тут
      }
    }

    // Всегда отвечаем 200 OK, чтобы ЮKassa не слала уведомление повторно
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook Error:', error);
    // Даже при ошибке лучше отвечать 200, чтобы не зацикливать банк
    return NextResponse.json({ message: 'Error' }, { status: 200 });
  }
}
