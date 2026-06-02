import { create } from 'zustand';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { LoginInput, RegisterInput } from '../types/auth.schema';
import { setCookie, deleteCookie, getCookie } from 'cookies-next';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  initializeAuth: () => void;
}

const getInitialUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const token = getCookie('token');
  const role = getCookie('role') as 'USER' | 'ADMIN' | undefined;
  
  if (token && role) {
    return { id: '', email: '', name: 'User', role: role };
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getInitialUser(),
  setUser: (user) => set({ user }),
  logout: () => {
    deleteCookie('token');
    deleteCookie('role');
    set({ user: null });
  },
  initializeAuth: () => {
    const user = getInitialUser();
    if (user) set({ user });
  }
}));

// ==========================================
// REACT QUERY MUTATIONS
// ==========================================

// --- Hook untuk Sign In (Login) ---
export function useLoginMutation() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await api.post<any>('/auth/login', data);
      return res.data; 
    },
    onSuccess: (data) => {
      const token = data.token || data.access_token || data.accessToken;
      const userRole = data.role || data.user?.role || 'USER';
      
      const userData = data.user || {
        id: data.userId || '',
        email: data.email || '',
        name: data.name || 'User BrunoMart',
        role: userRole
      };

      // PERBAIKAN: Jangan pakai "throw new Error" murni di sini agar tidak bocor jadi global exception
      if (!token) {
        console.error('Token tidak ditemukan dari response login server.');
        return; 
      }

      setCookie('token', token, { maxAge: 60 * 60 * 24 });
      setCookie('role', userRole, { maxAge: 60 * 60 * 24 });
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