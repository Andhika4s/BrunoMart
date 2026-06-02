'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@/features/auth/types/auth.schema';
import { useRegisterMutation } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // PERBAIKAN: Import Link wajib dari next/link
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  const router = useRouter();
  const { mutate: registerUser, isPending } = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

const onSubmit = (data: RegisterInput) => {
    // PENGAMAN UTAMA: Jika status sedang pending, langsung batalkan request tambahan
    if (isPending) return;

    registerUser(data, {
      onSuccess: () => {
        alert('Registrasi berhasil! Silakan masuk menggunakan akun baru Anda.');
        router.push('/auth/login');
      },
      onError: (error: any) => {
        // Hanya tampilkan error jika ini bukan akibat double klik ter-cache
        const message = error?.response?.data?.message || 'Terjadi kesalahan saat registrasi.';
        alert(message);
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg bg-white border border-gray-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-center text-slate-900">
            Daftar Akun BrunoMart
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Lengkapi data di bawah untuk mulai membuat akun belanja Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Input Nama Lengkap */}
            <div className="space-y-2 text-black">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" type="text" placeholder="Andhika Dwi" {...register('name')} />
              {errors.name && <p className="text-xs font-medium text-red-500">{errors.name.message}</p>}
            </div>
            
            {/* Input Email */}
            <div className="space-y-2 text-black"> 
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="andhika@example.com" {...register('email')} />
              {errors.email && <p className="text-xs font-medium text-red-500">{errors.email.message}</p>}
            </div>

            {/* Input Password */}
            <div className="space-y-2 text-black">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
              {errors.password && <p className="text-xs font-medium text-red-500">{errors.password.message}</p>}
            </div>

            {/* Input Konfirmasi Password */}
            <div className="space-y-2 text-black">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" {...register('confirmPassword')} />
              {errors.confirmPassword && <p className="text-xs font-medium text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            {/* Tombol Submit */}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isPending}>
              {isPending ? 'Mendaftar...' : 'Daftar Sekarang'}
            </Button>

            {/* Navigasi Menggunakan Komponen Link Yang Benar */}
            <div className="text-center text-sm text-gray-600 pt-2">
              Sudah punya akun?{' '}
              <Link href="/auth/login" className="font-semibold text-blue-600 hover:underline">
                Masuk di sini
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}