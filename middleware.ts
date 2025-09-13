import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
const ADMIN_COOKIE = 'admin_token';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /Admin routes except /Admin/login and public assets
  const isAdminRoute = pathname.startsWith('/Admin');
  const isLoginPage = pathname === '/Admin/login';
  const isAsset = pathname.startsWith('/_next') || pathname.startsWith('/public');

  if (!isAdminRoute || isLoginPage || isAsset) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/Admin/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Edge-safe: décoder le JWT sans dépendances Node (base64url)
  try {
    const parts = token.split('.');
    if (parts.length >= 2) {
      const payloadStr = Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
      const payload = JSON.parse(payloadStr);
      const role = payload?.role || '';
      if (role === 'admin' || role === 'superadmin') {
        return NextResponse.next();
      }
    }
  } catch {}
  const url = request.nextUrl.clone();
  url.pathname = '/Admin/login';
  url.searchParams.set('redirect', pathname);
  return NextResponse.redirect(url);

  return NextResponse.next();
}

export const config = {
  matcher: ['/Admin/:path*'],
};


