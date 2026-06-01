'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ClipboardList, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  // Ambil data riwayat order dari API backend
  // Ubah bagian queryFn di OrdersPage
const { data: ordersData, isLoading, isError } = useQuery<any>({
  queryKey: ['orders'],
  queryFn: async () => {
    // FIX: Menggunakan rute yang benar sesuai Controller
    const res = await api.get('/orders/my-orders'); 
    return res.data?.data ? res.data.data : res.data;
  },
  retry: 1, 
});
  // Amankan parsing array data orderan
  const orders = Array.isArray(ordersData) ? ordersData : ordersData?.orders || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-3 bg-slate-50 w-full">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Memuat riwayat pesanan Anda...</p>
      </div>
    );
  }

  // Tampilan penanganan jika endpoint /orders belum dibuat di backend NestJS Anda
  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center p-4">
        <div className="text-center py-12 px-6 bg-white border border-slate-200 rounded-2xl shadow-sm max-w-md w-full space-y-4">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto border border-amber-200">
            <AlertCircle className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Endpoint Backend Belum Siap</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Halaman Frontend Order sudah berhasil dibuat! Namun, Anda perlu menambahkan <code className="bg-slate-100 px-1 py-0.5 rounded text-red-500 font-mono">@Controller('orders')</code> di backend NestJS Anda terlebih dahulu.
            </p>
          </div>
          <Link href="/products" className="block">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold h-10 shadow-sm">
              Kembali ke Katalog Produk
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <main className="container mx-auto px-4 py-8 md:px-8 max-w-4xl">
        
        {/* Navigasi Atas */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/products" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm">
            <ArrowLeft className="h-4 w-4" />
            Lanjut Belanja
          </Link>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Pesanan Saya</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center p-6">
            <ClipboardList className="h-14 w-14 text-slate-300 mb-4" />
            <p className="text-sm font-semibold text-slate-600 mb-1">Belum Ada Riwayat Transaksi</p>
            <p className="text-xs text-slate-400 mb-5 max-w-xs">Semua data pesanan yang Anda checkout akan tercatat otomatis di halaman ini.</p>
            <Link href="/products">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold h-10 px-5 shadow-sm">
                Cari Produk Sekarang
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Card key={order.id} className="overflow-hidden shadow-sm border-slate-200 bg-white rounded-2xl">
                <CardHeader className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between flex-wrap gap-2">
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">ID PESANAN</p>
                    <p className="font-mono text-xs text-slate-700 font-bold">#{order.id.substring(0, 8).toUpperCase()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      {order.status || 'SUCCESS'}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 space-y-4">
                  <div className="divide-y divide-slate-100">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-slate-800 truncate">{item.product?.name || 'Produk BrunoMart'}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{item.quantity} x Rp {(item.price || item.product?.price || 0).toLocaleString('id-ID')}</p>
                        </div>
                        <p className="font-bold text-sm text-slate-700 shrink-0">
                          Rp {((item.price || item.product?.price || 0) * item.quantity).toLocaleString('id-ID')}
                        </p>
                      </div>
                    ))}
                  </div>    
            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <p className="text-xs font-bold text-slate-500">Total Pembayaran</p>
              <p className="font-extrabold text-base text-blue-600">
                {/* Mengakses field totalAmount dari backend */}
                Rp {(order.totalAmount || 0).toLocaleString('id-ID')}
              </p>
            </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}