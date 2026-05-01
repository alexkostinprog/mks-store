import Navbar from '@/components/Navbar';
import { db } from '@/lib/db';
import { products } from '@/lib/schema'; // замените на вашу таблицу товаров, если она есть
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';
import { Music, Pencil } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/auth';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Добавляем await для получения id
  const { id } = await params;

  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (!product) notFound();

  const session = await auth();
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return (
    <div className="min-h-screen min-w-110 group backdrop-blur-md overflow-hidden shadow-xl bg-indigo-900/60 transition-all duration-300">
      <Navbar />

      <main className="max-w-4xl mx-auto py-20 px-6">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12">
          {/* Левая колонка: Изображение */}
          <div className="relative group flex items-start justify-center">
            {/* Фоновое свечение за картинкой (Glow) */}
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" />

            {/* Основной контейнер картинки */}
            <div className="relative w-full aspect-square max-w-[450px] rounded-[2.5rem] overflow-hidden border border-zinc-800 shadow-2xl">
              <img
                src={product.img || ''}
                alt={product.name}
                className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-700"
              />

              {/* Значок мелодии в углу (как водяной знак) */}
              <div className="absolute top-6 right-6 w-12 h-12 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center text-white/70 shadow-xl transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <Music size={24} strokeWidth={1.5} />
              </div>

              {/* Градиентное наложение снизу для глубины */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-60" />
            </div>
          </div>

          <div className="space-y-6">
            {/* Хлебные крошки или категория (опционально) */}
            <div className="text-indigo-500 font-bold tracking-widest text-xs uppercase">
              Эксклюзивный трек
            </div>
            {/* ГЛАВНЫЙ ЗАГОЛОВОК — сдержанный и дорогой */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {product.name}
              </h1>
              {/* Полоска на всю ширину с градиентным затуханием */}
              <div className="h-[2px] w-full bg-gradient-to-r from-indigo-500 via-indigo-500/50 to-transparent rounded-full opacity-50" />
            </div>
            {/* Описание товара */}
            <div className="space-y-4">
              <h3 className="text-zinc-500 font-bold uppercase text-xs tracking-widest">
                Об этом треке
              </h3>

              <p className="text-zinc-400 text-lg leading-relaxed max-w-xl whitespace-pre-wrap">
                {product.description ||
                  'Марк Сергеевич пока не добавил описание к этому шедевру.'}
              </p>
            </div>
            <div className="flex items-center gap-5">
              <div className="text-3xl sm:text-4xl font-black text-indigo-400 tracking-tight">
                {product.price.toLocaleString()} ₽
              </div>

              {isAdmin && (
                <Link
                  href={`/admin/edit-product/${product.id}`}
                  className="flex items-center gap-2 px-3 py-2 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-400 hover:border-zinc-600 rounded-xl text-[10px] uppercase tracking-widest font-black text-zinc-400 hover:text-white transition-all shadow-xl backdrop-blur-sm group"
                >
                  <Pencil
                    size={12}
                    className="group-hover:rotate-12 group-hover:scale-110 transition-transform"
                  />
                  <span>Редактировать</span>
                </Link>
              )}
            </div>
            <AddToCartButton product={product} />
          </div>
        </div>
      </main>
    </div>
  );
}
