import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/schema';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    // Проверка на админа (замени на свою почту)
    if (session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return NextResponse.json({ message: 'Нет доступа' }, { status: 403 });
    }

    const body = await req.json();
    const { name, price, img, description } = body;

    const newProduct = await db
      .insert(products)
      .values({
        id: uuidv4(),
        name,
        price: Number(price),
        img,
        description: description || '',
      })
      .returning();

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
