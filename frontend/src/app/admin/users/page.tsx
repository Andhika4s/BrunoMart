'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Users, Loader2, Trash2, ShieldCheck, User, Search } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fungsi untuk mengambil data seluruh pengguna dari backend
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // PERBAIKAN: Mengubah '/info' menjadi '/user' atau '/users' sesuai standard controller NestJS Anda
      // Jika di Postman Anda menggunakan base_url/user, ganti menjadi '/user'
      const response = await api.get('/user'); 
      
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error('Gagal mengambil data pengguna (Endpoint tidak ditemukan/404)');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fungsi untuk menghapus akun pengguna
  const handleDeleteUser = async (id: number | string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return;
    try {
      // PERBAIKAN: Sesuaikan endpoint delete jika di backend dipasang di bawah controller '/user'
      await api.delete(`/user/${id}`); 
      toast.success('Pengguna berhasil dihapus');
      fetchUsers(); 
    } catch (error) {
      console.error(error);
      toast.error('Gagal menghapus pengguna');
    }
  };

  // Filter pencarian pengguna secara realtime
  const filteredUsers = users.filter((u: any) => {
    const nameMatch = u.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || emailMatch;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              Manajemen Pengguna
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Kelola hak akses, peranan (role), dan akun pelanggan BrunoMart
            </p>
          </div>

          {/* Bar Pencarian */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 text-sm pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
            />
          </div>
        </div>

        {/* Tabel Data Utama */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-bold text-slate-600 text-sm">Informasi Pengguna</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Email</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Peranan (Role)</th>
                  <th className="p-4 font-bold text-slate-600 text-sm text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-400">
                      <Loader2 className="animate-spin mx-auto mb-3 text-blue-600" size={28} />
                      <span className="font-medium">Memuat basis data pengguna...</span>
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((u: any) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                          u.role === 'ADMIN' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-blue-50 border-blue-100 text-blue-600'
                        }`}>
                          {u.role === 'ADMIN' ? <ShieldCheck size={20} /> : <User size={20} />}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block">{u.name || 'Anonymous'}</span>
                          <span className="text-xs text-slate-400">UID: #{u.id}</span>
                        </div>
                      </td>

                      <td className="p-4 text-slate-600 font-medium">
                        {u.email || '-'}
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide ${
                          u.role === 'ADMIN' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {u.role || 'USER'}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl transition"
                          title="Hapus Pengguna"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-500 font-medium">
                      <Users className="mx-auto text-slate-300 mb-2" size={32} />
                      Tidak ada data pengguna ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}