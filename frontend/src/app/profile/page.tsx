'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Loader2, User, Mail, Shield, ArrowLeft } from 'lucide-react'; // Tambahkan ArrowLeft
import { useRouter } from 'next/navigation'; // Tambahkan useRouter
import { Button } from '@/components/ui/button'; // Pastikan path ini benar

export default function ProfilePage() {
  const router = useRouter(); // Inisialisasi router
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/user/profile');
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center pt-24">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center pt-24 text-red-500 font-bold">
        Gagal memuat profil. Pastikan Anda sudah login.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-4">
      <div className="max-w-md mx-auto">
        
        {/* TAMBAHKAN TOMBOL KEMBALI DI SINI */}
        <Button 
          variant="ghost" 
          onClick={() => router.push('/products')} 
          className="mb-4 -ml-4 text-slate-600 hover:text-blue-600 font-bold"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Produk
        </Button>

        <div className="bg-white p-8 rounded-2xl border shadow-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-800">Profil Saya</h1>
          </div>

          <div className="space-y-6">
            {/* Field Nama, Email, Role tetap sama */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <User className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Nama</p>
                <p className="text-sm font-semibold text-slate-700">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <Mail className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Email</p>
                <p className="text-sm font-semibold text-slate-700">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <Shield className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Role</p>
                <p className="text-sm font-semibold text-slate-700">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}