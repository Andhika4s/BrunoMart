import { create } from 'zustand';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { LoginInput, RegisterInput } from '../types/auth.schema';
import { setCookie, deleteCookie, getCookie } from 'cookies-next';

// ==========================================
// 1. INTERFACE & TYPES DEFINITION
// ==========================================
interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

interface AuthResponse {
  user: User;
  token: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  initializeAuth: () => void; // <-- Fungsi adaptasi baru untuk sync cookies
}

// ==========================================
// Helper Fungsi untuk Mengambil Data User dari Jwt/Cookie (Jika dibutuhkan)
// ==========================================
const getInitialUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const token = getCookie('token');
  const role = getCookie('role') as 'USER' | 'ADMIN' | undefined;
  
  // Jika cookie token ada, kita buat objek user bayangan agar state tidak bernilai null
  if (token && role) {
    return {
      id: '', // Bisa dikosongkan atau diisi id sementara, backend akan memvalidasi via token
      email: '',
      name: 'User', 
      role: role,
    };
  }
  return null;
};

// ==========================================
// 2. ZUSTAND GLOBAL STORE (State Management)
// ==========================================
export const useAuthStore = create<AuthState>((set) => ({
  // Adaptasi 1: Set initial state langsung ngecek cookies saat pertama kali store di-load di client
  user: getInitialUser(),
  
  setUser: (user) => set({ user }),
  
  logout: () => {
    deleteCookie('token');
    deleteCookie('role');
    set({ user: null });
  },

  // Adaptasi 2: Fungsi untuk dipanggil di root layout / provider jika ingin sinkronisasi lebih akurat
  initializeAuth: () => {
    const user = getInitialUser();
    if (user) set({ user });
  }
}));

// ==========================================
// 3. REACT QUERY MUTATIONS (API Handlers)
// ==========================================

// --- Hook untuk Sign In (Login) ---
// --- Hook untuk Sign In (Login) ---
export function useLoginMutation() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await api.post<any>('/auth/login', data); // Ubah sementara ke <any> untuk debugging struktur
      return res.data; 
    },
    onSuccess: (data) => {
      // 1. Ambil token dengan toleransi berbagai macam penamaan dari backend
      const token = data.token || data.access_token || data.accessToken;
      
      // 2. Ambil data role dan user dengan toleransi fallback jika backend pelit data
      const userRole = data.role || data.user?.role || 'USER';
      
      // Buat objek user aman
      const userData = data.user || {
        id: data.userId || '',
        email: data.email || '',
        name: data.name || 'User BrunoMart',
        role: userRole
      };

      // JIKA TOKEN TIDAK ADA, KITA LEMPAR ERROR KE ONERROR CAUGHT
      if (!token) {
        throw new Error('Backend tidak mengirimkan token jwt (access_token)!');
      }

      // 3. Simpan ke cookies (aktif selama 1 hari)
      setCookie('token', token, { maxAge: 60 * 60 * 24 });
      setCookie('role', userRole, { maxAge: 60 * 60 * 24 });
      
      // 4. Simpan data user ke dalam state global Zustand
      setUser(userData);
    },
  });
}

// --- Hook untuk Sign Up (Register) ---
export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const res = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password
      });
      return res.data;
    },
  });
}