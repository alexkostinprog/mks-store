'use client';

import React, { useState } from 'react';
import { Music, Upload, DollarSign, Type, Save, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function EditProductForm({ product }: { product: any }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Предзаполняем форму данными товара
  const [formData, setFormData] = useState({
    id: product.id,
    name: product.name,
    price: product.price.toString(),
    img: product.img,
    description: product.description || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      // Используем PATCH для обновления
      await axios.patch('/api/products/edit', formData);
      toast.success('Данные трека обновлены!');
      router.refresh(); // Обновляем данные на странице
      router.push(`/products/${product.id}`); // Возвращаем админа на страницу товара
    } catch (err) {
      toast.error('Ошибка при сохранении');
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    setIsPending(true);
    try {
      await axios.delete('/api/products/delete', { data: { id: product.id } });
      toast.success('Трек успешно удален');
      router.push('/');
      router.refresh();
    } catch (err) {
      toast.error('Не удалось удалить трек');
      setIsPending(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
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
              className="w-full bg-zinc-950 border border-zinc-800 p-4 pl-12 rounded-2xl outline-none focus:border-indigo-500 transition-all text-white"
              value={formData.name}
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
              Цена (₽)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">
                ₽
              </span>
              <input
                type="number"
                className="w-full bg-zinc-950 border border-zinc-800 p-4 pl-10 rounded-2xl outline-none focus:border-indigo-500 transition-all text-white"
                value={formData.price}
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
                className="w-full bg-zinc-950 border border-zinc-800 p-4 pl-12 rounded-2xl outline-none focus:border-indigo-500 transition-all text-white"
                value={formData.img}
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
            className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all min-h-[120px] text-white"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <button
          disabled={isPending}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
        >
          <Save size={20} />
          {isPending ? 'Сохранение...' : 'Сохранить изменения'}
        </button>

        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isPending}
          className="w-full group flex items-center justify-center gap-2 py-4 text-zinc-500 hover:text-red-400 border border-dashed border-zinc-800 hover:border-red-500/50 rounded-2xl transition-all duration-300"
        >
          <Trash2
            size={18}
            className="group-hover:rotate-12 transition-transform"
          />
          <span className="font-bold text-sm uppercase tracking-widest">
            Удалить трек из базы
          </span>
        </button>
      </form>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Глубокое размытие фона */}
          <div
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => !isPending && setShowDeleteConfirm(false)}
          />

          {/* Карточка подтверждения */}
          <div className="relative bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] max-w-[380px] w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-6">
              {/* Иконка в красном свечении */}
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative bg-zinc-800 border border-red-500/50 w-full h-full rounded-full flex items-center justify-center">
                  <Trash2 className="text-red-500" size={32} />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white tracking-tighter">
                  Удалить трек?
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Вы собираетесь безвозвратно удалить{' '}
                  <span className="text-white font-bold">"{product.name}"</span>
                  . Это действие нельзя будет отменить.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {isPending ? 'Удаление...' : 'Да, удалить навсегда'}
                </button>

                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isPending}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-95"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
