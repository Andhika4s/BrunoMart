'use client';

import React, { useState } from 'react';
import { useGetProducts, Product } from '@/features/auth/hooks/useProducts';
import { useAuthStore } from '@/features/auth/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 
import { api } from '@/lib/api';
import { Search, Filter, Loader2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const BACKEND_STATIC_URL = 'http://localhost:5000';

interface CartItem {
  id: string; 
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
  };
}

interface CartData {
  items: CartItem[];
}

export default function ProductsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore(); 
  const { data: products = [], isLoading, isError } = useGetProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const { data: cart } = useQuery<CartData>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!user) return { items: [] };
      try {
        const res = await api.get('/cart');
        return res.data.data ? res.data.data : res.data;
      } catch (err) {
        console.error("Gagal mengambil data cart:", err);
        return { items: [] };
      }
    },
    enabled: !!user,
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const res = await api.put(`/cart/${itemId}`, { quantity }); 
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      showSuccessToast('Kuantitas produk diperbarui!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal memperbarui keranjang.');
    }
  });

  const createCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const res = await api.post('/cart', { productId, quantity });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      showSuccessToast('Produk berhasil dimasukkan ke keranjang!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal menambahkan produk.');
    }
  });

  const showSuccessToast = (message: string) => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-[#def7ec] border border-[#bcf0da] rounded-xl p-4 flex items-start gap-3 shadow-sm mx-auto`}>
        <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-[#03543f] flex items-center justify-center text-[#03543f] text-xs font-bold mt-0.5 select-none">✓</div>
        <div className="flex-1 flex flex-col">
          <span className="text-sm font-bold text-[#03543f] leading-none">Success</span>
          <span className="text-xs text-[#03543f] mt-1 font-medium">{message}</span>
        </div>
      </div>
    ), { duration: 2500 });
  };

  const handleAddToCart = (product: Product) => {
    const existingCartItem = cart?.items?.find((item) => item.productId === product.id);
    if (existingCartItem) {
      updateCartMutation.mutate({ itemId: existingCartItem.id, quantity: existingCartItem.quantity + 1 });
    } else {
      createCartMutation.mutate({ productId: product.id, quantity: 1 });
    }
  };

  const handleActionWithAuth = (actionCallback: () => void) => {
    if (!user) {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-[#fde8e8] border border-[#fbd5d5] rounded-xl p-4 flex items-start gap-3 shadow-sm mx-auto`}>
          <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-[#9b1c1c] flex items-center justify-center text-[#9b1c1c] text-xs font-bold mt-0.5 select-none">✕</div>
          <div className="flex-1 flex flex-col">
            <span className="text-sm font-bold text-[#9b1c1c] leading-none">Error</span>
            <span className="text-xs text-[#9b1c1c] mt-1 font-medium">Kamu harus login terlebih dahulu!</span>
          </div>
        </div>
      ), { duration: 3000 });
      setTimeout(() => { router.push('/auth/login'); }, 500); 
      return;
    }
    actionCallback();
  };
  
  const productsArray = Array.isArray(products) ? products : [];
  const categories = ['Semua', ...Array.from(new Set(
    productsArray.map((p) => p?.category ? p.category.trim().toUpperCase() : 'PAKAIAN')
  ))];

  const filteredProducts = productsArray.filter((product) => {
    if (!product || !product.name) return false;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const prodCat = product.category ? product.category.trim().toUpperCase() : 'PAKAIAN';
    const selCat = selectedCategory.trim().toUpperCase();
    return (selCat === 'SEMUA' || prodCat === selCat) && matchesSearch;
  });
  
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-3 bg-slate-50 w-full">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Memuat katalog produk...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center p-4 w-full">
        <div className="text-center py-12 px-6 bg-white border border-slate-200 rounded-xl shadow-sm max-w-md w-full">
          <p className="text-red-500 font-bold text-sm">Gagal memuat katalog produk.</p>
          <p className="text-xs text-slate-400 mt-1.5">Pastikan service backend BrunoMart Anda sudah diaktifkan.</p>
        </div>
      </div>
    );
  }

 return (
    // 💡 FIX AMAN: Ditambahkan pt-20 agar konten turun dan tidak ketutupan Navbar sticky/fixed
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 flex justify-center items-start pt-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* JUDUL & KONTROL BAR - DI-CENTER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-full">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari produk impianmu di BrunoMart..."
              className="pl-9 border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-xs rounded-xl h-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none max-w-full">
            <Filter className="h-4 w-4 text-slate-400 hidden sm:block shrink-0" />
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory.toUpperCase() === category.toUpperCase() ? 'default' : 'outline'}
                className={`rounded-full shrink-0 text-xs h-8 ${
                  selectedCategory.toUpperCase() === category.toUpperCase() 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white border-transparent' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600 bg-white'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* GRID PRODUK - DI-RESPONSIFKAN SECARA SEIMBANG */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-xl shadow-sm w-full">
            <p className="text-slate-500 font-medium">Produk tidak ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian atau ganti kategori filter Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center w-full">
            {filteredProducts.map((product: Product) => {
              let imageUrl = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop';
              
              if (product.image) {
                if (product.image.startsWith('http')) {
                  imageUrl = product.image;
                } else {
                  const cleanPath = product.image.replace(/^\/+/, '');
                  if (cleanPath.startsWith('uploads/')) {
                    imageUrl = `${BACKEND_STATIC_URL}/${cleanPath}`;
                  } else {
                    imageUrl = `${BACKEND_STATIC_URL}/uploads/${cleanPath}`;
                  }
                }
              }

              return (
                <Card key={product.id} className="flex flex-col bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all group rounded-xl overflow-hidden w-full max-w-sm mx-auto">
                  
                  {/* Container Gambar */}
                  <div className="aspect-square bg-slate-50 flex items-center justify-center relative overflow-hidden border-b border-slate-100">
                    <img 
                      src={imageUrl} 
                      alt={product.name} 
                      className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop';
                      }}
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-white/90 backdrop-blur-sm border border-slate-200 text-[10px] font-bold text-slate-600 rounded-full uppercase tracking-wider">
                      {product.category || 'PAKAIAN'}
                    </span>
                  </div>

                  {/* Informasi Produk */}
                  <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors text-sm">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {product.description || 'Tidak ada deskripsi produk.'}
                      </p>
                    </div>
                    <div className="pt-2">
                      <p className="text-base font-extrabold text-blue-600">
                        {formatRupiah(product.price)}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Stok tersedia: <span className="font-semibold text-slate-600">{product.stock}</span>
                      </p>
                    </div>
                  </CardContent>

                  {/* Aksi */}
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9 flex items-center justify-center gap-1.5 rounded-lg shadow-sm"
                      disabled={product.stock <= 0 || updateCartMutation.isPending || createCartMutation.isPending}
                      onClick={() => handleActionWithAuth(() => handleAddToCart(product))}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" /> 
                      {updateCartMutation.isPending || createCartMutation.isPending 
                        ? 'Memproses...' 
                        : product.stock > 0 
                          ? 'Tambah ke Keranjang' 
                          : 'Stok Habis'
                      }
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}