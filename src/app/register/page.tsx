'use client';

import React, { useState } from 'react';
import { User, Mail, Lock, Check, ArrowRight, Music } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';
import SuccessBlock from '@/components/SuccessBlock';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [step, setStep] = useState(1); // 1 - ввод данных, 2 - ввод кода
  const [code, setCode] = useState(''); // Для ввода 6 цифр

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('formData = ', formData);
    e.preventDefault();
    setIsPending(true);
    try {
      const response = await axios.post('/api/register', formData);
      console.log('response.status = ', response.status);
      if (response.status >= 200 && response.status < 300) {
        setIsSuccess(true);
        toast.success('Аккаунт создан!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Ошибка регистрации');
    } finally {
      setIsPending(false);
    }
  };

  // ШАГ 1: Отправка кода
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await axios.post('/api/auth/send-code', { email: formData.email });
      setStep(2); // Переходим к вводу кода
      toast.success('Код отправлен на вашу почту');
    } catch (err) {
      toast.error('Не удалось отправить код');
    } finally {
      setIsPending(false);
    }
  };

  // ШАГ 2: Финальная регистрация (проверка кода и создание юзера)
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      // Отправляем всё вместе: данные юзера + код
      await axios.post('/api/register', { ...formData, code });
      setIsSuccess(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Неверный код');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Наши фирменные фоновые пятна */}
      <div className="absolute top-1/4 -left-20 w-180 h-180 bg-indigo-600/20 rounded-full blur-[120px] z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-180 h-180 bg-purple-600/10 rounded-full blur-[120px] z-0 pointer-events-none" />

      {/* Кнопка "Назад" */}
      <Link
        href="/"
        className="absolute top-8 left-8 text-zinc-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium group z-20"
      >
        <span className="group-hover:-translate-x-1 transition-transform">
          ←
        </span>
        На главную
      </Link>

      <div className="w-full max-w-[400px] relative z-10 text-center">
        {isSuccess ? (
          /* ВИД ПРИ УСПЕХЕ */
          <SuccessBlock />
        ) : step === 1 ? (
          /* ФОРМА РЕГИСТРАЦИИ */
          <>
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-white text-zinc-900 flex items-center justify-center rounded-2xl font-black text-2xl shadow-2xl mb-4">
                MSS
              </div>
              <h1 className="text-3xl font-black text-white tracking-tighter">
                Регистрация
              </h1>
            </div>

            <form
              onSubmit={handleSendCode}
              className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl space-y-4 text-left"
            >
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase ml-1">
                  Имя
                </label>
                <div className="relative group">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors"
                    size={18}
                  />
                  <input
                    className="w-full bg-zinc-950 border border-zinc-800 p-4 pl-12 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all"
                    placeholder="Марк Сергеевич"
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

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
                    className="w-full bg-zinc-950 border border-zinc-800 p-4 pl-12 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all"
                    type="email"
                    placeholder="name@example.com"
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

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
                    className="w-full bg-zinc-950 border border-zinc-800 p-4 pl-12 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all"
                    type="password"
                    placeholder="••••••••"
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>
              <button
                disabled={isPending}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <User size={18} />
                {isPending ? 'Создание...' : 'Создать аккаунт'}
              </button>
            </form>

            <div className="mt-8 flex items-center justify-center gap-2 text-zinc-600 text-sm">
              <Music size={14} />
              <span>Твоя музыка начинается здесь</span>
            </div>
          </>
        ) : (
          // ФОРМА ВВОДА КОДА (ШАГ 2)
          <form
            onSubmit={handleVerifyAndRegister}
            className="animate-in fade-in slide-in-from-right duration-300"
          >
            <h2 className="text-xl font-bold text-white mb-4">
              Введите код из письма
            </h2>
            <input
              className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl text-center text-2xl tracking-[1em] font-black"
              placeholder="000000"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <button className="w-full bg-indigo-600 py-4 rounded-2xl mt-4 font-bold">
              Подтвердить и войти
            </button>
            <button
              onClick={() => setStep(1)}
              className="text-zinc-500 text-xs mt-4 w-full"
            >
              Изменить почту
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
