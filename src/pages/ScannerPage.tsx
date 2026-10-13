import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScanLine, ArrowDownRight, ArrowUpRight, RefreshCw, Check, X, Keyboard, Package, Warehouse, Store } from 'lucide-react';
import { Product } from '../types';

export default function ScannerPage() {
  const { products, addTransaction, getProductByBarcode, user } = useApp();
  const [manualBarcode, setManualBarcode] = useState('');
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);
  const [actionType, setActionType] = useState<'in' | 'out' | 'transfer'>('in');
  const [quantity, setQuantity] = useState('1');
  const [transferTo, setTransferTo] = useState<'gudang' | 'toko'>('toko');
  const [note, setNote] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleSearch = () => {
    setError('');
    if (!manualBarcode.trim()) {
      setError('Masukkan kode barcode atau nama produk');
      return;
    }
    const product = getProductByBarcode(manualBarcode.trim());
    if (product) {
      setFoundProduct(product);
    } else {
      const byName = products.find(p => p.name.toLowerCase().includes(manualBarcode.trim().toLowerCase()));
      if (byName) {
        setFoundProduct(byName);
      } else {
        setError('Produk tidak ditemukan');
      }
    }
  };

  const handleSubmit = () => {
    if (!foundProduct) return;
    const qty = parseInt(quantity);
    if (!qty || qty <= 0) {
      setError('Jumlah harus lebih dari 0');
      return;
    }

    let fromLocation: 'gudang' | 'toko' = 'gudang';
    let toLocation: 'gudang' | 'toko' | undefined;

    if (actionType === 'in') {
      fromLocation = 'gudang';
    } else if (actionType === 'out') {
      fromLocation = 'toko';
    } else {
      fromLocation = 'gudang';
      toLocation = transferTo;
    }

    addTransaction({
      productId: foundProduct.id,
      productName: foundProduct.name,
      type: actionType,
      quantity: qty,
      from: fromLocation,
      to: toLocation,
      note: note || (actionType === 'in' ? 'Barang masuk' : actionType === 'out' ? 'Penjualan' : 'Transfer stok'),
      user: user?.name || 'Unknown',
    });

    setSuccessMessage(`${foundProduct.name} - ${qty} ${foundProduct.unit} berhasil diupdate!`);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      resetForm();
    }, 2000);
  };

  const resetForm = () => {
    setManualBarcode('');
    setFoundProduct(null);
    setQuantity('1');
    setNote('');
    setError('');
  };

  const startScanning = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      setManualBarcode(randomProduct.barcode);
      setFoundProduct(randomProduct);
    }, 1500);
  };

  return (
    <div className="px-4 py-4 md:px-6 md:py-6 pb-6 min-h-screen">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
          <ScanLine className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
          Scan & Update Stok
        </h1>
        <p className="text-xs text-gray-400 mt-1">Scan barcode atau cari produk untuk update stok</p>
      </div>

      {/* Scanner Area */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/80 mb-4">
        {/* Camera Scanner Simulation */}
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden mb-4 aspect-[16/10] flex items-center justify-center">
          {scanning ? (
            <div className="text-center">
              <div className="w-14 h-14 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Mendeteksi barcode...</p>
            </div>
          ) : foundProduct ? (
            <div className="text-center p-4">
              <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Check className="w-7 h-7 text-green-400" />
              </div>
              <p className="text-white font-bold text-sm">{foundProduct.name}</p>
              <p className="text-gray-400 text-xs mt-1">{foundProduct.barcode}</p>
            </div>
          ) : (
            <div className="text-center p-4">
              <div className="w-16 h-16 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                <ScanLine className="w-7 h-7 text-gray-500" />
              </div>
              <p className="text-gray-400 text-sm font-medium">Arahkan kamera ke barcode</p>
              <p className="text-gray-500 text-xs mt-1">atau gunakan input manual di bawah</p>
            </div>
          )}
          {scanning && (
            <div className="absolute inset-x-4 h-0.5 bg-red-500 animate-pulse" style={{ top: '50%' }} />
          )}
        </div>

        {/* Scan Button */}
        <button
          onClick={startScanning}
          disabled={scanning}
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mb-3"
        >
          {scanning ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <ScanLine className="w-5 h-5" />
              Scan Barcode
            </>
          )}
        </button>

        {/* Manual Input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={manualBarcode}
              onChange={(e) => { setManualBarcode(e.target.value); setError(''); setFoundProduct(null); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ketik barcode / nama produk..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-3 bg-gray-800 text-white rounded-xl text-sm font-semibold hover:bg-gray-900 active:scale-95 transition-all shadow-md"
          >
            <Keyboard className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-2 animate-fade-in">
          <X className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Product Found - Action Form */}
      {foundProduct && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/80 mb-4 animate-slide-up">
          {/* Product Info */}
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100 mb-3">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-sm truncate">{foundProduct.name}</h3>
              <p className="text-[11px] text-gray-400">{foundProduct.barcode} • {foundProduct.category}</p>
            </div>
            <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-xl active:scale-90">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Current Stock */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-purple-50 rounded-xl p-2.5 text-center">
              <Warehouse className="w-4 h-4 text-purple-500 mx-auto mb-0.5" />
              <p className="text-lg font-bold text-purple-700">{foundProduct.stockGudang}</p>
              <p className="text-[10px] text-purple-500 font-medium">Gudang</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-2.5 text-center">
              <Store className="w-4 h-4 text-emerald-500 mx-auto mb-0.5" />
              <p className="text-lg font-bold text-emerald-700">{foundProduct.stockToko}</p>
              <p className="text-[10px] text-emerald-500 font-medium">Toko</p>
            </div>
          </div>

          {/* Action Type */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-700 mb-2 block">Tipe Aksi</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setActionType('in')}
                className={`py-3 rounded-xl text-sm font-semibold flex flex-col items-center gap-1 transition-all active:scale-95 ${
                  actionType === 'in'
                    ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ArrowDownRight className="w-5 h-5" />
                <span className="text-[11px]">Masuk</span>
              </button>
              <button
                onClick={() => setActionType('out')}
                className={`py-3 rounded-xl text-sm font-semibold flex flex-col items-center gap-1 transition-all active:scale-95 ${
                  actionType === 'out'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ArrowUpRight className="w-5 h-5" />
                <span className="text-[11px]">Keluar</span>
              </button>
              <button
                onClick={() => setActionType('transfer')}
                className={`py-3 rounded-xl text-sm font-semibold flex flex-col items-center gap-1 transition-all active:scale-95 ${
                  actionType === 'transfer'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <RefreshCw className="w-5 h-5" />
                <span className="text-[11px]">Transfer</span>
              </button>
            </div>
          </div>

          {/* Quantity - Large Touch Target */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-700 mb-2 block">Jumlah</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, parseInt(quantity) - 1).toString())}
                className="w-14 h-14 bg-gray-100 rounded-xl text-2xl font-bold text-gray-600 flex items-center justify-center active:bg-gray-200 active:scale-90 transition-all"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="flex-1 text-center text-2xl font-bold py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
              <button
                onClick={() => setQuantity((parseInt(quantity) + 1).toString())}
                className="w-14 h-14 bg-gray-100 rounded-xl text-2xl font-bold text-gray-600 flex items-center justify-center active:bg-gray-200 active:scale-90 transition-all"
              >
                +
              </button>
            </div>
            {/* Quick quantity buttons */}
            <div className="flex gap-1.5 mt-2">
              {[1, 5, 10, 25, 50].map(q => (
                <button
                  key={q}
                  onClick={() => setQuantity(q.toString())}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all active:scale-90 ${
                    quantity === q.toString()
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Transfer Direction */}
          {actionType === 'transfer' && (
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-700 mb-2 block">Arah Transfer</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTransferTo('toko')}
                  className={`py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                    transferTo === 'toko'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Gudang → Toko
                </button>
                <button
                  onClick={() => setTransferTo('gudang')}
                  className={`py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                    transferTo === 'gudang'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Toko → Gudang
                </button>
              </div>
            </div>
          )}

          {/* Note */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Catatan (opsional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tambahkan catatan..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className={`w-full py-4 rounded-xl font-bold text-white text-sm active:scale-95 transition-all shadow-lg ${
              actionType === 'in'
                ? 'bg-green-600 hover:bg-green-700 shadow-green-200'
                : actionType === 'out'
                ? 'bg-red-600 hover:bg-red-700 shadow-red-200'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
            }`}
          >
            {actionType === 'in' ? '✓ Barang Masuk' : actionType === 'out' ? '✓ Barang Keluar' : '✓ Transfer Stok'}
          </button>
        </div>
      )}

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 left-4 right-4 z-50 animate-slide-up">
          <div className="bg-green-600 text-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Quick Select Product */}
      {!foundProduct && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/80">
          <h3 className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">Pilih Cepat</h3>
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {products.slice(0, 8).map(product => (
              <button
                key={product.id}
                onClick={() => { setFoundProduct(product); setManualBarcode(product.barcode); }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left active:scale-98"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{product.name}</p>
                  <p className="text-[10px] text-gray-400">{product.barcode}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] text-gray-500 font-medium">
                    📦{product.stockGudang}
                  </p>
                  <p className="text-[10px] text-gray-500 font-medium">
                    🏪{product.stockToko}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
