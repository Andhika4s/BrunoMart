import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  stock: number;
  category: string;
}

export function useGetProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/products');
      
      // 1. Ekstraksi data secara berlapis agar selalu mendapatkan array murni
      let rawProducts = [];
      
      if (Array.isArray(res.data)) {
        rawProducts = res.data;
      } else if (res.data && typeof res.data === 'object') {
        if (Array.isArray((res.data as any).data)) {
          rawProducts = (res.data as any).data;
        } else if ((res.data as any).products && Array.isArray((res.data as any).products)) {
          rawProducts = (res.data as any).products;
        }
      }

      // 2. Normalisasi data: Pastikan kategori seragam menggunakan UPPERCASE / Huruf Kapital
      // Agar sinkron dengan badge CSS dan tidak nge-bug karena perbedaan huruf besar/kecil
      return rawProducts.map((product: any) => ({
        ...product,
        category: product.category ? product.category.toUpperCase() : 'PAKAIAN'
      }));
    },
  });
}