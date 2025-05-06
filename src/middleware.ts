import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  //console.log('MIDDLEWARE EXECUTADO', request.nextUrl.pathname);
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const isAuth = !!token

  // Permite acesso público à página inicial e a qualquer rota de autenticação
  if (request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/auth/')) {
    return NextResponse.next();
  }

  // Bloqueia acesso a rotas privadas sem autenticação
  if (!isAuth && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return NextResponse.next();
}

// Define as rotas que o middleware deve proteger
export const config = {
  matcher: ['/dashboard/:path*'],
}
