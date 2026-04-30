'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { LogIn, Music, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error('Ошибка входа', {
        description: 'Неверный email или пароль',
      });
      setIsPending(false);
    } else {
      // Если всё ок — редиректим вручную на главную
      window.location.href = '/';
    }
  };
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Фоновые декоративные пятна (Glow) */}
      <div className="absolute top-1/4 -left-20 w-180 h-180 bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-180 h-180 bg-purple-600/10 rounded-full blur-[120px]" />

      {/* Кнопка "Назад" */}
      <Link
        href="/"
        className="absolute top-8 left-8 text-zinc-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">
          ←
        </span>{' '}
        На главную
      </Link>

      <div className="w-full max-w-[400px] relative z-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Логотип */}
          <div className="flex flex-col items-center mb-5">
            <div className="w-16 h-16 bg-white text-zinc-900 flex items-center justify-center rounded-2xl font-black text-2xl shadow-2xl mb-4">
              MSS
            </div>
            <h1 className="text-3xl font-black text-white">Добро пожаловать</h1>
            <p className="text-zinc-500 mt-2 text-center">
              Войдите, чтобы скачивать эксклюзивные треки Марка Сергеевича
            </p>
          </div>

          {/* Карточка входа */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
            <div className="space-y-4">
              {/* Поле Email */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase ml-1">
                  Email
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors"
                    size={18}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-zinc-950 border border-zinc-800 p-4 pl-12 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Поле Пароль */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase ml-1">
                  Пароль
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors"
                    size={18}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-950 border border-zinc-800 p-4 pl-12 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end px-1">
                <Link
                  href="/register"
                  className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 transition-colors"
                >
                  Ещё не с нами? Регистрация!
                </Link>
              </div>
              <button
                disabled={isPending}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
              >
                <LogIn size={18} />
                {isPending ? 'Загрузка...' : 'Войти в MSS'}
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
              <p className="text-xs text-zinc-500 leading-relaxed px-4">
                Авторизуясь, вы соглашаетесь с правилами нашего музыкального
                сообщества
              </p>
            </div>
          </div>
        </form>
        {/* Подпись снизу */}
        <div className="mt-8 flex items-center justify-center gap-2 text-zinc-600 text-sm">
          <Music size={14} />
          <span>Слушай только лучшее</span>
        </div>
      </div>
    </div>
  );
}
