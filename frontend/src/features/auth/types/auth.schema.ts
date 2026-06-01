import { z } from 'zod';

// ==========================================
// 1. LOGIN SCHEMA
// ==========================================
export const loginSchema = z.object({
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  name: z.string().min(2, 'Nama minimal harus berisikan 2 karakter'), // Menyesuaikan backend Postman payload
  password: z.string().min(6, 'Password minimal harus 6 karakter'),
});

export type LoginInput = z.infer<typeof loginSchema>;


// ==========================================
// 2. SIGN UP (REGISTER) SCHEMA
// ==========================================
// Menggunakan .extend() untuk mewarisi semua field dari loginSchema
export const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  // Menambahkan validasi kustom (refine) untuk mencocokkan password
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'], // Error akan diarahkan tepat ke input confirmPassword
  });

export type RegisterInput = z.infer<typeof registerSchema>;