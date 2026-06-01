'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, Minus, ShoppingBag, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const BACKEND_STATIC_URL = 'http://localhost:5000';

export default function CartPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // State untuk Data Checkout
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('TRANSFER_BANK');

  // 1. AMBIL DATA KERANJANG
  const { data: cartData, isLoading, isError } = useQuery<any>({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await api.get('/cart');
      return res.data?.data ? res.data.data : res.data;
    },
  });

  const cart = cartData?.items ? cartData : { items: cartData?.data?.items || cartData?.items || [] };

  // 2. MUTASI UPDATE QUANTITY
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, productId, quantity }: { itemId: string; productId: string; quantity: number }) => {
      try {
        return await api.put(`/cart/${itemId}`, { quantity });
      } catch (err) {
        return await api.put('/cart', { productId, quantity });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    onError: (error: any) => toast.error(error.response?.data?.message || 'Gagal mengubah jumlah.'),
  });

  // 3. MUTASI HAPUS ITEM
  const deleteItemMutation = useMutation({
    mutationFn: async ({ itemId }: { itemId: string }) => await api.delete(`/cart/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Produk dihapus');
    },
  });

  // 4. MUTASI CHECKOUT (Dengan Data DTO yang lengkap)
  // Ubah bagian checkoutMutation di CartPage
const checkoutMutation = useMutation({
  mutationFn: async () => {
    // Tambahkan trim() untuk memastikan alamat tidak hanya spasi
    if (!address.trim()) throw new Error('Alamat wajib diisi');
    
    return await api.post('/orders/checkout', {
      address: address.trim(),
      paymentMethod: paymentMethod
    });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    toast.success('Checkout berhasil!');
    router.push('/orders');
  },
  onError: (error: any) => {
    // Menampilkan pesan error spesifik dari backend jika ada
    const message = error.response?.data?.message || 'Gagal checkout.';
    toast.error(Array.isArray(message) ? message[0] : message);
  }
});

  const totalCartItems = cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
  const totalPrice = cart?.items?.reduce((acc: number, item: any) => acc + ((item.product?.price || 0) * item.quantity), 0) || 0;

  if (isLoading) return <div className="flex justify-center pt-24"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <main className="container mx-auto px-4 max-w-5xl">
        <div className="mb-6">
          <Link href="/products" className="text-xs font-bold text-slate-600 border px-3 py-2 rounded-xl bg-white">
            <ArrowLeft className="inline h-3 w-3 mr-1" /> Kembali Belanja
          </Link>
        </div>

        {!cart.items || cart.items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border">
            <ShoppingBag className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-4">Keranjang kosong.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item: any) => (
                <Card key={item.id} className="p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold">{item.product?.name}</h3>
                    <p className="text-blue-600 font-bold">Rp {(item.product?.price || 0).toLocaleString('id-ID')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => updateQuantityMutation.mutate({ itemId: item.id, productId: item.productId, quantity: item.quantity - 1 })}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center font-bold">{item.quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => updateQuantityMutation.mutate({ itemId: item.id, productId: item.productId, quantity: item.quantity + 1 })}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteItemMutation.mutate({ itemId: item.id })}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Card>
              ))}
            </div>

            <div className="h-fit bg-white p-6 rounded-xl border shadow-sm space-y-4">
              <h2 className="font-bold border-b pb-2">Ringkasan Belanja</h2>
              <div className="flex justify-between text-sm"><span>Total Harga</span> <span className="font-bold text-blue-600">Rp {totalPrice.toLocaleString('id-ID')}</span></div>
              
              {/* Form Input Checkout */}
              <div className="space-y-3 pt-4 border-t">
                <input className="w-full text-xs p-2 border rounded" placeholder="Alamat Pengiriman" value={address} onChange={(e) => setAddress(e.target.value)} />
                <select className="w-full text-xs p-2 border rounded" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option value="TRANSFER_BANK">Transfer Bank</option>
                  <option value="E_WALLET">E-Wallet</option>
                </select>
              </div>

              <Button 
                className="w-full bg-blue-600 text-white font-bold h-10"
                disabled={checkoutMutation.isPending || !address}
                onClick={() => checkoutMutation.mutate()}
              >
                {checkoutMutation.isPending ? 'Memproses...' : 'Checkout Sekarang'}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}