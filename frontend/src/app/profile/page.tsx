'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Loader2, User, Shield, ArrowLeft, Pencil, X, Check, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/features/auth/hooks/useAuth';

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout); // Ambil fungsi logout untuk clear session saat akun dihapus

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    oldPassword: '',
    password: '',
  });

  // Fetching data profil asli dari backend
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/user/profile');
      return res.data.data;
    },
  });

  // Sinkronisasi data profile ke form lokal menggunakan useEffect
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        email: profile.email || '',
        oldPassword: '',
        password: '',
      });
    }
  }, [profile]);

  // MUTATION 1: Update Profil
  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put(`/user/${profile.id}`, data);
      return res.data;
    },
    onSuccess: (resData) => {
      toast.success('Profil berhasil diperbarui!');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      if (resData?.data) {
        setUser(resData.data);
      }
      
      setIsEditing(false);
      setForm((prev) => ({ ...prev, oldPassword: '', password: '' }));
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Gagal memperbarui profil.';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  // MUTATION 2: Hapus Akun Mandiri (DELETE /user/me)
  const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await api.delete('/user/me');
      return res.data;
    },
    onSuccess: () => {
      toast.success('Akun Anda berhasil dihapus dari sistem BrunoMart.');
      logout(); // Bersihkan cookies token, role, dan state Zustand secara total
      router.push('/auth/login'); // Tendang ke halaman login
    },
    onError: (error: any) => {
      // Menangkap BadRequestException dari NestJS jika user masih punya transaksi aktif
      const msg = error?.response?.data?.message || 'Gagal menghapus akun.';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  const handleSubmit = () => {
    const payload: any = {};
    
    if (form.name !== profile.name) payload.name = form.name;
    if (form.email !== profile.email) payload.email = form.email;
    
    if (form.password) {
      if (!form.oldPassword) {
        toast.error('Password lama wajib diisi untuk mengganti password baru!');
        return;
      }
      payload.password = form.password;
      payload.oldPassword = form.oldPassword;
    }

    if (Object.keys(payload).length === 0) {
      toast('Tidak ada perubahan data.');
      setIsEditing(false);
      return;
    }

    updateProfile(payload);
  };

  const handleDeleteAccount = () => {
    // Pengaman utama browser modal popup konfirmasi
    const confirmDelete = window.confirm(
      'Apakah Anda yakin ingin menghapus akun BrunoMart Anda?\nSemua data profil Anda akan dihapus permanen dan tindakan ini tidak bisa dibatalkan.'
    );

    if (confirmDelete) {
      deleteAccount();
    }
  };

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
        Gagal memuat profil. Pastikan Anda sudah login kembali.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-4 pb-12">
      <div className="max-w-md mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/products')}
          className="mb-4 -ml-4 text-slate-600 hover:text-blue-600 font-bold"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Produk
        </Button>

        <div className="bg-white p-8 rounded-2xl border shadow-sm space-y-6">
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-800">Profil Saya</h1>
          </div>

          <div className="space-y-4">
            {/* Input Nama */}
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Nama Lengkap</p>
              {isEditing ? (
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="text-sm bg-white text-black border-gray-300 focus:border-blue-500"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-700">{profile.name}</p>
              )}
            </div>

            {/* Input Email */}
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Email</p>
              {isEditing ? (
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="text-sm bg-white text-black border-gray-300 focus:border-blue-500"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-700">{profile.email}</p>
              )}
            </div>

            {/* Role Tab */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <Shield className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Hak Akses / Role</p>
                <p className="text-sm font-semibold text-slate-700">{profile.role}</p>
              </div>
            </div>

            {/* Form Ganti Password */}
            {isEditing && (
              <>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-red-500 mb-1">
                    Password Lama <span className="text-slate-400">(Wajib diisi jika ganti password)</span>
                  </p>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={form.oldPassword}
                    onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
                    className="text-sm bg-white text-black border-gray-300 focus:border-blue-500"
                  />
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-blue-600 mb-1">
                    Password Baru (Minimal 6 Karakter)
                  </p>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="text-sm bg-white text-black border-gray-300 focus:border-blue-500"
                  />
                </div>
              </>
            )}
          </div>

          {/* Tombol Simpan / Batal */}
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4 mr-2" />Simpan</>}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setForm({ name: profile.name, email: profile.email, oldPassword: '', password: '' });
                  }}
                  className="flex-1 text-slate-700 hover:bg-slate-100"
                >
                  <X className="h-4 w-4 mr-2" />
                  Batal
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Profil
              </Button>
            )}
          </div>

                  {/* DANGER ZONE: Fitur Hapus Akun Sendiri */}
        {!isEditing && (
          <div className="pt-4 border-t border-red-100">
            <Button
              variant="outline" // PERBAIKAN: Diubah ke variant yang valid (outline)
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:text-red-700 shadow-none font-bold text-sm transition-colors duration-200"
            >
              {isDeleting ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Menghapus Akun...</>
              ) : (
                <><Trash2 className="h-4 w-4 mr-2" /> Hapus Akun Saya</>
              )}
            </Button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}