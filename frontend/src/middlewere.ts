import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Ambil token dan role langsung dari cookie browser
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  const { pathname } = request.nextUrl;

  // Di dalam middleware.ts kamu
if (pathname.startsWith('/admin')) {
  if (!token || role !== 'ADMIN') {
    // Pastikan '/auth/login' ini memang ada folders-nya di app/auth/login/page.tsx
    // Jika tidak ada dan login kamu menyatu di halaman utama, ganti menjadi URL('/', request.url)
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