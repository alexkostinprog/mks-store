'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useCartStore } from '@/store/useCartStore';

// 1. Выносим логику в отдельный внутренний компонент
function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [status, setStatus] = useState<'loading' | 'paid' | 'pending'>(
    'loading',
  );
  const { clearCart, setIsCartOpen } = useCartStore();

  useEffect(() => {
    setIsCartOpen(false);
    console.log("orderId = ", orderId);
    if (!orderId) return;

    const checkStatus = async () => {
      try {
        const { data } = await axios.get(
          `/api/order-status?orderId=${orderId}`,
        );

        if (data.status === 'paid') {
          setStatus('paid');
          // ОЧЕНЬ ВАЖНО: Остановить таймер здесь!
          clearInterval(interval);
          // Очищаем LocalStorage, чтобы при возврате в магазин корзина была пустой
          localStorage.removeItem('mark_store_cart');
          clearCart();
        }
      } catch (e) {
        console.error('Ошибка проверки');
      }
    };

    // Создаем интервал и сохраняем его в переменную
    const interval = setInterval(checkStatus, 3000);

    // Вызываем один раз сразу, не дожидаясь первых 3 секунд
    checkStatus();

    // Очистка при размонтировании компонента
    return () => clearInterval(interval);
  }, [orderId, clearCart]);

  return (
    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl max-w-sm w-full animate-in fade-in zoom-in duration-500">
      {status === 'paid' ? (
        <>
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-2xl font-bold mb-2">Оплата прошла!</h1>
          <p className="text-zinc-500 mb-8 text-sm">
            Доступ открыт. Проверьте вашу почту!
          </p>
        </>
      ) : (
        <>
          <div className="text-6xl mb-6 animate-bounce">⏳</div>
          <h1 className="text-2xl font-bold mb-2">Проверяем оплату</h1>
          <p className="text-zinc-500 mb-8 text-sm">
            Это займет всего несколько секунд...
          </p>
        </>
      )}

      <Link
        href="/"
        className="block w-full bg-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 text-white py-3 rounded-xl font-semibold text-center"
      >
        Вернуться на главную
      </Link>
    </div>
  );
}

// 2. Главный компонент оборачиваем в Suspense
export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
      <Suspense fallback={<div>Загрузка...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
