import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, Warehouse, Store, Package, Edit2, Trash2, ArrowLeftRight, X } from 'lucide-react';
import { Product } from '../types';

export default function StockPage() {
  const { products, addTransaction, updateProduct, deleteProduct, user } = useApp();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'gudang' | 'toko'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showTransferModal, setShowTransferModal] = useState<Product | null>(null);
  const [transferQty, setTransferQty] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode.includes(search) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const handleTransfer = (product: Product, direction: 'gudang-to-toko' | 'toko-to-gudang') => {
    const qty = parseInt(transferQty);
    if (!qty || qty <= 0) return;
    
    addTransaction({
      productId: product.id,
      productName: product.name,
      type: 'transfer',
      quantity: qty,
      from: direction === 'gudang-to-toko' ? 'gudang' : 'toko',
      to: direction === 'gudang-to-toko' ? 'toko' : 'gudang',
      note: `Transfer ${direction === 'gudang-to-toko' ? 'Gudang ke Toko' : 'Toko ke Gudang'}`,
      user: user?.name || 'Unknown',
    });
    setShowTransferModal(null);
    setTransferQty('');
  };

  return (
    <div className="px-4 py-4 md:px-6 md:py-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900">Manajemen Stok</h1>
          <p className="text-xs text-gray-400 mt-0.5">{products.length} produk terdaftar</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Tambah</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari produk, barcode, atau kategori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
        {[
          { key: 'all', label: 'Semua', icon: Package },
          { key: 'gudang', label: 'Gudang', icon: Warehouse },
          { key: 'toko', label: 'Toko', icon: Store },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all active:scale-95 ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="space-y-2.5">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Tidak ada produk ditemukan</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100/80">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-900 text-sm truncate">{product.name}</h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">{product.barcode} | {product.category}</p>
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="p-2 text-gray-400 active:text-blue-600 active:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(product.id)}
                        className="p-2 text-gray-400 active:text-red-600 active:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Stock Info */}
                  <div className="grid grid-cols-2 gap-2 mt-2.5">
                    {(activeTab === 'all' || activeTab === 'gudang') && (
                      <div className={`p-2.5 rounded-xl ${product.stockGudang <= product.minStock ? 'bg-red-50 border border-red-100' : 'bg-purple-50'}`}>
                        <div className="flex items-center gap-1 mb-0.5">
                          <Warehouse className={`w-3 h-3 ${product.stockGudang <= product.minStock ? 'text-red-500' : 'text-purple-500'}`} />
                          <span className="text-[10px] text-gray-500 font-medium">Gudang</span>
                        </div>
                        <p className={`text-base font-bold ${product.stockGudang <= product.minStock ? 'text-red-700' : 'text-purple-700'}`}>
                          {product.stockGudang}
                        </p>
                        <p className="text-[10px] text-gray-400">{product.unit}</p>
                      </div>
                    )}
                    {(activeTab === 'all' || activeTab === 'toko') && (
                      <div className={`p-2.5 rounded-xl ${product.stockToko <= product.minStock ? 'bg-red-50 border border-red-100' : 'bg-emerald-50'}`}>
                        <div className="flex items-center gap-1 mb-0.5">
                          <Store className={`w-3 h-3 ${product.stockToko <= product.minStock ? 'text-red-500' : 'text-emerald-500'}`} />
                          <span className="text-[10px] text-gray-500 font-medium">Toko</span>
                        </div>
                        <p className={`text-base font-bold ${product.stockToko <= product.minStock ? 'text-red-700' : 'text-emerald-700'}`}>
                          {product.stockToko}
                        </p>
                        <p className="text-[10px] text-gray-400">{product.unit}</p>
                      </div>
                    )}
                  </div>

                  {/* Transfer Button */}
                  <button
                    onClick={() => setShowTransferModal(product)}
                    className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl text-xs text-gray-600 hover:text-blue-600 transition-all active:scale-95 font-medium"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    Transfer Stok
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} />}

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} />
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center animate-fade-in">
          <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl p-5 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">Transfer Stok</h3>
              <button onClick={() => { setShowTransferModal(null); setTransferQty(''); }} className="p-2 hover:bg-gray-100 rounded-xl active:scale-90">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4 font-medium">{showTransferModal.name}</p>
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-purple-500 font-medium">Gudang</p>
                <p className="text-xl font-bold text-purple-700">{showTransferModal.stockGudang}</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-emerald-500 font-medium">Toko</p>
                <p className="text-xl font-bold text-emerald-700">{showTransferModal.stockToko}</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Jumlah Transfer</label>
              <input
                type="number"
                value={transferQty}
                onChange={(e) => setTransferQty(e.target.value)}
                placeholder="Masukkan jumlah..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleTransfer(showTransferModal, 'gudang-to-toko')}
                disabled={!transferQty || parseInt(transferQty) <= 0}
                className="py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all shadow-lg shadow-emerald-200"
              >
                Gudang ke Toko
              </button>
              <button
                onClick={() => handleTransfer(showTransferModal, 'toko-to-gudang')}
                disabled={!transferQty || parseInt(transferQty) <= 0}
                className="py-3 bg-purple-600 text-white rounded-xl font-semibold text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all shadow-lg shadow-purple-200"
              >
                Toko ke Gudang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-base font-bold text-gray-900 text-center mb-2">Hapus Produk?</h3>
            <p className="text-sm text-gray-500 text-center mb-5">Produk yang dihapus tidak dapat dikembalikan.</p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => { deleteProduct(showDeleteConfirm); setShowDeleteConfirm(null); }}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-200"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddProductModal({ onClose }: { onClose: () => void }) {
  const { addProduct } = useApp();
  const [form, setForm] = useState({
    name: '', barcode: '', category: 'Makanan', unit: 'pcs',
    stockGudang: '0', stockToko: '0', minStock: '10', price: '0',
  });

  const handleSubmit = () => {
    if (!form.name || !form.barcode) return;
    addProduct({
      name: form.name,
      barcode: form.barcode,
      category: form.category,
      unit: form.unit,
      stockGudang: parseInt(form.stockGudang) || 0,
      stockToko: parseInt(form.stockToko) || 0,
      minStock: parseInt(form.minStock) || 10,
      price: parseInt(form.price) || 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center animate-fade-in">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Tambah Produk Baru</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl active:scale-90">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Nama Produk</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nama produk..." />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Barcode</label>
            <input type="text" value={form.barcode} onChange={e => setForm({...form, barcode: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Kode barcode..." />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Kategori</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option>Makanan</option><option>Minuman</option><option>Sembako</option><option>Kebersihan</option><option>Lainnya</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Satuan</label>
              <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option>pcs</option><option>botol</option><option>pack</option><option>karung</option><option>box</option><option>kg</option><option>liter</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Stok Gudang</label>
              <input type="number" value={form.stockGudang} onChange={e => setForm({...form, stockGudang: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Stok Toko</label>
              <input type="number" value={form.stockToko} onChange={e => setForm({...form, stockToko: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Min. Stok</label>
              <input type="number" value={form.minStock} onChange={e => setForm({...form, minStock: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Harga (Rp)</label>
              <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <button onClick={handleSubmit}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-95 transition-all mt-2 shadow-lg shadow-blue-200">
            Simpan Produk
          </button>
        </div>
      </div>
    </div>
  );
}

function EditProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { updateProduct } = useApp();
  const [form, setForm] = useState({
    name: product.name, barcode: product.barcode, category: product.category, unit: product.unit,
    stockGudang: product.stockGudang.toString(), stockToko: product.stockToko.toString(),
    minStock: product.minStock.toString(), price: product.price.toString(),
  });

  const handleSubmit = () => {
    updateProduct(product.id, {
      name: form.name,
      barcode: form.barcode,
      category: form.category,
      unit: form.unit,
      stockGudang: parseInt(form.stockGudang) || 0,
      stockToko: parseInt(form.stockToko) || 0,
      minStock: parseInt(form.minStock) || 10,
      price: parseInt(form.price) || 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center animate-fade-in">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Edit Produk</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl active:scale-90">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Nama Produk</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Barcode</label>
            <input type="text" value={form.barcode} onChange={e => setForm({...form, barcode: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Kategori</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option>Makanan</option><option>Minuman</option><option>Sembako</option><option>Kebersihan</option><option>Lainnya</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Satuan</label>
              <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option>pcs</option><option>botol</option><option>pack</option><option>karung</option><option>box</option><option>kg</option><option>liter</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Stok Gudang</label>
              <input type="number" value={form.stockGudang} onChange={e => setForm({...form, stockGudang: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Stok Toko</label>
              <input type="number" value={form.stockToko} onChange={e => setForm({...form, stockToko: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Min. Stok</label>
              <input type="number" value={form.minStock} onChange={e => setForm({...form, minStock: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Harga (Rp)</label>
              <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <button onClick={handleSubmit}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-95 transition-all mt-2 shadow-lg shadow-blue-200">
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
