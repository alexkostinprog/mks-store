import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { Providers } from '@/components/Providers';
import { Plus_Jakarta_Sans } from 'next/font/google';
import CartDrawer from '@/components/CartDrawer';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['cyrillic-ext', 'latin'],
  weight: ['400', '500', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Марк Сергеевич Store',
  description: 'Магазин Марка',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className={`${jakarta.className} min-h-full flex flex-col`}>
        <Providers>
          {children}
          <Toaster
            theme="dark" // Сразу ставим темную тему
            position="bottom-right" // Снизу справа обычно удобнее для магазинов
            expand={false} // Чтобы тосты не раздувались
            richColors
          />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
