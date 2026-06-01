import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: { id: string; name: string; price: number }) => void;
  getTotalItems: () => number;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addToCart: (product) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);
      
      if (existingItem) {
        // Jika produk sudah ada di cart, tambahkan quantity-nya
        return {
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      
      // Jika produk baru, masukkan ke dalam array
      return { items: [...state.items, { ...product, quantity: 1 }] };
    });
  },

  // Helper untuk menghitung total kuantitas barang di keranjang
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  clearCart: () => set({ items: [] }),
}));