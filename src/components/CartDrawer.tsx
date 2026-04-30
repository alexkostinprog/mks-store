'use client';
import { useCartStore } from '@/store/useCartStore';
import { MailWarning, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateCart, clearCart, checkout } =
    useCartStore();

  const [isPending, setIsPending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const { data: session } = useSession(); // Получаем данные сессии

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isCartOpen) return null;

  const handlePay = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!session && !emailRegex.test(email)) {
      return toast.error('Ошибка!', {
        description: 'Введите корректный е-мейл!',
        icon: <MailWarning className="text-rose-400" size={20} />,
        style: {
          background: '#18181b', // zinc-900
          border: '1px solid #27272a', // zinc-800
          color: 'oklch(71.2% 0.194 13.428)', // zinc-100
        },
        className: 'font-sans border-l-4 border-l-indigo-600', // синяя полоска слева
      });
    }
    setIsPending(true);
    try {
      // await checkout();
      await checkout(email);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsPending(false);
    }
  };

  // Считаем общую сумму
  const totalPrice = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
    0,
  );

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Подложка */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Панель */}
      <div className="relative w-full max-w-md bg-zinc-900 h-full shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300 border-l border-zinc-800">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Корзина</h2>
          <div className="flex items-center gap-4">
            {cart.length > 0 && (
              <button
                onClick={() => setShowConfirm(true)}
                className="text-xs font-medium text-zinc-500 hover:text-red-400 transition-colors flex items-center gap-1.5 group"
              >
                <Trash2
                  size={14}
                  className="group-hover:rotate-12 transition-transform"
                />
                Очистить
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-zinc-400 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex-1 flex h-full flex-col items-center justify-center text-center px-6 animate-in fade-in zoom-in duration-500">
              {/* Иконка с пульсацией */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative text-7xl">🛍️</div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Корзина пуста
              </h3>

              <p className="text-zinc-500 mb-8 max-w-[220px] mx-auto text-base leading-relaxed">
                Марк Сергеевич подготовил отличные песни, загляните в каталог за
                вдохновением!
              </p>

              <button
                onClick={() => setIsCartOpen(false)}
                className="group flex items-center gap-2 text-lg font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <span className="group-hover:-translate-x-1 transition-transform">
                  ←
                </span>
                Начать покупки
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex flex-col bg-zinc-800/40 border border-zinc-800 p-4 rounded-2xl mb-4 transition-all hover:border-zinc-700"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3">
                    {item.img && (
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover border border-zinc-700"
                      />
                    )}
                    <div>
                      <p className="font-bold text-zinc-100 text-sm leading-tight mb-1">
                        {item.name}
                      </p>
                      <p className="text-indigo-400 font-black text-sm">
                        {(Number(item.price) || 0) * item.quantity} ₽
                      </p>
                    </div>
                  </div>

                  {/* Кнопка быстрого удаления (крестик) */}
                  <button
                    onClick={() => updateCart(item.id, -item.quantity, [])}
                    className="text-zinc-600 hover:text-red-400 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1 gap-1">
                    {/* Кнопка МИНУС */}
                    <button
                      onClick={() => updateCart(item.id, -1, [])}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    >
                      <div className="relative -top-0.5">-</div>
                    </button>

                    <span className="w-8 text-center font-bold text-sm text-zinc-200">
                      {item.quantity}
                    </span>

                    {/* Кнопка ПЛЮС */}
                    <button
                      onClick={() => updateCart(item.id, 1, [])}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    >
                      <div className="relative -top-0.5">+</div>
                    </button>
                  </div>

                  <span className="text-xs text-zinc-500 font-medium">
                    {item.price} ₽ / шт.
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <>
            {/* Основная сумма */}
            <div className="flex justify-between items-end pb-1">
              <span className="text-zinc-100 font-medium">К оплате:</span>
              <div className="text-right">
                <span className="text-3xl font-black text-white tracking-tighter">
                  {totalPrice.toLocaleString()} ₽
                </span>
              </div>
            </div>

            {/* Показываем инпут только если пользователь НЕ авторизован */}
            {!session && (
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                <label className="text-xs font-bold text-zinc-500 uppercase px-1">
                  Куда отправить песни?
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@mail.com"
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 mb-2 rounded-2xl text-white outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group"
            >
              {isPending ? 'Создание заказа...' : 'Оформить заказ'}
              {!isPending && (
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              )}
            </button>
          </>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Затемнение с сильным блюром */}
          <div
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setShowConfirm(false)}
          />

          {/* Карточка подтверждения */}
          <div className="relative bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] max-w-[320px] w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-6">
              {/* Иконка в светящемся круге */}
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
                <div className="relative bg-zinc-800 border border-zinc-700 w-full h-full rounded-full flex items-center justify-center">
                  <Trash2
                    className="text-red-500"
                    size={32}
                    strokeWidth={1.5}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black tracking-tighter text-white">
                  Очистить?
                </h3>
                <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                  Все песни Марка Сергеевича исчезнут из корзины.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={async () => {
                    await clearCart();
                    setShowConfirm(false);
                  }}
                  className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-600/20 transition-all active:scale-95"
                >
                  Да, удалить всё
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="w-full py-4 rounded-2xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 transition-colors"
                >
                  Я передумал
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
