'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Store, ShoppingCart, LogOut, UserPlus, LogIn, User, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '@/features/auth/hooks/useAuth';
import { useQuery } from '@tanstack/react-query'; 
import { api } from '@/lib/api'; 
import { Cart } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'react-hot-toast';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const isAdminPage = pathname.startsWith('/admin');
  const { data: cart } = useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!user) return null; 
      const res = await api.get('/cart');
      return res.data;
    },
    enabled: mounted && !!user, 
    retry: false, 
  });
  
  if (isAdminPage) return null;

  const totalCartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleLogout = () => {
    logout();
    toast.success('Berhasil keluar akun');
    router.push('/auth/login');
  };

  const isLandingPage = pathname === '/';

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isLandingPage 
          ? 'bg-slate-950/40 backdrop-blur-md border-b border-white/[0.05] shadow-lg shadow-black/20' 
          : 'bg-white/80 border-b border-slate-200 backdrop-blur-md shadow-sm'
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-6xl">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <Store className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform" />
          <span className={`text-lg font-black tracking-tight transition-colors ${
            isLandingPage ? 'text-white' : 'text-blue-600'
          }`}>
            Bruno<span className={isLandingPage ? 'text-blue-400' : 'text-slate-800'}>Mart</span>
          </span>
        </Link>

        {/* MENU TENGAH */}
        {isLandingPage && (
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-wide text-white/80">
            <a href="#features" className="hover:text-blue-400 transition-colors py-1 relative group">
              Keunggulan
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full" />
            </a>
            <a href="#cta" className="hover:text-blue-400 transition-colors py-1 relative group">
              Tentang Kami
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full" />
            </a>
          </nav>
        )}

        {/* KONTROL KANAN */}
        <div className="flex items-center gap-3">
          
          {!isLandingPage && user && (
            <Link href="/cart" className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {mounted && totalCartCount > 0 && (
                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {totalCartCount}
                </span>
              )}
            </Link>
          )}

          {!mounted ? (
            <div className="w-8 h-8 bg-slate-800/40 rounded-full animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-white uppercase cursor-pointer focus:outline-none hover:opacity-90 transition-opacity">
                  {user.name ? user.name.substring(0, 2) : 'US'}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-slate-200 shadow-md rounded-xl mt-2 p-1 z-[60]">
                
                <DropdownMenuLabel className="px-3 py-2">
                  <p className="text-xs font-black text-slate-900">{user.name}</p>
                  <p className="text-[10px] font-medium text-slate-400 truncate">{user.email}</p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-slate-100" />

                {/* --- MENU RIWAYAT TRANSAKSI DITAMBAHKAN DI SINI --- */}
                <DropdownMenuItem asChild>
                  <Link 
                    href="/orders" 
                    className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer py-2 px-3 rounded-lg hover:bg-slate-50"
                  >
                    <ShoppingBag className="h-4 w-4 text-slate-400" />
                    Riwayat Transaksi
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link 
                    href="/profile" 
                    className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer py-2 px-3 rounded-lg hover:bg-slate-50 focus:bg-slate-50"
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    Profil Saya
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 text-xs font-bold text-red-600 cursor-pointer py-2 px-3 rounded-lg hover:bg-red-50 focus:bg-red-50 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar Aplikasi
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className={`text-xs font-bold rounded-xl px-4 transition-all ${isLandingPage ? 'text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <LogIn className="h-3.5 w-3.5 mr-1.5 opacity-90" /> Sign In
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="sm" className={`text-xs font-bold px-4 h-9 rounded-xl transition-all duration-200 ${isLandingPage ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/10' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                  <UserPlus className="h-3.5 w-3.5 mr-1.5 opacity-90" /> Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}