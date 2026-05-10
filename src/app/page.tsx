'use client'; // Обязательно для использования useState

import React, { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { useCartStore } from '@/store/useCartStore';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import Song from '@/components/Song';

export default function Home() {
  const { products, setProducts, updateCart } = useCartStore();

  useEffect(() => {
    axios.get('/api/products').then((res) => {
      setProducts(res.data);
    });
  }, []);

  const handleAddToCart = (productId: string) => {
    try {
      // Вызываем обновление корзины из Zustand
      updateCart(productId, 1, products);
      // Показываем уведомление об успехе
      // Красивый кастомный тост
      toast.success('Успешно!', {
        description: 'Выбранная песня в корзине',
        icon: <CheckCircle2 className="text-indigo-500" size={20} />,
        style: {
          background: '#18181b', // zinc-900
          border: '1px solid #27272a', // zinc-800
          color: '#f4f4f5', // zinc-100
        },
        className: 'font-sans border-l-4 border-l-indigo-600', // синяя полоска слева
      });
    } catch (error) {
      // Показываем ошибку, если пользователь не вошел (или другая проблема)
      toast.error('Нужно войти в аккаунт', {
        description: 'Только авторизованные пользователи могут покупать песни',
      });
    }
  };

  return (
    <div className="min-h-screen min-w-110 bg-zinc-50 dark:bg-indigo-950 font-sans text-indigo-900 dark:text-indigo-50">
      {/* Шапка с иконкой корзины */}
      <Navbar />

      <main className="max-w-6xl mx-auto py-12 px-6">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] pb-2 bg-gradient-to-r from-white via-indigo-600 to-purple-900 bg-clip-text text-transparent antialiased">
            Наши товары
          </h1>
          <p className="text-zinc-400 text-lg font-medium">
            Эксклюзивные треки от Марка Сергеевича
          </p>
        </header>

        {/* Сетка товаров */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.isArray(products) &&
            products.map((product) => (
              <Song
                product={product}
                handleAddToCart={handleAddToCart}
                key={product.id}
              />
            ))}
        </div>
      </main>
    </div>
  );
}
