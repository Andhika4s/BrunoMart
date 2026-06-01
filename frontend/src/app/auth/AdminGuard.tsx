'use client';
import { useAuthStore } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Jika user belum login atau bukan ADMIN, arahkan ke login
    if (!user || user.role !== 'ADMIN') {
      router.push('/auth/login');
    }
  }, [user, router]);

  // Jika user adalah admin, tampilkan konten dashboard
  if (user && user.role === 'ADMIN') {
    return <>{children}</>;
  }

  // Tampilkan loading atau null saat pengecekan
  return <div className="flex h-screen items-center justify-center">Memvalidasi akses...</div>;
}