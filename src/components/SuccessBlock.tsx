import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

export default function SuccessBlock() {
  return (
    <div className="bg-zinc-900/50 border border-emerald-500/30 p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl animate-in zoom-in duration-300">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl animate-pulse" />
        <div className="relative bg-zinc-900 border border-emerald-500/50 w-full h-full rounded-full flex items-center justify-center">
          <Check className="text-emerald-500" size={32} strokeWidth={3} />
        </div>
      </div>

      <h1 className="text-3xl font-black text-white mb-2">Всё готово!</h1>
      <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
        Ваш музыкальный профиль успешно создан. Марк Сергеевич уже ждет вас.
      </p>

      <Link
        href="/login"
        className="w-full inline-flex items-center justify-center gap-2 text-white font-bold py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 transition-all active:scale-95 shadow-xl"
      >
        Войти в аккаунт <ArrowRight size={18} />
      </Link>
    </div>
  );
}
