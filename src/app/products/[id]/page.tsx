import Navbar from '@/components/Navbar';
import { db } from '@/lib/db';
import { products } from '@/lib/schema'; // замените на вашу таблицу товаров, если она есть
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';
import { Music } from 'lucide-react';

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

  return (
    <div className="min-h-screen min-w-110 group backdrop-blur-md overflow-hidden shadow-xl bg-indigo-900/60 transition-all duration-300">
      <Navbar />

      <main className="max-w-4xl mx-auto py-20 px-6">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Левая колонка: Изображение */}
          <div className="relative group flex items-center justify-center">
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
            <h1 className="text-5xl font-black tracking-tighter">
              Товар #{id}
            </h1>
            <p className="text-zinc-400 text-lg">
              Здесь будет описание песни, её история и почему Марк Сергеевич
              рекомендует именно её.
            </p>
            <div className="text-3xl font-bold text-indigo-400">5000 ₽</div>
            <AddToCartButton product={product} />
          </div>
        </div>
      </main>
    </div>
  );
}
