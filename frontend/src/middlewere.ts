import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Ambil token dan role langsung dari cookie browser
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  const { pathname } = request.nextUrl;

  // JAGA URL: Jika ada yang tembak URL diawali /admin
  if (pathname.startsWith('/admin')) {
    // Jika tidak punya token ATAU role-nya bukan ADMIN, tendang langsung ke login
    if (!token || role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // JAGA URL: Jika ada yang tembak URL proteksi umum tapi belum login
  const protectedRoutes = ['/cart', '/orders', '/products'];
  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // JAGA URL: Jika sudah login, jangan biarkan masuk ke halaman login lagi
  if (pathname.startsWith('/auth/login') && token) {
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  // Pastikan matcher mencakup semua rute sensitif agar dicegat middleware
  matcher: [
    '/admin/:path*',
    '/cart/:path*',
    '/orders/:path*',
    '/products/:path*',
    '/auth/login'
  ],
};