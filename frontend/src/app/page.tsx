'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Truck, 
  Clock, 
  ArrowRight, 
  Store, 
  ChevronRight, 
  Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* 1. HERO SECTION WITH AMBIENT GLOW */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black py-20 lg:py-32 border-b border-slate-800/60">
        
        {/* Decorative Background Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Text */}
          <div className="space-y-6 text-center lg:text-left lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-medium tracking-wide backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-pulse" /> 
              <span>E-Commerce Sekolah Modern v2.0</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Penuhi Kebutuhan Harianmu di{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
                BrunoMart
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Platform belanja digital praktis, cepat, dan aman yang dirancang khusus untuk menyederhanakan transaksi seluruh komunitas BrunoMart dalam satu ketukan.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 h-12 px-6 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-blue-600/20">
                  Mulai Belanja <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              {/* 🔗 FIX LINK: Diarahkan ke sub-route login resmi */}
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2 h-12 px-6 rounded-xl font-semibold backdrop-blur-sm transition-all">
                  Buat Akun Baru
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Interactive Hero Visual */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-3xl blur-2xl opacity-15 group-hover:opacity-25 transition-opacity duration-500" />
            
            <div className="w-full max-w-[400px] aspect-square rounded-3xl bg-slate-950 border border-slate-800 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group-hover:border-slate-700/80 transition-colors duration-300">
              {/* Top bar window control simulator */}
              <div className="flex justify-between items-center border-b border-slate-900 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800/60">Secure Live Connect</span>
              </div>

              {/* Animated Center Icon */}
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/10 relative z-10">
                    <Store className="h-10 w-10" />
                  </div>
                </div>
                <p className="text-xl font-bold tracking-wide text-white mt-6">BrunoMart App</p>
                <p className="text-xs text-slate-500 mt-1">Aman • Cepat • Terintegrasi</p>
              </div>

              {/* Interactive bottom status bar */}
              <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between text-xs backdrop-blur-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Sistem Siap Digunakan</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

        </div>
      </section>

     {/* 2. FEATURES SECTION (KEUNGGULAN) */}
<section id="features" className="py-24 relative bg-slate-950 border-b border-slate-900">
  <div className="container mx-auto px-4 max-w-6xl">
    
    {/* Header Section */}
    <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
      <h2 className="text-xs font-bold text-blue-500 tracking-widest uppercase">Keunggulan Utama</h2>
      <h3 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        Mengapa Harus Memilih BrunoMart?
      </h3>
      <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
        Kami menghadirkan pengalaman belanja online terbaik di ekosistem sekolah dengan jaminan kenyamanan ekstra.
      </p>
    </div>

    {/* Grid Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* Feature 1 - Keamanan */}
      <Card className="border border-slate-900 bg-slate-900/40 shadow-xl hover:border-slate-800 hover:bg-slate-900/70 transition-all duration-300 group rounded-2xl backdrop-blur-sm overflow-hidden">
        <CardContent className="p-8 space-y-4">
          {/* Icon Wrapper */}
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            <ShieldCheck className="h-6 w-6" />
          </div>
          {/* Title - Dipastikan text-white agar kontras */}
          <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors pt-2">
            Keamanan Terjamin
          </h4>
          {/* Description - Warna text-slate-400 agar nyaman dibaca di dark mode */}
          <p className="text-slate-400 text-sm leading-relaxed">
            Autentikasi menggunakan enkripsi data ketat end-to-end, memastikan saldo dan rahasia akun Anda aman sepanjang waktu.
          </p>
        </CardContent>
      </Card>

      {/* Feature 2 - Pemrosesan Cepat */}
      <Card className="border border-slate-900 bg-slate-900/40 shadow-xl hover:border-slate-800 hover:bg-slate-900/70 transition-all duration-300 group rounded-2xl backdrop-blur-sm overflow-hidden">
        <CardContent className="p-8 space-y-4">
          {/* Icon Wrapper */}
          <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
            <Truck className="h-6 w-6" />
          </div>
          {/* Title */}
          <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors pt-2">
            Pemrosesan Cepat
          </h4>
          {/* Description */}
          <p className="text-slate-400 text-sm leading-relaxed">
            Sistem manajemen stok otomatis dan real-time. Barang pesanan Anda langsung siap diambil atau diantar setelah checkout.
          </p>
        </CardContent>
      </Card>

      {/* Feature 3 - Akses Fleksibel */}
      <Card className="border border-slate-900 bg-slate-900/40 shadow-xl hover:border-slate-800 hover:bg-slate-900/70 transition-all duration-300 group rounded-2xl backdrop-blur-sm overflow-hidden">
        <CardContent className="p-8 space-y-4">
          {/* Icon Wrapper */}
          <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300">
            <Clock className="h-6 w-6" />
          </div>
          {/* Title */}
          <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors pt-2">
            Akses Fleksibel 24/7
          </h4>
          {/* Description */}
          <p className="text-slate-400 text-sm leading-relaxed">
            Kelola keranjang belanja, periksa transaksi, dan pantau ketersediaan produk kantin kapan saja tanpa batasan jam sekolah.
          </p>
        </CardContent>
      </Card>

    </div>
  </div>
</section>

      {/* 3. CALL TO ACTION SECTION */}
      <section id="cta" className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <div className="bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800/80 rounded-3xl p-8 sm:p-14 text-white shadow-2xl space-y-6 relative overflow-hidden">
            
            <div className="absolute -top-10 -right-10 h-32 w-32 bg-indigo-500/5 rounded-full blur-xl" />
            
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Siap Menikmati Kemudahan Berbelanja?
            </h3>
            
            <p className="text-slate-400 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
              Masuk ke akun BrunoMart Anda sekarang, isi keranjang, dan temukan berbagai penawaran produk menarik lainnya khusus hari ini.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              {/* 🔗 FIX LINK: Diarahkan ke /auth/login sesuai sistem routing satpam */}
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold h-12 px-8 rounded-xl shadow-lg shadow-blue-600/15 transition-all">
                  Sign In Akun Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PREMIUM FOOTER */}
      {/* 🛠️ FIX BORDER: Mengubah border-slate-850 rusak menjadi border-slate-800/60 */}
      <footer className="bg-black border-t border-slate-800/60 py-10 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-300">
            <Store className="h-5 w-5 text-blue-500" /> 
            <span>Bruno<span className="text-slate-400 font-medium">Mart</span></span>
            <span className="text-slate-700 font-normal">|</span>
            <span className="text-xs text-slate-500 font-normal">© {new Date().getFullYear()}</span>
          </div>
          <p className="text-xs text-slate-500">
            Dibuat Berbasis Perangkat Lunak Terintegrasi & Modern
          </p>
        </div>
      </footer>

    </div>
  );
}