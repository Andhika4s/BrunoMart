'use client';
import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Edit2, Package, Loader2, X, Upload } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State Form sesuai dengan key di Postman
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null as File | null
  });
  
  // State untuk melihat preview gambar yang akan diupload
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/products');
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setProducts(data);
    } catch (error) {
      console.error(error);
      toast.error('Gagal mengambil data produk');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle perubahan file gambar
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file)); // Membuat URL lokal untuk preview
    }
  };

  // Submit Form menggunakan FormData (Multipart/Form-Data) seperti Postman
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    data.append('category', formData.category);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await api.post('/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Produk berhasil ditambahkan');
      setIsModalOpen(false);
      resetForm();
      fetchProducts(); // Refresh list tabel
    } catch (error) {
      console.error(error);
      toast.error('Gagal menambahkan produk');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      await api.delete(`/info?id=${id}`);
      toast.success('Produk dihapus');
      fetchProducts();
    } catch (error) {
      toast.error('Gagal menghapus produk');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', stock: '', category: '', image: null });
    setImagePreview(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Utama */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Manajemen Produk</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola data komoditas dan stok barang BrunoMart</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition shadow-sm shadow-blue-200"
        >
          <Plus size={18} />
          Tambah Produk
        </button>
      </div>
      
      {/* Tabel Utama */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-bold text-slate-600">Produk</th>
              <th className="p-4 font-bold text-slate-600">Kategori</th>
              <th className="p-4 font-bold text-slate-600">Harga</th>
              <th className="p-4 font-bold text-slate-600">Stok</th>
              <th className="p-4 font-bold text-slate-600 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-slate-400">
                  <Loader2 className="animate-spin mx-auto mb-2" /> Memuat data...
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200">
                      {p.image ? (
                        <img 
                          src={p.image.startsWith('http') ? p.image : `http://localhost:5000/${p.image}`} 
                          alt={p.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package size={20} className="text-slate-400" />
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800 block">{p.name}</span>
                      <span className="text-xs text-slate-400 line-clamp-1 max-w-xs">{p.description || 'Tidak ada deskripsi'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                      {p.category || 'Umum'}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-800">Rp{(p.price || 0).toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.stock > 0 ? `${p.stock} Tersedia` : 'Habis'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg mr-2"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-10 text-center text-slate-500">Tidak ada produk ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Popup Form (Mendukung Form-Data & Upload File) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-black text-xl text-slate-800">Tambah Produk</h3>
                <p className="text-xs text-slate-400 mt-0.5">Isi detail data produk baru dengan format multipart</p>
              </div>
              <button 
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="text-slate-400 hover:bg-slate-200 p-1.5 rounded-xl transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleAddProduct} className="p-6 space-y-4 overflow-y-auto flex-1 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">NAMA PRODUK</label>
                <input
                  type="text" required placeholder="Sesuai nama komoditas"
                  className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border-slate-200"
                  value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">DESKRIPSI</label>
                <textarea
                  placeholder="Detail spesifikasi barang" rows={2}
                  className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border-slate-200"
                  value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">HARGA (RP)</label>
                  <input
                    type="number" required placeholder="350000"
                    className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border-slate-200"
                    value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">STOK AWAL</label>
                  <input
                    type="number" required placeholder="50"
                    className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border-slate-200"
                    value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">KATEGORI</label>
                <input
                  type="text" required placeholder="pakaian / makanan / elektronik"
                  className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border-slate-200"
                  value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                />
              </div>

              {/* Area Upload Gambar (File) */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">FOTO PRODUK</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 transition flex flex-col items-center justify-center min-h-[110px]"
                >
                  <input 
                    type="file" accept="image/*" className="hidden" 
                    ref={fileInputRef} onChange={handleFileChange} 
                  />
                  {imagePreview ? (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <>
                      <Upload className="text-slate-400 mb-1" size={24} />
                      <span className="text-xs font-semibold text-slate-600">Pilih berkas gambar</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Format PNG, JPG atau JPEG up to 2MB</span>
                    </>
                  )}
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button" onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-100"
                >
                  Simpan ke Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}