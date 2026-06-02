'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  Clock,
  ArrowRight,
  Store,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ─────────────────────────────────────────────
   BRUNOMART LANDING PAGE
   Aesthetic: refined dark-commerce
   Palette: slate-950 base / blue-500 accent
   Typography: tight tracking, bold hierarchy
───────────────────────────────────────────── */

const FEATURES = [
  {
    icon: ShieldCheck,
    color: 'blue',
    title: 'Keamanan Terjamin',
    desc: 'Autentikasi menggunakan enkripsi end-to-end. Saldo dan data akun Anda terlindungi setiap saat.',
  },
  {
    icon: Truck,
    color: 'indigo',
    title: 'Pemrosesan Cepat',
    desc: 'Manajemen stok real-time. Pesanan langsung siap diambil atau diantar setelah checkout.',
  },
  {
    icon: Clock,
    color: 'sky',
    title: 'Akses 24/7',
    desc: 'Pantau keranjang, transaksi, dan ketersediaan produk kantin kapan saja tanpa batas jam sekolah.',
  },
];

const COLOR_MAP: Record<string, { icon: string; label: string; ring: string }> = {
  blue:   { icon: 'text-blue-400',  label: 'group-hover:text-blue-400',  ring: 'border-blue-500/20 bg-blue-500/10 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600' },
  indigo: { icon: 'text-indigo-400', label: 'group-hover:text-indigo-400', ring: 'border-indigo-500/20 bg-indigo-500/10 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600' },
  sky:    { icon: 'text-sky-400',    label: 'group-hover:text-sky-400',    ring: 'border-sky-500/20 bg-sky-500/10 group-hover:bg-sky-600 group-hover:text-white group-hover:border-sky-600' },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased overflow-x-hidden selection:bg-blue-600 selection:text-white font-sans">

      {/* ── NAVBAR ── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2 font-bold text-white">
            <Store className="h-5 w-5 text-blue-500" />
            <span>Bruno<span className="font-medium text-slate-400">Mart</span></span>
          </div>
          <Link href="/auth/login">
            <Button
              size="sm"
              className="h-8 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-500"
            >
              Masuk
            </Button>
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative flex min-h-screen items-center justify-center pt-14">

        {/* Background glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/8 blur-[140px]" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-indigo-500/6 blur-[120px]" />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-4 py-24 sm:px-6 lg:grid-cols-2">

          {/* Left — Text */}
          <div className="space-y-8 text-center lg:text-left">

            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/8 px-3 py-1 text-xs font-medium text-blue-400">
              <Sparkles className="h-3 w-3 animate-pulse" />
              E-Commerce Sekolah Modern v2.0
            </span>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl xl:text-6xl">
              Penuhi Kebutuhan{' '}
              <br className="hidden sm:block" />
              Harianmu di{' '}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                BrunoMart
              </span>
            </h1>

            {/* Subtext */}
            <p className="mx-auto max-w-md text-base leading-relaxed text-slate-400 lg:mx-0">
              Platform belanja digital yang praktis, cepat, dan aman — dirancang khusus untuk menyederhanakan transaksi seluruh komunitas sekolah dalam satu ketukan.
            </p>

            {/* CTAs */}
            <div className="flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link href="/products" className="w-full sm:w-auto">
                <Button className="h-11 w-full rounded-xl bg-blue-600 px-6 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 hover:scale-[1.02] sm:w-auto">
                  Mulai Belanja <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-xl border-slate-700 bg-slate-900/50 px-6 font-semibold text-slate-300 backdrop-blur transition hover:bg-slate-800 hover:text-white sm:w-auto"
                >
                  Buat Akun Baru
                </Button>
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex items-center justify-center gap-6 pt-2 lg:justify-start">
              {['Aman & Terenkripsi', 'Stok Real-time', 'Gratis Daftar'].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — App card */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-600/20 to-indigo-500/10 blur-3xl" />

            <div className="relative w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">

              {/* Window chrome */}
              <div className="mb-5 flex items-center justify-between border-b border-slate-900 pb-4">
                <div className="flex gap-1.5">
                  {['bg-red-500/60', 'bg-yellow-500/60', 'bg-green-500/60'].map((c) => (
                    <div key={c} className={`h-2.5 w-2.5 rounded-full ${c}`} />
                  ))}
                </div>
                <span className="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  Secure Live
                </span>
              </div>

              {/* Icon */}
              <div className="flex flex-col items-center py-8">
                <div className="relative">
                  <div className="absolute inset-0 animate-pulse rounded-2xl bg-blue-500/20 blur-xl" />
                  <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/20">
                    <Store className="h-10 w-10 text-white" />
                  </div>
                </div>
                <p className="mt-5 text-lg font-bold tracking-wide text-white">BrunoMart App</p>
                <p className="mt-1 text-xs text-slate-500">Aman · Cepat · Terintegrasi</p>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 px-4 py-3 text-xs backdrop-blur">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Sistem Siap Digunakan
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-600" />
              </div>

              {/* Stat row */}
              <div className="mt-4 grid grid-cols-3 divide-x divide-slate-800/60 rounded-xl border border-slate-800/60 bg-slate-900/40 text-center">
                {[['500+', 'Produk'], ['1K+', 'Pengguna'], ['99%', 'Uptime']].map(([n, l]) => (
                  <div key={l} className="px-3 py-3">
                    <p className="text-sm font-bold text-white">{n}</p>
                    <p className="text-[10px] text-slate-500">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="border-y border-slate-800/60 bg-slate-950 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">

          <div className="mb-16 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-500">Keunggulan Utama</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Mengapa Memilih BrunoMart?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-400">
              Pengalaman belanja online terbaik di ekosistem sekolah dengan jaminan kenyamanan ekstra.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {FEATURES.map(({ icon: Icon, color, title, desc }) => {
              const c = COLOR_MAP[color];
              return (
                <div
                  key={title}
                  className="group rounded-2xl border border-slate-800/60 bg-slate-900/20 p-8 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/60"
                >
                  <div
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300 ${c.icon} ${c.ring}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className={`mb-2 text-base font-bold text-white transition-colors duration-200 ${c.label}`}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/5 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-950 px-8 py-14 text-center shadow-2xl sm:px-14">
            {/* Corner accent */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/8 blur-2xl" />

            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Siap Menikmati Kemudahan Berbelanja?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-400">
              Masuk sekarang, isi keranjang, dan temukan berbagai penawaran produk menarik khusus hari ini.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/auth/login">
                <Button className="h-11 rounded-xl bg-blue-600 px-8 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500">
                  Sign In Sekarang
                </Button>
              </Link>
              <Link href="/products">
                <Button
                  variant="ghost"
                  className="h-11 rounded-xl px-8 font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  Lihat Produk
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-800/60 bg-black py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
            <Store className="h-4 w-4 text-blue-500" />
            Bruno<span className="font-medium text-slate-500">Mart</span>
            <span className="text-slate-700">|</span>
            <span className="text-xs font-normal text-slate-600">© {new Date().getFullYear()}</span>
          </div>
          <p className="text-xs text-slate-600">
            Dibuat berbasis perangkat lunak terintegrasi &amp; modern
          </p>
        </div>
      </footer>

    </div>
  );
}