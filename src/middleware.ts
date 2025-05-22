// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { MiddlewareConfig } from 'next/server';

import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;
  const pathname = request.nextUrl.pathname;

  // Rotas públicas
  const publicRoutes = [
    '/',
    '/signin',
    '/signup',
    '/reset-password',
    '/reset-password-request',
    '/set-password',
    '/verify',
  ];

  // Permite livre acesso às rotas públicas
  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  if (isPublic) {
    return NextResponse.next();
  }

  // Bloqueia acesso não autenticado ao restante
  if (!isAuth) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
