'use client';

import React from 'react';
import { Printer, X } from 'lucide-react'; // 💡 Tambahkan X untuk tombol close

interface InvoicePrintProps {
  order: any;
  onClose: () => void; // 💡 Tambahkan ini agar tidak error saat dipanggil oleh Admin
  isAdmin?: boolean;
}

export default function InvoicePrint({ order, onClose, isAdmin = false }: InvoicePrintProps) {
  if (!order) return null;

  return (
    // 💡 Tambahkan wrapper fixed overlay agar menjadi modal pop-up
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8">
        
        {/* ❌ PANEL KONTROL: Otomatis sembunyi saat dicetak */}
        <div className="no-print bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
          <button
            onClick={onClose} // 💡 Fungsi penutup modal dipasang di sini
            className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-xs font-bold transition"
          >
            <X size={16} /> Tutup Preview
          </button>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition shadow-sm"
          >
            <Printer size={14} /> Cetak Nota / Simpan PDF
          </button>
        </div>

        {/* 🖨️ AREA UTAMA YANG AKAN DICETAK */}
        <div className="print-container p-8 bg-white text-slate-800 text-sm">
          
          {/* Header Nota */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">BRUNOMART</h1>
              <p className="text-xs text-slate-500 mt-0.5">Solusi Belanja Grosir & Retail Anda</p>
              <p className="text-xs text-slate-400 mt-2">Malang, Jawa Timur</p>
            </div>
            <div className="text-right">
              <h2 className="text-base font-bold text-slate-900">INVOICE PENJUALAN</h2>
              <p className="font-mono text-xs font-bold text-slate-700 mt-1">
                #ORD-{order.id?.toString().substring(0, 8).toUpperCase()}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric'
                }) : '-'}
              </p>
            </div>
          </div>

          {/* Info Pelanggan & Metode */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-xs border-b border-slate-200 pb-4">
            <div>
              <span className="text-slate-400 font-bold block mb-1">DITUJUKAN KEPADA:</span>
              <p className="font-bold text-slate-900">{order.user?.name || 'Pelanggan BrunoMart'}</p>
              <p className="text-slate-600">{order.user?.email || '-'}</p>
            </div>
            <div>
              <span className="text-slate-400 font-bold block mb-1">DETAIL LOGISTIK:</span>
              <p className="text-slate-700"><span className="font-medium">Alamat:</span> {order.address || 'Ambil Di Toko'}</p>
              <p className="text-slate-700 font-bold mt-1">
                <span className="font-medium font-normal text-slate-600">Metode Bayar:</span> {order.paymentMethod || 'COD'}
              </p>
            </div>
          </div>

          {/* Rincian Produk */}
          <table className="w-full text-left border-collapse mb-6 text-xs">
            <thead>
              <tr className="border-b-2 border-slate-800 text-slate-500 font-bold">
                <th className="py-2">NAMA ITEM</th>
                <th className="py-2 text-center">QTY</th>
                <th className="py-2 text-right">HARGA SATUAN</th>
                <th className="py-2 text-right">SUBTOTAL</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item: any) => (
                <tr key={item.id} className="border-b border-slate-100 text-slate-700">
                  <td className="py-3 font-medium text-slate-900">{item.product?.name}</td>
                  <td className="py-3 text-center font-mono">{item.quantity}</td>
                  <td className="py-3 text-right font-mono">Rp{(item.price || 0).toLocaleString('id-ID')}</td>
                  <td className="py-3 text-right font-mono font-bold text-slate-900">
                    Rp{((item.price || 0) * (item.quantity || 0)).toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total Pembayaran */}
          <div className="flex justify-end border-t-2 border-slate-900 pt-4">
            <div className="w-full sm:w-1/2 space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-slate-500">
                <span>Total Belanja:</span>
                <span className="font-mono">Rp{(order.totalAmount || 0).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-base font-black border-t border-dashed border-slate-300 pt-2 text-slate-900">
                <span>TOTAL AKHIR:</span>
                <span className="font-mono text-blue-600">Rp{(order.totalAmount || 0).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Footer Struk */}
          <div className="mt-12 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4">
            <p>Terima kasih telah berbelanja dan mempercayai BrunoMart!</p>
          </div>

        </div>
      </div>
    </div>
  );
}