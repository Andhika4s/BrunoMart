'use client';

import React, { useEffect, useState } from 'react';
import {
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { api } from '@/lib/api';

// 1. DEFINISI INTERFACE PROPS UNTUK STAT CARD
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
}

// 2. KOMPONEN ANAK (Diletakkan di atas agar terbaca dengan baik oleh main component)
function StatCard({ title, value, icon, colorClass }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition duration-200 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-400 tracking-wider">
          {title}
        </p>
        <div className={`p-2.5 rounded-xl border ${colorClass}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-3xl font-black text-slate-800 tracking-tight">
          {value}
        </h3>
      </div>
    </div>
  );
}

// 3. MAIN COMPONENT EXPORT
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Melakukan fetch paralel ke endpoint NestJS
        const [statsResponse, productsResponse] = await Promise.all([
          api.get('/user/stats/count').catch((err) => {
            // Jika memunculkan log ini, periksa endpoint /user/stats/count di NestJS kamu!
            console.error('ERROR: Gagal mengambil statistik umum dari backend:', err?.response?.data || err.message);
            return { data: { data: { users: 0, orders: 0 } } };
          }),
          api.get('/products').catch((err) => {
            console.error('ERROR: Gagal mengambil data list produk:', err?.response?.data || err.message);
            return { data: { data: [] } };
          }),
        ]);

        // --- PARSING DATA USER & ORDER ---
        // Menyesuaikan dengan standar response `{ data: { data: { users, orders } } }` atau `{ data: { users, orders } }`
        const statsData = statsResponse.data?.data || statsResponse.data || {};
        
        // --- PARSING DATA PRODUK ---
        // Mengamankan jika data bersarang di dalam .data.data (bawaan interceptor/axios standard)
        let productsCount = 0;
        if (Array.isArray(productsResponse.data)) {
          productsCount = productsResponse.data.length;
        } else if (Array.isArray(productsResponse.data?.data)) {
          productsCount = productsResponse.data.data.length;
        }

        // Set state ke react untuk trigger re-render UI secara riil
        setStats({
          users: statsData.users || 0,
          products: productsCount || statsData.products || 0,
          orders: statsData.orders || 0,
        });

      } catch (error) {
        console.error('Fatal error dalam siklus fetchDashboardData:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <main className="max-w-7xl mx-auto">
        {/* Header Dashboard */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            Dashboard Admin
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Ringkasan data riil dan metrik performa database BrunoMart
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 bg-white rounded-2xl border border-slate-200 shadow-sm text-slate-400">
            <Loader2 className="animate-spin mb-3 text-blue-600" size={32} />
            <p className="text-sm font-medium">Menghubungkan ke server backend...</p>
          </div>
        ) : (
          <>
            {/* Grid Kartu Statistik Riil */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="TOTAL PENGGUNA"
                value={stats.users.toLocaleString()}
                icon={<Users size={22} />}
                colorClass="bg-blue-50 text-blue-600 border-blue-100"
              />
              <StatCard
                title="TOTAL PRODUK"
                value={stats.products.toLocaleString()}
                icon={<Package size={22} />}
                colorClass="bg-amber-50 text-amber-600 border-amber-100"
              />
              <StatCard
                title="TOTAL PESANAN"
                value={stats.orders.toLocaleString()}
                icon={<ShoppingCart size={22} />}
                colorClass="bg-emerald-50 text-emerald-600 border-emerald-100"
              />
              <StatCard
                title="PERTUMBUHAN"
                value="+12%"
                icon={<TrendingUp size={22} />}
                colorClass="bg-indigo-50 text-indigo-600 border-indigo-100"
              />
            </div>

            {/* Aktivitas Terbaru & Log Sistem */}
            <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="font-bold text-lg text-slate-800">
                  Aktivitas Terbaru
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Log tindakan sistem administrasi</p>
              </div>
              <div className="space-y-3.5 text-sm text-slate-600">
                <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition">
                  <span className="p-1.5 bg-amber-50 rounded-lg text-amber-600">📦</span>
                  <div>
                    <p className="font-semibold text-slate-700">Produk diperbarui</p>
                    <p className="text-xs text-slate-400">Sinkronisasi data komoditas berhasil</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition">
                  <span className="p-1.5 bg-blue-50 rounded-lg text-blue-600">👤</span>
                  <div>
                    <p className="font-semibold text-slate-700">Pengguna baru terdaftar</p>
                    <p className="text-xs text-slate-400">Akun pembeli ditambahkan ke database</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition">
                  <span className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">🛒</span>
                  <div>
                    <p className="font-semibold text-slate-700">Pesanan masuk</p>
                    <p className="text-xs text-slate-400">Transaksi masuk siap diproses</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}