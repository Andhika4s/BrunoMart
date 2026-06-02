'use client';
import { LayoutDashboard, Package, Users, ShoppingCart, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Produk', path: '/admin/products', icon: <Package size={18} /> },
    { label: 'Pengguna', path: '/admin/users', icon: <Users size={18} /> },
    { label: 'Pesanan', path: '/admin/orders', icon: <ShoppingCart size={18} /> },
  ];

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar dari BrunoMart?')) {
      // 1. Hapus token atau session auth yang kamu gunakan (contoh: di localStorage/cookies)
      localStorage.removeItem('token'); 
      // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // jika pakai cookies

      // 2. Berikan notifikasi sukses
      toast.success('Berhasil keluar dari akun');

      // 3. Kembalikan ke halaman login
      router.push('/login');
    }
  };

  return (
    <aside className="w-64 bg-white border-r shadow-sm h-screen sticky top-0 flex flex-col justify-between">
      {/* Bagian Atas: Logo & Menu Navigasi */}
      <div>
        <div className="p-6 border-b">
          <h1 className="text-2xl font-black text-blue-600">BrunoMart</h1>
          <p className="text-xs text-slate-400">Admin Panel</p>
        </div>
        
        <nav className="p-4 space-y-2">
          {menu.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm ${
                pathname === item.path 
                  ? 'bg-blue-50 text-blue-600 font-bold shadow-sm shadow-blue-50/50' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Bagian Bawah: Tombol Log Out */}
      <div className="p-4 border-t bg-slate-50/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
        >
          <LogOut size={18} />
          Keluar (Log Out)
        </button>
      </div>
    </aside>
  );
}