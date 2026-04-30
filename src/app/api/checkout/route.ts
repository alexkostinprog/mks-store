import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, products } from '@/lib/schema';
import { v4 as uuidv4 } from 'uuid';
import { inArray } from 'drizzle-orm';
import { auth } from '@/auth';

const YooKassa = require('yookassa');
const YooCheckoutClass = YooKassa.YooCheckout || YooKassa;

const checkout = new YooCheckoutClass({
  shopId: process.env.SHOP_ID || '',
  secretKey: process.env.SHOP_KEY || '',
});

export async function POST(req: Request) {
  const session = await auth();
  try {
    // Принимаем items и email (от гостя)
    const { items, email } = await req.json();
    const orderId = uuidv4();

    // 1. Получаем актуальные цены из БД (защита от подмены цены на клиенте)
    const productIds = items.map((item: any) => item.id);
    const dbProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));

    // 2. Считаем итоговую сумму
    const totalAmount = items.reduce((sum: number, item: any) => {
      const product = dbProducts.find((p) => p.id === item.id);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    if (totalAmount <= 0) {
      return NextResponse.json(
        { message: 'Неверная сумма заказа' },
        { status: 400 },
      );
    }

    // 3. Сохраняем заказ в SQLite через Drizzle
    // Убедись, что в схеме orders есть поле для email, либо используй userId
    await db.insert(orders).values({
      id: orderId,
      amount: totalAmount,
      items: JSON.stringify(items),
      status: 'pending',
      createdAt: new Date().toISOString(),
      userId: session?.user?.id || email || 'guest', // Приоритет ID пользователя
    });

    // 4. Создаем платеж в ЮKassa
    const payment = await checkout.createPayment(
      {
        amount: {
          value: totalAmount.toFixed(2),
          currency: 'RUB',
        },
        confirmation: {
          type: 'redirect',
          return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success?orderId=${orderId}`,
        },
        description: `Оплата заказа №${orderId}`,
        metadata: { orderId, email },
        capture: true,
      },
      uuidv4(), // Ключ идемпотентности
    );

    return NextResponse.json({
      url: payment.confirmation.confirmation_url,
      orderId,
    });
  } catch (error: any) {
    console.error('Checkout Error:', error);
    return NextResponse.json(
      { message: error.message || 'Ошибка сервера' },
      { status: 500 },
    );
  }
}
