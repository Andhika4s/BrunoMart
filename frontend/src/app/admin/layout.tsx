'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/common/Sidebar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Fungsi pembantu untuk mengambil data dari cookie browser
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const token = getCookie('token');
    const role = getCookie('role');

    // 🔒 PROTEKSI UTAMA: Jika user coba nembak URL admin tanpa token atau bukan ADMIN
    if (!token || role !== 'ADMIN') {
      setIsAuthorized(false);
      // Gunakan .replace agar rute admin yang ditembak tidak masuk ke history browser (gabisa di-back)
      router.replace('/auth/login'); 
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // Selama pengecekan cookie berlangsung, tampilkan loading screen.
  // Ini penting agar konten halaman admin tidak "berkedip" (flash content) sebelum ditendang.
  if (!isAuthorized) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-100">
        <Loader2 className="animate-spin text-blue-600 mb-2" size={36} />
        <p className="text-sm font-semibold text-slate-500 tracking-wide animate-pulse">
          Memeriksa Hak Akses BrunoMart...
        </p>
      </div>
    );
  }

  // Jika lolos verifikasi (Token ada & Role === ADMIN), tampilkan dashboard lengkap beserta sidebar
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar /> {/* Sidebar ini akan tetap ada */}
      <main className="flex-1 overflow-y-auto">
        {children} {/* Konten halaman (products, dashboard, dll) akan berganti di sini */}
      </main>
    </div>
  );
}