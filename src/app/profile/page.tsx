import { auth } from '@/auth';
import db from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { eq, desc } from 'drizzle-orm';
import { orders as ordersSchema, products } from '@/lib/schema';

export default async function ProfilePage() {
  // 1. Получаем сессию на сервере
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // 2. Получаем данные напрямую из БД
  const orders =
    (await db.query.orders.findMany({
      where: eq(ordersSchema.userId, session.user.id),
      orderBy: [desc(ordersSchema.createdAt)],
    })) || [];

  const userId = session.user.id;
  const userName = session?.user?.name || 'Пользователь';
  const userInitial = userName.charAt(0).toUpperCase();

  // Если нет userId, возвращаем пустой массив сразу
  if (!userId) {
    return []; // или redirect('/login')
  }

  // 1. Получаем все заказы пользователя
  // Используем имя из схемы — просто orders
  const userOrders =
    (await db.query.orders.findMany({
      where: eq(ordersSchema.userId, userId),
      orderBy: [desc(ordersSchema.createdAt)],
    })) || [];

  // 2. Формируем Set из ID купленных товаров
  const paidOrders = orders.filter((o) => o.status === 'paid');
  const purchasedProductIds = new Set<string>();

  paidOrders.forEach((order) => {
    try {
      const items =
        typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      if (Array.isArray(items)) {
        items.forEach((item: any) => purchasedProductIds.add(String(item.id)));
      }
    } catch (e) {
      console.error('Ошибка парсинга заказа:', e);
    }
  });

  // 3. НОВОЕ: Достаем данные об этих товарах из БД
  let myCourses: any[] = [];

  if (purchasedProductIds.size > 0) {
    // Используем имя 'products', так как оно прописано в вашей схеме
    myCourses = await db.query.products.findMany({
      where: (table, { inArray }) =>
        inArray(table.id, Array.from(purchasedProductIds)),
    });
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-6 relative overflow-hidden">
      {/* Фоновые декоративные пятна (Glow) */}
      <div className="absolute top-1/4 -left-20 w-180 h-180 bg-indigo-600/20 rounded-full blur-[120px] z-0" />
      <div className="absolute bottom-1/4 -right-20 w-180 h-180 bg-purple-600/10 rounded-full blur-[120px] z-0" />
      <div className="max-w-4xl mx-auto z-10 relative">
        <header className="flex justify-between items-center mb-12">
          {/* Блок профиля с аватаркой */}
          <div className="flex items-center gap-6 mb-12 animate-in fade-in slide-in-from-left duration-500">
            {/* Аватарка */}
            <div className="relative group">
              {/* Свечение за аватаркой */}
              <div className="absolute inset-0 bg-indigo-500/20 rounded-[2rem] blur-xl group-hover:bg-indigo-500/40 transition-all" />

              <div className="relative w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-[2rem] flex items-center justify-center shadow-2xl overflow-hidden">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-black text-indigo-500 select-none">
                    {userInitial}
                  </span>
                )}

                {/* Глянцевый блик сверху */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Текст рядом с аватаркой */}
            <div className="space-y-1">
              <h1 className="text-5xl font-black tracking-tighter leading-none">
                Личный кабинет
              </h1>
              <p className="text-zinc-400 text-xl font-medium tracking-tight">
                {userName}
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            ← В магазин
          </Link>
        </header>

        {/* Секция: Мои курсы */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            🎵 Мои песни{' '}
            <span className="text-sm font-normal text-zinc-400">
              ({myCourses.length})
            </span>
          </h2>
          {myCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex gap-4 items-center"
                >
                  <img
                    src={course.img}
                    alt=""
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-bold">{course.name}</h3>
                    <button className="mt-2 text-sm bg-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 text-white px-3 py-1 rounded-md">
                      Слушать
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-100 dark:bg-zinc-900/50 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center">
              <p className="text-zinc-500">У вас пока нет оплаченных песен</p>
            </div>
          )}
        </section>

        {/* Секция: История заказов */}
        <section>
          <h2 className="text-xl font-bold mb-6">История заказов</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-sm">
                  <th className="p-4 font-semibold">Дата</th>
                  <th className="p-4 font-semibold">Сумма</th>
                  <th className="p-4 font-semibold">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="p-4 text-zinc-400">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="p-4">{order.amount} ₽</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            order.status === 'paid'
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-yellow-500/10 text-yellow-500'
                          }`}
                        >
                          {order.status === 'paid' ? 'Оплачен' : 'Ожидание'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-zinc-500">
                      Заказов пока нет
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
