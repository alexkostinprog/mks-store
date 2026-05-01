'use client';

import React, { useState } from 'react';
import { Music, ArrowLeft, Upload, DollarSign, Type } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    img: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await axios.post('/api/products/add', formData);
      toast.success('Песня добавлена в каталог!');
      router.push('/admin'); // Возвращаемся в админку
      router.refresh();
    } catch (err) {
      toast.error('Ошибка при добавлении');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 relative overflow-hidden font-sans">
      {/* Glow пятна */}
      <div className="absolute top-1/4 -left-20 w-150 h-150 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />{' '}
          Назад в админку
        </Link>

        <h1 className="text-4xl font-black tracking-tighter mb-10">
          Добавить <span className="text-indigo-500">трек</span>
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl space-y-6"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1">
              Название песни
            </label>
            <div className="relative">
              <Type
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                size={18}
              />
              <input
                className="w-full bg-zinc-950 border border-zinc-800 p-4 pl-12 rounded-2xl outline-none focus:border-indigo-500 transition-all"
                placeholder="Например: Полночный блюз"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase ml-1">
                Цена (Руб)
              </label>
              <div className="relative group">
                {/* Вместо иконки DollarSign ставим текстовый символ рубля */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm group-focus-within:text-indigo-500 transition-colors">
                  ₽
                </div>
                <input
                  type="number"
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 pl-10 rounded-2xl outline-none focus:border-indigo-500 transition-all text-white"
                  placeholder="500"
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase ml-1">
                Обложка (URL)
              </label>
              <div className="relative">
                <Upload
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={18}
                />
                <input
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 pl-12 rounded-2xl outline-none focus:border-indigo-500 transition-all"
                  placeholder="https://imgur.com..."
                  onChange={(e) =>
                    setFormData({ ...formData, img: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1">
              Описание
            </label>
            <textarea
              className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all min-h-[120px]"
              placeholder="Расскажите об этом треке..."
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <button
            disabled={isPending}
            className="w-full relative group overflow-hidden bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-5 rounded-2xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)]"
          >
            {/* Эффект глянца при наведении */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

            {isPending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Music
                size={20}
                className="group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 text-indigo-200"
              />
            )}

            <span className="tracking-tight text-lg">
              {isPending ? 'Загружаем трек...' : 'Опубликовать в магазине'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
