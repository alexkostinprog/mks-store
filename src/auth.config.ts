import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export default {
  providers: [
    Credentials({
      // Оставляем поля пустыми или только базовую настройку
    }),
  ],
} satisfies NextAuthConfig;
