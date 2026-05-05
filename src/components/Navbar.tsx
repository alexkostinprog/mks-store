'use client';

import Header from '@/components/Header';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { cart, setIsCartOpen } = useCartStore();
  const [mounted, setMounted] = useState(false);
  // Ждем, пока компонент "примонтируется" в браузере
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-10 bg-white/80 dark:bg-indigo-900/80 backdrop-blur-md border-b border-indigo-200 dark:border-indigo-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Левая часть: Логотип и Название как было раньше */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-4 group">
            {/* Твой квадратный логотип MSS */}
            <div className="w-13 h-8 sm:w-15 sm:h-10 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-indigo-700 flex items-center justify-center rounded-xl font-black text-lg sm:text-xl shadow-lg group-hover:shadow-indigo-500/20 transition-all">
              MSS
            </div>
            <span className="font-bold text-lg sm:text-2xl">
              Марк Сергеевич <span className="text-indigo-400">Store</span>
            </span>
          </Link>
        </div>

        {/* Правая часть: Профиль и Корзина */}
        <div className="flex items-center gap-4">
          {/* Твой новый Header с выпадающим меню */}
          <Header />

          {/* Старая добрая кнопка корзины с прыгающим счетчиком */}
          {setIsCartOpen && (
            <motion.div
              key={cart.length} // Анимация срабатывает при изменении длины массива
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.4, 1] }} // Эффект пульсации
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 bg-indigo-600/10 text-indigo-400 rounded-full hover:bg-indigo-600/20 transition-all border border-indigo-500/20"
              >
                <ShoppingCart size={20} strokeWidth={2} />

                {mounted && cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-1 ring-zinc-100 animate-bounce shadow-[0_0_15px_rgba(79,70,229,0.8)]">
                    {cart.length}
                  </span>
                )}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
}
