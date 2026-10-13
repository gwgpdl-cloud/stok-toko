import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, Package, Warehouse, Store, AlertTriangle, Edit2, Trash2, ArrowLeftRight } from 'lucide-react';
import { Product } from '../types';

export default function StockPage() {
  const { products, searchProducts, setCurrentPage, updateProduct, deleteProduct, addTransaction, user } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'gudang' | 'toko'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAction, setShowAction] = useState(false);
  const [actionType, setActionType] = useState<'in' | 'out' | 'transfer'>('in');
  const [actionQty, setActionQty] = useState('');
  const [actionNote, setActionNote] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const filtered = search ? searchProducts(search) : products;
  const displayProducts = filtered.filter(p => {
    if (filter === 'low') return p.stockToko <= p.minStock;
    if (filter === 'gudang') return p.stockGudang > 0;
    if (filter === 'toko') return p.stockToko > 0;
    return true;
  });

  const handleAction = () => {
    if (!selectedProduct || !actionQty) return;
    const qty = parseInt(actionQty);
    if (isNaN(qty) || qty <= 0) return;

    addTransaction({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      type: actionType,
      quantity: qty,
      from: actionType === 'transfer' ? 'gudang' : (actionType === 'in' ? 'gudang' : 'toko'),
      to: actionType === 'transfer' ? 'toko' : undefined,
      date: new Date().toISOString(),
      note: actionNote || (actionType === 'in' ? 'Barang masuk' : actionType === 'out' ? 'Barang keluar' : 'Transfer gudang ke toko'),
      user: user?.name || 'Unknown'
    });

    setShowAction(false);
    setSelectedProduct(null);
    setActionQty('');
    setActionNote('');
  };

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Manajemen Stok</h1>
          <p className="text-sm text-gray-500">{products.length} produk terdaftar</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">Tambah Produk</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari produk, barcode, atau kategori..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'Semua' },
          { key: 'low', label: '⚠️ Stok Rendah' },
          { key: 'gudang', label: '🏭 Gudang' },
          { key: 'toko', label: '🏪 Toko' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              filter === f.key
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {displayProducts.map(p => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">{p.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Barcode: {p.barcode}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 rounded-md text-xs text-gray-600">{p.category}</span>
              </div>
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => { setSelectedProduct(p); setEditMode(true); }}
                  className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Hapus produk ini?')) deleteProduct(p.id);
                  }}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Warehouse className="w-3.5 h-3.5 text-purple-500" />
                  <span className="text-xs text-purple-600 font-medium">Gudang</span>
                </div>
                <p className="text-xl font-bold text-purple-700">{p.stockGudang}</p>
                <p className="text-xs text-purple-400">{p.unit}</p>
              </div>
              <div className={`rounded-xl p-3 ${p.stockToko <= p.minStock ? 'bg-red-50' : 'bg-emerald-50'}`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Store className={`w-3.5 h-3.5 ${p.stockToko <= p.minStock ? 'text-red-500' : 'text-emerald-500'}`} />
                  <span className={`text-xs font-medium ${p.stockToko <= p.minStock ? 'text-red-600' : 'text-emerald-600'}`}>
                    Toko {p.stockToko <= p.minStock && '⚠️'}
                  </span>
                </div>
                <p className={`text-xl font-bold ${p.stockToko <= p.minStock ? 'text-red-700' : 'text-emerald-700'}`}>{p.stockToko}</p>
                <p className={`text-xs ${p.stockToko <= p.minStock ? 'text-red-400' : 'text-emerald-400'}`}>{p.unit}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => { setSelectedProduct(p); setActionType('in'); setShowAction(true); }}
                className="flex-1 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-xs font-medium transition-colors"
              >
                + Masuk
              </button>
              <button
                onClick={() => { setSelectedProduct(p); setActionType('out'); setShowAction(true); }}
                className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-medium transition-colors"
              >
                - Keluar
              </button>
              <button
                onClick={() => { setSelectedProduct(p); setActionType('transfer'); setShowAction(true); }}
                className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-medium transition-colors"
              >
                <ArrowLeftRight className="w-3 h-3 inline mr-1" />
                Transfer
              </button>
            </div>
          </div>
        ))}
      </div>

      {displayProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Tidak ada produk ditemukan</p>
        </div>
      )}

      {/* Action Modal */}
      {showAction && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">
                {actionType === 'in' ? '📥 Barang Masuk' : actionType === 'out' ? '📤 Barang Keluar' : '🔄 Transfer'}
              </h3>
              <button onClick={() => setShowAction(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="font-medium text-gray-800">{selectedProduct.name}</p>
              <p className="text-sm text-gray-500">
                Gudang: {selectedProduct.stockGudang} | Toko: {selectedProduct.stockToko}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Jumlah</label>
              <input
                type="number"
                value={actionQty}
                onChange={(e) => setActionQty(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-lg font-semibold"
                placeholder="0"
                min="1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Catatan</label>
              <input
                type="text"
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                placeholder="Tambahkan catatan..."
              />
            </div>
            <button
              onClick={handleAction}
              className={`w-full py-3.5 rounded-xl text-white font-semibold transition-all ${
                actionType === 'in' ? 'bg-green-500 hover:bg-green-600' :
                actionType === 'out' ? 'bg-red-500 hover:bg-red-600' :
                'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              Konfirmasi
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <AddProductModal
          onClose={() => { setShowAddModal(false); setEditMode(false); }}
          product={editMode && selectedProduct ? selectedProduct : undefined}
        />
      )}
    </div>
  );
}

function AddProductModal({ onClose, product }: { onClose: () => void; product?: Product }) {
  const { addProduct, updateProduct } = useApp();
  const [form, setForm] = useState({
    barcode: product?.barcode || '',
    name: product?.name || '',
    category: product?.category || '',
    stockGudang: product?.stockGudang?.toString() || '0',
    stockToko: product?.stockToko?.toString() || '0',
    minStock: product?.minStock?.toString() || '10',
    unit: product?.unit || 'pcs',
    price: product?.price?.toString() || '0',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      updateProduct(product.id, {
        ...form,
        stockGudang: parseInt(form.stockGudang),
        stockToko: parseInt(form.stockToko),
        minStock: parseInt(form.minStock),
        price: parseInt(form.price),
      });
    } else {
      addProduct({
        ...form,
        stockGudang: parseInt(form.stockGudang),
        stockToko: parseInt(form.stockToko),
        minStock: parseInt(form.minStock),
        price: parseInt(form.price),
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">{product ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Barcode</label>
            <input type="text" value={form.barcode} onChange={(e) => setForm({...form, barcode: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Nama Produk</label>
            <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Kategori</label>
            <input type="text" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Stok Gudang</label>
              <input type="number" value={form.stockGudang} onChange={(e) => setForm({...form, stockGudang: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none" min="0" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Stok Toko</label>
              <input type="number" value={form.stockToko} onChange={(e) => setForm({...form, stockToko: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none" min="0" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Min. Stok</label>
              <input type="number" value={form.minStock} onChange={(e) => setForm({...form, minStock: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none" min="0" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Satuan</label>
              <input type="text" value={form.unit} onChange={(e) => setForm({...form, unit: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Harga (Rp)</label>
            <input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none" min="0" />
          </div>
          <button type="submit" className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all">
            {product ? 'Simpan Perubahan' : 'Tambah Produk'}
          </button>
        </form>
      </div>
    </div>
  );
}
