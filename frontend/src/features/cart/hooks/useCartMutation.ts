    import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useAddToCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      // Menembak endpoint backend sesuai dokumentasi Postman kamu: PUT /api/cart
      const res = await api.put('/cart', { productId, quantity });
      return res.data;
    },
    onSuccess: () => {
      // 💡 KUNCI SINKRONISASI: Paksa React Query untuk mengambil data keranjang terbaru
      // Ini akan membuat angka di Navbar global langsung ter-update otomatis!
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}