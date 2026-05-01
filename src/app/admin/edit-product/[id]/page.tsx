import { db } from '@/lib/db';
import { products } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import EditProductForm from '@/components/admin/EditProductForm';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function EditPage({ params }: { params: { id: string } }) {
  const session = await auth();
  // 1. "Распаковываем" параметры
  const { id } = await params;
  if (session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL)
    redirect('/');

  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (!product) redirect('/admin');

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 relative overflow-hidden font-sans">
      {/* Glow пятна */}
      <div className="absolute top-1/4 -left-20 w-150 h-150 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-2xl mx-auto relative z-10">
        <Link
          href={`/products/${id}`}
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />{' '}
          Назад к товару
        </Link>
        <h1 className="text-4xl font-black tracking-tighter mb-10">
          Редактировать <span className="text-indigo-500">трек</span>
        </h1>
        <EditProductForm product={product} />
      </div>
    </div>
  );
}
