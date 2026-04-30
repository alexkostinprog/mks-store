import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Расширяем структуру объекта User
   */
  interface User {
    role?: string | null;
  }

  /**
   * Расширяем структуру Session
   */
  interface Session {
    user: {
      role?: string | null;
      id?: string | null;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  /**
   * Расширяем структуру JWT, если вы используете стратегии с токенами
   */
  interface JWT {
    role?: string | null;
  }
}
