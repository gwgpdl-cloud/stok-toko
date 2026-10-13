import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, Warehouse, Store, Package, Edit2, Trash2, ArrowLeftRight, X, ChevronDown } from 'lucide-react';
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
      note: `Transfer ${direction === 'gudang-to-toko' ? 'Gudang → Toko' : 'Toko → Gudang'}`,
      user: user?.name || 'Unknown',
    });
    setShowTransferModal(null);
    setTransferQty('');
  };

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Manajemen Stok</h1>
          <p className="text-sm text-gray-500">{products.length} produk terdaftar</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Tambah Produk</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Cari produk, barcode, atau kategori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'Semua', icon: Package },
          { key: 'gudang', label: 'Gudang', icon: Warehouse },
          { key: 'toko', label: 'Toko', icon: Store },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Tidak ada produk ditemukan</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm truncate">{product.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{product.barcode} • {product.category}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Stock Info */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {(activeTab === 'all' || activeTab === 'gudang') && (
                      <div className={`p-2.5 rounded-xl ${product.stockGudang <= product.minStock ? 'bg-red-50' : 'bg-purple-50'}`}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <Warehouse className={`w-3.5 h-3.5 ${product.stockGudang <= product.minStock ? 'text-red-500' : 'text-purple-500'}`} />
                          <span className="text-xs text-gray-500">Gudang</span>
                        </div>
                        <p className={`text-lg font-bold ${product.stockGudang <= product.minStock ? 'text-red-700' : 'text-purple-700'}`}>
                          {product.stockGudang}
                        </p>
                        <p className="text-xs text-gray-400">{product.unit}</p>
                      </div>
                    )}
                    {(activeTab === 'all' || activeTab === 'toko') && (
                      <div className={`p-2.5 rounded-xl ${product.stockToko <= product.minStock ? 'bg-red-50' : 'bg-emerald-50'}`}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <Store className={`w-3.5 h-3.5 ${product.stockToko <= product.minStock ? 'text-red-500' : 'text-emerald-500'}`} />
                          <span className="text-xs text-gray-500">Toko</span>
                        </div>
                        <p className={`text-lg font-bold ${product.stockToko <= product.minStock ? 'text-red-700' : 'text-emerald-700'}`}>
                          {product.stockToko}
                        </p>
                        <p className="text-xs text-gray-400">{product.unit}</p>
                      </div>
                    )}
                  </div>

                  {/* Transfer Button */}
                  <button
                    onClick={() => setShowTransferModal(product)}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl text-sm text-gray-600 hover:text-blue-600 transition-all"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Transfer Stok</h3>
              <button onClick={() => { setShowTransferModal(null); setTransferQty(''); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">{showTransferModal.name}</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <p className="text-xs text-purple-500">Gudang</p>
                <p className="text-xl font-bold text-purple-700">{showTransferModal.stockGudang}</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 text-center">
                <p className="text-xs text-emerald-500">Toko</p>
                <p className="text-xl font-bold text-emerald-700">{showTransferModal.stockToko}</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Jumlah Transfer</label>
              <input
                type="number"
                value={transferQty}
                onChange={(e) => setTransferQty(e.target.value)}
                placeholder="Masukkan jumlah..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleTransfer(showTransferModal, 'gudang-to-toko')}
                disabled={!transferQty || parseInt(transferQty) <= 0}
                className="py-3 bg-emerald-600 text-white rounded-xl font-medium text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
              >
                Gudang → Toko
              </button>
              <button
                onClick={() => handleTransfer(showTransferModal, 'toko-to-gudang')}
                disabled={!transferQty || parseInt(transferQty) <= 0}
                className="py-3 bg-purple-600 text-white rounded-xl font-medium text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
              >
                Toko → Gudang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Hapus Produk?</h3>
            <p className="text-sm text-gray-500 mb-4">Produk yang dihapus tidak dapat dikembalikan.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => { deleteProduct(showDeleteConfirm); setShowDeleteConfirm(null); }}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700"
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Tambah Produk Baru</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Nama Produk</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nama produk..." />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Barcode</label>
            <input type="text" value={form.barcode} onChange={e => setForm({...form, barcode: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Kode barcode..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Kategori</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option>Makanan</option><option>Minuman</option><option>Sembako</option><option>Kebersihan</option><option>Lainnya</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Satuan</label>
              <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option>pcs</option><option>botol</option><option>pack</option><option>karung</option><option>box</option><option>kg</option><option>liter</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Stok Gudang</label>
              <input type="number" value={form.stockGudang} onChange={e => setForm({...form, stockGudang: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Stok Toko</label>
              <input type="number" value={form.stockToko} onChange={e => setForm({...form, stockToko: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Min. Stok</label>
              <input type="number" value={form.minStock} onChange={e => setForm({...form, minStock: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Harga (Rp)</label>
              <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <button onClick={handleSubmit}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 active:scale-95 transition-all mt-2">
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Edit Produk</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Nama Produk</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Barcode</label>
            <input type="text" value={form.barcode} onChange={e => setForm({...form, barcode: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Kategori</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option>Makanan</option><option>Minuman</option><option>Sembako</option><option>Kebersihan</option><option>Lainnya</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Satuan</label>
              <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option>pcs</option><option>botol</option><option>pack</option><option>karung</option><option>box</option><option>kg</option><option>liter</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Stok Gudang</label>
              <input type="number" value={form.stockGudang} onChange={e => setForm({...form, stockGudang: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Stok Toko</label>
              <input type="number" value={form.stockToko} onChange={e => setForm({...form, stockToko: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Min. Stok</label>
              <input type="number" value={form.minStock} onChange={e => setForm({...form, minStock: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Harga (Rp)</label>
              <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <button onClick={handleSubmit}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 active:scale-95 transition-all mt-2">
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
