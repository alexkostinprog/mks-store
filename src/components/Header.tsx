'use client'; // Сделайте его клиентским

import { useSession } from 'next-auth/react';
import UserMenu from './UserMenu';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

export default function Header() {
  const { data: session } = useSession(); // Получаем сессию на клиенте

  return (
    <>
      {session ? (
        <UserMenu user={session.user} />
      ) : (
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-indigo-200 bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md rounded-full transition-all active:scale-95 shadow-lg shadow-black/20 whitespace-nowrap"
        >
          <LogIn size={16} strokeWidth={2.5} className="text-indigo-200" />
          <span>Войти</span>
        </Link>
      )}
    </>
  );
}
