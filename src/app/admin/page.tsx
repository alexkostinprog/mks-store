import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { orders } from '@/lib/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import ExportButton from '@/components/admin/ExportButton';

export default async function AdminPage() {
  const session = await auth();

  // Замени на свою почту
  if (session?.user?.email !== 'alexkostin1@gmail.com') redirect('/');

  // 1. Получаем статистику через Drizzle sql-хелперы
  const [stats] = await db
    .select({
      totalOrders: sql<number>`count(*)`,
      totalRevenue: sql<number>`sum(case when status = 'paid' then amount else 0 end)`,
      uniqueCustomers: sql<number>`count(distinct user_id)`,
    })
    .from(orders);

  // 2. Получаем последние 10 заказов
  const lastOrders = await db.query.orders.findMany({
    limit: 10,
    orderBy: [desc(orders.createdAt)],
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden font-sans">
      {/* Наши фирменные фоновые свечения */}
      <div className="absolute top-1/4 -left-20 w-180 h-180 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 -right-20 w-180 h-180 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto p-8 relative z-10">
        {/* Верхняя навигация */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group text-sm font-medium"
          >
            <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all shadow-lg">
              <ArrowLeft size={16} className="text-white" />
            </div>
            Назад на сайт
          </Link>

          <div className="flex items-center gap-2 text-indigo-500/50 text-[10px] font-black uppercase tracking-[0.2em]">
            <LayoutDashboard size={14} />
            Control Center
          </div>
        </div>

        <h1 className="text-5xl font-black tracking-tighter mb-12 text-white">
          Панель управления <span className="text-indigo-500">MSS</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-zinc-900/50 backdrop-blur-xl p-8 rounded-[2rem] border border-zinc-800 shadow-2xl">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">
              Выручка
            </p>
            <p className="text-4xl font-black text-indigo-400">
              {stats?.totalRevenue || 0} ₽
            </p>
          </div>
          <div className="bg-zinc-900/50 backdrop-blur-xl p-8 rounded-[2rem] border border-zinc-800 shadow-2xl">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">
              Заказы
            </p>
            <p className="text-4xl font-black text-white">
              {stats?.totalOrders || 0}
            </p>
          </div>
          <div className="bg-zinc-900/50 backdrop-blur-xl p-8 rounded-[2rem] border border-zinc-800 shadow-2xl">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">
              Клиенты
            </p>
            <p className="text-4xl font-black text-white">
              {stats?.uniqueCustomers || 0}
            </p>
          </div>
        </div>

        {/* Таблица последних платежей */}
        <div className="bg-zinc-900/30 backdrop-blur-md rounded-[2.5rem] border border-zinc-800 shadow-2xl overflow-hidden mb-12">
          <div className="p-8 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="font-black text-xl text-white tracking-tight">
              Последние транзакции
            </h2>
            <ExportButton data={lastOrders} />
          </div>
          {/* ... заголовок секции ... */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-900/50 text-[10px] uppercase text-zinc-500 font-black tracking-widest">
                <tr>
                  <th className="p-6">ID Заказа</th>
                  <th className="p-6">Дата</th>
                  <th className="p-6">Сумма</th>
                  <th className="p-6">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {lastOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-6 text-[10px] font-mono text-zinc-600">
                      {order.id}
                    </td>

                    <td className="p-6 text-[11px] text-zinc-400 font-medium">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="p-6 font-black text-white text-lg">
                      {order.amount} ₽
                    </td>

                    <td className="p-6">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          order.status === 'paid'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {order.status === 'paid' ? 'Оплачен' : 'Ожидание'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
