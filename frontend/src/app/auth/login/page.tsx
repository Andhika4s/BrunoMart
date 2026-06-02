'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/features/auth/hooks/useAuth';
import { api } from '@/lib/api'; // 💡 Gunakan instance API Axios milikmu yang sudah mengarah ke port 5000
import { setCookie } from 'cookies-next';
import { ArrowRight, Loader2, Store } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AuthPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 💡 Hapus prefix '/api' karena instance axios 'api' biasanya sudah memiliki baseURL: http://localhost:5000/api
      const url = isSignUp ? '/auth/register' : '/auth/login';
      const bodyPayload = isSignUp ? { name, email, password } : { email, password };

      // 💡 PERBAIKAN UTAMA: Gunakan api.post agar nembak ke port 5000, bukan fetch manual ke port 3000
      const response = await api.post(url, bodyPayload);
      const data = response.data;

      const token = data.token || data.access_token || data.accessToken; 
      const userRole = data.role || data.user?.role || 'USER';
      
      const userData = data.user || {
        id: data.userId || data.id || '',
        email: email,
        name: data.name || name || 'User BrunoMart',
        role: userRole
      };

        if (token) {
          setCookie('token', token, { maxAge: 60 * 60 * 24, path: '/' });
          setCookie('role', userRole, { maxAge: 60 * 60 * 24, path: '/' });
          setUser(userData);
          toast.success(isSignUp ? 'Registrasi berhasil!' : 'Selamat datang kembali!');
          
          if (userRole === 'ADMIN') {
            router.push('/admin');
          } else {
            router.push('/products');
          }
          router.refresh();

        } else if (isSignUp) {
          // Register tidak return token, itu normal
          toast.success('Registrasi berhasil! Silakan masuk.');
          setIsSignUp(false); // Switch ke form login
          
        } else {
          // Login tapi tidak ada token — ini baru error
          alert('Token tidak ditemukan dari response server backend!');
        }

    } catch (error: any) {
      console.error('Error Auth:', error);
      // Mengambil pesan error asli dari NestJS jika ada
      const errorMessage = error.response?.data?.message || 'Gagal menyambung ke server backend NestJS port 5000!';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans flex items-center justify-center p-0 sm:p-4">
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.15); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translate(0px, 0px) scale(1.1); }
          33% { transform: translate(-40px, 40px) scale(0.9); }
          66% { transform: translate(30px, -20px) scale(1.05); }
        }
        .animate-float-1 { animation: float-slow 10s infinite ease-in-out; }
        .animate-float-2 { animation: float-reverse 14s infinite ease-in-out; }
      `}</style>

      <div className="w-full max-w-5xl bg-white sm:rounded-3xl sm:border border-slate-100 shadow-xl shadow-slate-100/50 min-h-screen sm:min-h-[640px] grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* SISI KIRI: FORM */}
        <div className="lg:col-span-5 flex flex-col justify-between p-8 sm:p-12">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity w-fit">
            <Store className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold tracking-tight text-blue-600">
              Bruno<span className="text-slate-800">Mart</span>
            </span>
          </Link>

          <div className="my-auto py-8 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                {isSignUp ? 'Buat Akun Baru' : 'Welcome back'}
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                {isSignUp ? 'Daftar sekarang untuk mulai berbelanja harian' : 'Masuk untuk mengelola keranjang dan transaksi Anda'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Nama Lengkap</label>
                  <Input 
                    type="text" 
                    placeholder="Nama Lengkap" 
                    className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl px-4 text-xs"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Email</label>
                <Input 
                  type="email" 
                  placeholder="Email" 
                  className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl px-4 text-xs"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-600">Password</label>
                  {!isSignUp && (
                    <Link href="#" className="text-[11px] font-bold text-blue-600 hover:underline">
                      Forgot Password?
                    </Link>
                  )}
                </div>
                <Input 
                  type="password" 
                  placeholder="Password" 
                  className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl px-4 text-xs"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-all pt-0.5 flex items-center justify-center gap-2">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSignUp ? 'Sign Up' : 'Login'}
              </Button>
            </form>
          </div>

          <div className="text-center text-xs text-slate-400 font-medium">
            {isSignUp ? 'Sudah punya akun? ' : 'Belum punya akun? '}
            <button 
              type="button"
              onClick={() => setIsSignUp(!isSignUp)} 
              className="text-blue-600 font-bold hover:underline ml-0.5 focus:outline-none"
              disabled={isLoading}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
            <p className="text-[10px] text-slate-300 mt-4 leading-relaxed">
              By logging in, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy policy</span>.
            </p>
          </div>
        </div>

        {/* SISI KANAN: ANIMASI */}
        <div className="hidden lg:col-span-7 bg-[#0b0f19] p-12 lg:flex flex-col justify-between relative overflow-hidden group cursor-pointer">
          <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] bg-blue-600/15 rounded-full blur-[110px] pointer-events-none mix-blend-screen animate-float-1 transition-all duration-700 ease-out group-hover:bg-cyan-500/25 group-hover:scale-110" style={{ animationDuration: '10s' }}></div>
          <div className="absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[130px] pointer-events-none mix-blend-screen animate-float-2 transition-all duration-700 ease-out group-hover:bg-purple-500/25 group-hover:scale-105" style={{ animationDuration: '14s' }}></div>
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-500/0 rounded-full blur-[100px] pointer-events-none opacity-0 scale-75 transition-all duration-1000 ease-out group-hover:opacity-100 group-hover:scale-125 group-hover:bg-blue-600/10"></div>

          <div className="flex justify-end gap-1.5 z-10">
            <span className={`w-6 h-1 rounded-full transition-all duration-300 ${!isSignUp ? 'bg-white/40' : 'bg-white/10'}`}></span>
            <span className={`w-6 h-1 rounded-full transition-all duration-300 ${isSignUp ? 'bg-white/40' : 'bg-white/10'}`}></span>
          </div>

          <div className="my-auto max-w-md mx-auto w-full space-y-3 text-center z-10 select-none transform transition-transform duration-700 ease-out group-hover:-translate-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight transition-all duration-500 group-hover:text-cyan-200">
              {isSignUp ? 'Platform Belanja Kilat' : 'Smart E-Commerce Solution'}
            </h2>
            <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto leading-relaxed transition-all duration-500 group-hover:text-slate-300">
              {isSignUp 
                ? 'Bergabung bersama BrunoMart dan nikmati kemudahan tracking otomatis pengiriman langsung dari gadget Anda.' 
                : 'Kelola keranjang belanjaan, amankan transaksi, dan nikmati promo flash sale melimpah setiap hari.'}
            </p>
          </div>

          <div className="text-left text-[11px] text-slate-500 font-medium flex items-center justify-between z-10">
            <span>Secure Encryption 256-bit</span>
            <span className="flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer transition-colors">
              BrunoMart Helpcenter <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}