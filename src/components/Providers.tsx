'use client';
import { SessionProvider } from 'next-auth/react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Принудительно загружаем данные из LocalStorage в память
    useCartStore.persist.rehydrate();
  }, []);
  return <SessionProvider>{children}</SessionProvider>;
}
