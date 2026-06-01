'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { 
  ShoppingCart, 
  Loader2, 
  Calendar, 
  User, 
  MapPin, 
  CreditCard 
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Ambil seluruh data pesanan masuk dari pembeli BrunoMart
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      // ADAPTASI DI SINI: Menembak ke '/orders/admin/all' sesuai dengan @Get('admin/all') di OrderController Anda
      const response = await api.get('/orders/admin/all'); 
      
      // Mengambil data dari response structure backend ({ status: 'success', data: [...] })
      const data = response.data?.data || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error('Gagal mengambil data pesanan pembeli');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Memperbarui status pengiriman/pembayaran pesanan langsung oleh Admin
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      // ADAPTASI DI SINI: Menembak ke `/orders/admin/${orderId}/status` sesuai dengan @Put('admin/:id/status')
      await api.put(`/orders/admin/${orderId}/status`, { status: newStatus });
      
      toast.success(`Status pesanan berhasil diperbarui menjadi ${newStatus}`);
      fetchOrders(); // Refresh data agar status di UI sinkron dengan database
    } catch (error) {
      console.error(error);
      toast.error('Gagal memperbarui status transaksi');
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper styling warna badge status transaksi
  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'DELIVERED':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'PENDING':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            Manajemen Pesanan
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Verifikasi pesanan, pantau alur pengiriman, dan perbarui status transaksi BrunoMart
          </p>
        </div>

        {/* Konten Utama */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-20 text-center text-slate-400 shadow-sm">
            <Loader2 className="animate-spin mx-auto mb-3 text-blue-600" size={32} />
            <p className="text-sm font-medium">Sedang memuat data transaksi masuk...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div 
                key={order.id} 
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-slate-300 transition duration-150"
              >
                {/* Atas Card: Informasi Metadata Invoice */}
                <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4 text-sm">
                  <div className="flex flex-wrap items-center gap-4 text-slate-600">
                    <div>
                      <span className="text-xs font-bold text-slate-400 block tracking-wider">NOMOR INVOICE</span>
                      <span className="font-mono font-bold text-slate-800">#ORD-{order.id.toString().substring(0, 8).toUpperCase()}</span>
                    </div>
                    <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 block tracking-wider">TANGGAL PESAN</span>
                      <span className="flex items-center gap-1.5 font-medium text-slate-700 mt-0.5">
                        <Calendar size={14} />
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        }) : '-'}
                      </span>
                    </div>
                  </div>

                  {/* Pengubah Status Transaksi (Verify Dropdown) */}
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-black border rounded-lg tracking-wide ${getStatusBadge(order.status)}`}>
                      {order.status || 'PENDING'}
                    </span>
                    
                    <select
                      disabled={updatingId === order.id}
                      value={order.status || 'PENDING'}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl text-xs font-bold p-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition shadow-sm cursor-pointer"
                    >
                      <option value="PENDING">⏱️ PENDING</option>
                      <option value="DELIVERED">🚚 DELIVERED</option>
                      <option value="COMPLETED">✅ COMPLETED</option>
                      <option value="CANCELLED">❌ CANCELLED</option>
                    </select>
                  </div>
                </div>

                {/* Tengah Card: Rincian Barang Belanjaan & Informasi Logistik */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm">
                  
                  {/* Daftar Item Belanjaan */}
                  <div className="lg:col-span-2 space-y-4">
                    <h4 className="font-bold text-slate-400 text-xs tracking-wider mb-2">DAFTAR BARANG BELANJA</h4>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                          <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden border">
                            {item.product?.image ? (
                              <img 
                                src={item.product.image.startsWith('http') ? item.product.image : `http://localhost:5000/${item.product.image}`} 
                                alt={item.product?.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ShoppingCart size={18} className="text-slate-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <span className="font-bold text-slate-800 block">{item.product?.name || 'Produk BrunoMart'}</span>
                            <span className="text-xs text-slate-400">{item.quantity} barang x Rp{(item.price || 0).toLocaleString()}</span>
                          </div>
                          <div className="text-right font-mono font-bold text-slate-700">
                            Rp{((item.price || 0) * (item.quantity || 0)).toLocaleString()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">Tidak ada rincian item produk.</p>
                    )}
                  </div>

                  {/* Profil Informasi Pengiriman */}
                  <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/60 space-y-4">
                    <div>
                      <h4 className="font-bold text-slate-400 text-xs tracking-wider mb-2 flex items-center gap-1.5">
                        <User size={13} /> DATA PEMBELI
                      </h4>
                      <p className="font-bold text-slate-800">{order.user?.name || 'Pelanggan Anonim'}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{order.user?.email || '-'}</p>
                    </div>

                    <div className="border-t border-slate-200 pt-3">
                      <h4 className="font-bold text-slate-400 text-xs tracking-wider mb-1.5 flex items-center gap-1.5">
                        <MapPin size={13} /> ALAMAT TUJUAN
                      </h4>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">{order.address || 'Ambil di Toko / Belum Diisi'}</p>
                    </div>

                    <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-400 text-xs tracking-wider flex items-center gap-1.5">
                          <CreditCard size={13} /> METODE BAYAR
                        </h4>
                        <p className="text-xs font-bold text-slate-700 mt-1 uppercase tracking-wide bg-white px-2 py-0.5 rounded border inline-block">
                          {order.paymentMethod || 'COD'}
                        </p>
                      </div>
                      <div className="text-right">
                        <h4 className="font-bold text-slate-400 text-xs tracking-wider">TOTAL INVOICE</h4>
                        <p className="text-xl font-black font-mono text-blue-600 mt-0.5">
                          Rp{(order.totalAmount || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border p-16 text-center text-slate-500 font-medium shadow-sm">
            <ShoppingCart className="mx-auto text-slate-300 mb-3" size={40} />
            Belum ada pesanan masuk dari pembeli BrunoMart untuk diproses.
          </div>
        )}

      </div>
    </div>
  );
}