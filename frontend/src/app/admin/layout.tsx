import Sidebar from '@/components/common/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar /> {/* Sidebar ini akan tetap ada */}
      <main className="flex-1 overflow-y-auto">
        {children} {/* Konten halaman (products, dashboard, dll) akan berganti di sini */}
      </main>
    </div>
  );
}