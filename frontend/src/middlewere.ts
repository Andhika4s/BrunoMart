import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  const { pathname } = request.nextUrl;

  // 1. Proteksi Halaman Admin (Sekarang menggunakan /admin)
  if (pathname.startsWith('/admin')) {
    if (!token || role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // 2. Proteksi Halaman yang WAJIB Login
  const protectedRoutes = ['/cart', '/orders', '/products'];
  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // 3. Mengalihkan User yang sudah login agar tidak bisa masuk ke halaman login lagi
  if (pathname.startsWith('/auth/login') && token) {
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/products', request.url));
  }

  return NextResponse.next();
}

// MATCHER HARUS MENCAKUP SEMUA RUTE YANG DIPROSES DI ATAS
export const config = {
  matcher: [
    '/admin/:path*',  // Ditambahkan agar middleware memproses rute admin
    '/cart/:path*', 
    '/orders/:path*', 
    '/products/:path*', 
    '/auth/login'
  ],
};