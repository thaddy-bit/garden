import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
const ADMIN_COOKIE = 'admin_token';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier le mode maintenance
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  
  // Routes exclues du mode maintenance
  const isMaintenancePage = pathname === '/maintenance';
  const isAdminRoute = pathname.startsWith('/Admin');
  const isApiRoute = pathname.startsWith('/api');
  const isAsset = pathname.startsWith('/_next') || 
                  pathname.startsWith('/public') || 
                  pathname.startsWith('/images') ||
                  pathname.startsWith('/uploads') ||
                  pathname.startsWith('/videos') ||
                  pathname.startsWith('/favicon.ico');

  // Si le mode maintenance est activé et que ce n'est pas une route exclue
  if (maintenanceMode && !isMaintenancePage && !isAdminRoute && !isApiRoute && !isAsset) {
    const url = request.nextUrl.clone();
    url.pathname = '/maintenance';
    return NextResponse.redirect(url);
  }

  // Si on est sur la page maintenance mais que le mode est désactivé, rediriger vers l'accueil
  if (isMaintenancePage && !maintenanceMode) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Protect all /Admin routes except /Admin/login and public assets
  const isLoginPage = pathname === '/Admin/login';

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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};


