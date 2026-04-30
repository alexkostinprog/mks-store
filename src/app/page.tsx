'use client'; // Обязательно для использования useState

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useCartStore } from '@/store/useCartStore';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Home() {
  const { products, setProducts, updateCart } = useCartStore();

  useEffect(() => {
    axios.get('/api/products').then((res) => {
      setProducts(res.data);
    });
  }, []);

  const handleAddToCart = async (productId: string) => {
    try {
      // Вызываем обновление корзины из Zustand
      await updateCart(productId, 1, products);
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
              <div
                key={product.id}
                className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl hover:border-indigo-500/50 hover:bg-zinc-900 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <Link
                  href={`/products/${product.id}`}
                  className="block cursor-pointer"
                >
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="p-5">
                    <h3 className="font-bold text-xl tracking-tight text-zinc-100 group-hover:text-indigo-400 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-2xl font-black tracking-tighter bg-gradient-to-br from-indigo-400 to-purple-600 bg-clip-text text-transparent">
                        {product.price} ₽
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product.id);
                        }}
                        className="relative z-20 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-500 active:scale-95 transition-all cursor-pointer pointer-events-auto"
                      >
                        В корзину
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
