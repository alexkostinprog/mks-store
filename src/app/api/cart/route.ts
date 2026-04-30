// src/app/api/cart/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { cartItems } from '@/lib/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json([]);

  const items = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.userId, session.user.id));

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { productId, delta } = await req.json();

  // Реализация UPSERT
  await db
    .insert(cartItems)
    .values({
      userId: session.user.id,
      productId: productId,
      quantity: delta,
    })
    .onConflictDoUpdate({
      target: [cartItems.userId, cartItems.productId],
      set: {
        quantity: sql`MAX(0, ${cartItems.quantity} + ${delta})`,
      },
    });

  // Удаляем товары с нулевым количеством
  await db.delete(cartItems).where(sql`${cartItems.quantity} <= 0`);

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ status: 401 });

  await db.delete(cartItems).where(eq(cartItems.userId, session.user.id));
  return NextResponse.json({ success: true });
}
