import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = await req.json();

    await db.delete(products).where(eq(products.id, id));

    return NextResponse.json({ message: 'Deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
