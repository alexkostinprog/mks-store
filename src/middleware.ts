import NextAuth from 'next-auth';
import authConfig from './auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAuthPage =
    nextUrl.pathname === '/login' || nextUrl.pathname === '/register';
  const isPublicPage = nextUrl.pathname === '/'; // Главная тоже открыта

  // 1. Если пользователь на странице логина/регистрации
  if (isAuthPage) {
    if (isLoggedIn) {
      // Если уже залогинен — кидаем в профиль, чтобы не логинился дважды
      return Response.redirect(new URL('/profile', nextUrl));
    }
    // Если не залогинен — разрешаем просмотр (важно!)
    return;
  }

  // 2. Если страница не публичная и пользователь не залогинен
  if (!isLoggedIn && !isPublicPage) {
    return Response.redirect(new URL('/login', nextUrl));
  }

  return;
});

// Настраиваем, какие пути Middleware вообще должен обрабатывать
export const config = {
  // Добавляем расширения файлов в исключения (?! ... | .png | .jpg | .svg | .webp)
  matcher: [
    /*
     * Исключаем (пропускаем без проверки):
     * 1. api/auth, api/products, api/order-status (наши апишки)
     * 2. products (все страницы товаров)
     * 3. login, register, success (публичные страницы)
     * 4. _next/static, _next/image, favicon.ico (системное)
     * 5. Все файлы с расширениями (картинки и т.д.)
     */
    '/((?!api/auth|api/products|api/order-status|products|login|register|success|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif)$).*)',
  ],
};
