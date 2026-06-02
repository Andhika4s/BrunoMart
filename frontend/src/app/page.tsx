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
    <div className="min-h-screen overflow-x-hidden bg-slate-950 font-sans text-slate-100 selection:bg-blue-600 selection:text-white">
      
      {/* 1. HERO SECTION WITH AMBIENT GLOW */}
      <section className="relative flex min-h-[90vh] items-center justify-center border-b border-slate-800/60 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black py-20 lg:py-32">
        {/* Decorative Background Glows */}
        <div className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-10 right-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="container relative z-10 mx-auto max-w-6xl px-4 grid grid-cols-1 gap-12 items-center lg:grid-cols-12">
          {/* Hero Text */}
          <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium tracking-wide text-blue-400 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-blue-400" /> 
              <span>E-Commerce Sekolah Modern v2.0</span>
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight leading-[1.1] text-white sm:text-5xl lg:text-6xl">
              Penuhi Kebutuhan Harianmu di{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
                BrunoMart
              </span>
            </h1>
            
            <p className="mx-auto max-w-xl text-base text-slate-400 leading-relaxed sm:text-lg lg:mx-0">
              Platform belanja digital praktis, cepat, dan aman yang dirancang khusus untuk menyederhanakan transaksi seluruh komunitas BrunoMart dalam satu ketukan.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row lg:justify-start">
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:scale-[1.02] hover:bg-blue-700">
                  Mulai Belanja <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-semibold text-white backdrop-blur-sm transition-all hover:bg-blue-700">
                  Buat Akun Baru
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Interactive Hero Visual */}
          <div className="group relative flex justify-center lg:col-span-5 lg:justify-end">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 opacity-15 blur-2xl transition-opacity duration-500 group-hover:opacity-25" />
            
            <div className="relative flex aspect-square w-full max-w-[400px] flex-col justify-between rounded-3xl border border-slate-800 bg-slate-950 p-8 shadow-2xl transition-colors duration-300 group-hover:border-slate-700/80">
              {/* Top bar window control simulator */}
              <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="rounded border border-slate-800/60 bg-slate-900 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  Secure Live Connect
                </span>
              </div>

              {/* Animated Center Icon */}
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
                  <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/10">
                    <Store className="h-10 w-10" />
                  </div>
                </div>
                <p className="mt-6 text-xl font-bold tracking-wide text-white">BrunoMart App</p>
                <p className="mt-1 text-xs text-slate-500">Aman • Cepat • Terintegrasi</p>
              </div>

              {/* Interactive bottom status bar */}
              <div className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 text-xs backdrop-blur-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="h-2 w-2 animate-ping rounded-full bg-emerald-500" />
                  <span>Sistem Siap Digunakan</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION (KEUNGGULAN) */}
      <section id="features" className="relative border-b border-slate-900 bg-slate-950 py-24">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Header Section */}
          <div className="mx-auto mb-20 max-w-2xl text-center space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-500">Keunggulan Utama</h2>
            <h3 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Mengapa Harus Memilih BrunoMart?
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed sm:text-base">
              Kami menghadirkan pengalaman belanja online terbaik di ekosistem sekolah dengan jaminan kenyamanan ekstra.
            </p>
          </div>

          {/* Grid Cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1 - Keamanan */}
            <Card className="group overflow-hidden rounded-2xl border border-slate-900 bg-slate-900/40 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-slate-800 hover:bg-slate-900/70">
              <CardContent className="p-8 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h4 className="pt-2 text-lg font-bold text-white transition-colors group-hover:text-blue-400">
                  Keamanan Terjamin
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Autentikasi menggunakan enkripsi data ketat end-to-end, memastikan saldo dan rahasia akun Anda aman sepanjang waktu.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 - Pemrosesan Cepat */}
            <Card className="group overflow-hidden rounded-2xl border border-slate-900 bg-slate-900/40 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-slate-800 hover:bg-slate-900/70">
              <CardContent className="p-8 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white">
                  <Truck className="h-6 w-6" />
                </div>
                <h4 className="pt-2 text-lg font-bold text-white transition-colors group-hover:text-indigo-400">
                  Pemrosesan Cepat
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Sistem manajemen stok otomatis dan real-time. Barang pesanan Anda langsung siap diambil atau diantar setelah checkout.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 - Akses Fleksibel */}
            <Card className="group overflow-hidden rounded-2xl border border-slate-900 bg-slate-900/40 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-slate-800 hover:bg-slate-900/70">
              <CardContent className="p-8 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white">
                  <Clock className="h-6 w-6" />
                </div>
                <h4 className="pt-2 text-lg font-bold text-white transition-colors group-hover:text-cyan-400">
                  Akses Fleksibel 24/7
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Kelola keranjang belanja, periksa transaksi, dan pantau ketersediaan produk kantin kapan saja tanpa batasan jam sekolah.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. CALL TO ACTION SECTION */}
      <section id="cta" className="relative overflow-hidden bg-slate-950 py-24">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/5 blur-[120px]" />
        
        <div className="container relative z-10 mx-auto max-w-4xl text-center">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-950 to-slate-900 p-8 text-white shadow-2xl space-y-6 sm:p-14">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/5 blur-xl" />
            
            <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Siap Menikmati Kemudahan Berbelanja?
            </h3>
            
            <p className="mx-auto max-w-lg text-sm text-slate-400 leading-relaxed sm:text-base">
              Masuk ke akun BrunoMart Anda sekarang, isi keranjang, dan temukan berbagai penawaran produk menarik lainnya khusus hari ini.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button size="lg" className="h-12 w-full rounded-xl bg-blue-600 px-8 font-semibold text-white shadow-lg shadow-blue-600/15 transition-all hover:bg-blue-500">
                  Sign In Akun Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PREMIUM FOOTER */}
      <footer className="relative z-10 border-t border-slate-800/60 bg-black py-10">
        <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2 font-bold text-slate-300">
            <Store className="h-5 w-5 text-blue-500" /> 
            <span>Bruno<span className="font-medium text-slate-400">Mart</span></span>
            <span className="font-normal text-slate-700">|</span>
            <span className="text-xs font-normal text-slate-500">© {new Date().getFullYear()}</span>
          </div>
          <p className="text-xs text-slate-500">
            Dibuat Berbasis Perangkat Lunak Terintegrasi & Modern
          </p>
        </div>
      </footer>

    </div>
  );
}