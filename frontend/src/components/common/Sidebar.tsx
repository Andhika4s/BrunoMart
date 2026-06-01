'use client';
import { LayoutDashboard, Package, Users, ShoppingCart } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Produk', path: '/admin/products', icon: <Package size={18} /> },
    { label: 'Pengguna', path: '/admin/users', icon: <Users size={18} /> },
    { label: 'Pesanan', path: '/admin/orders', icon: <ShoppingCart size={18} /> },
  ];

  return (
    <aside className="w-64 bg-white border-r shadow-sm h-screen sticky top-0">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-black text-blue-600">BrunoMart</h1>
        <p className="text-xs text-slate-400">Admin Panel</p>
      </div>
      <nav className="p-4 space-y-2">
        {menu.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
              pathname === item.path ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}