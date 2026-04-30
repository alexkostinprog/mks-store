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
    '/((?!api/auth|api/products|api/register|api/order-status|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif)$).*)',
  ],
};
