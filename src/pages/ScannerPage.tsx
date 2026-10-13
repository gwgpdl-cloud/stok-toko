import React, { useState, useEffect } from 'react';
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
  const [isManualMode, setIsManualMode] = useState(true);
  const [scanning, setScanning] = useState(false);

  const handleSearch = () => {
    setError('');
    if (!manualBarcode.trim()) {
      setError('Masukkan kode barcode');
      return;
    }
    const product = getProductByBarcode(manualBarcode.trim());
    if (product) {
      setFoundProduct(product);
    } else {
      // Try searching by name
      const byName = products.find(p => p.name.toLowerCase().includes(manualBarcode.trim().toLowerCase()));
      if (byName) {
        setFoundProduct(byName);
      } else {
        setError('Produk tidak ditemukan. Periksa kode barcode atau nama produk.');
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

  // Simulate camera scanning
  const startScanning = () => {
    setScanning(true);
    // Simulate finding a product after 2 seconds
    setTimeout(() => {
      setScanning(false);
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      setManualBarcode(randomProduct.barcode);
      setFoundProduct(randomProduct);
    }, 2000);
  };

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ScanLine className="w-6 h-6 text-blue-600" />
          Scan & Update Stok
        </h1>
        <p className="text-sm text-gray-500 mt-1">Scan barcode atau masukkan kode untuk update stok cepat</p>
      </div>

      {/* Scanner Area */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
        {/* Camera Scanner Simulation */}
        <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-4 aspect-[4/3] flex items-center justify-center">
          {scanning ? (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-white text-sm">Mendeteksi barcode...</p>
            </div>
          ) : foundProduct ? (
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-white font-medium">{foundProduct.name}</p>
              <p className="text-gray-400 text-sm mt-1">{foundProduct.barcode}</p>
            </div>
          ) : (
            <div className="text-center p-4">
              <div className="w-20 h-20 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <ScanLine className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-400 text-sm">Arahkan kamera ke barcode</p>
              <p className="text-gray-500 text-xs mt-1">atau gunakan input manual</p>
            </div>
          )}
          {/* Scan line animation */}
          {scanning && (
            <div className="absolute inset-x-4 h-0.5 bg-red-500 animate-pulse" style={{ top: '50%' }} />
          )}
        </div>

        {/* Scan Button */}
        <button
          onClick={startScanning}
          disabled={scanning}
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mb-3"
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
        <div className="flex items-center gap-2">
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
            className="px-4 py-3 bg-gray-800 text-white rounded-xl text-sm font-medium hover:bg-gray-900 active:scale-95 transition-all"
          >
            <Keyboard className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-2">
          <X className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Product Found - Action Form */}
      {foundProduct && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 animate-slide-up">
          {/* Product Info */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{foundProduct.name}</h3>
              <p className="text-xs text-gray-400">{foundProduct.barcode} • {foundProduct.category}</p>
            </div>
            <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Current Stock */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-purple-50 rounded-xl p-3 text-center">
              <Warehouse className="w-4 h-4 text-purple-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-purple-700">{foundProduct.stockGudang}</p>
              <p className="text-xs text-purple-500">Gudang</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3 text-center">
              <Store className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-emerald-700">{foundProduct.stockToko}</p>
              <p className="text-xs text-emerald-500">Toko</p>
            </div>
          </div>

          {/* Action Type */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Tipe Aksi</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setActionType('in')}
                className={`py-3 rounded-xl text-sm font-medium flex flex-col items-center gap-1 transition-all ${
                  actionType === 'in'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ArrowDownRight className="w-5 h-5" />
                <span className="text-xs">Masuk</span>
              </button>
              <button
                onClick={() => setActionType('out')}
                className={`py-3 rounded-xl text-sm font-medium flex flex-col items-center gap-1 transition-all ${
                  actionType === 'out'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ArrowUpRight className="w-5 h-5" />
                <span className="text-xs">Keluar</span>
              </button>
              <button
                onClick={() => setActionType('transfer')}
                className={`py-3 rounded-xl text-sm font-medium flex flex-col items-center gap-1 transition-all ${
                  actionType === 'transfer'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <RefreshCw className="w-5 h-5" />
                <span className="text-xs">Transfer</span>
              </button>
            </div>
          </div>

          {/* Quantity - Large Touch Target */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Jumlah</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, parseInt(quantity) - 1).toString())}
                className="w-14 h-14 bg-gray-100 rounded-xl text-2xl font-bold text-gray-600 flex items-center justify-center active:bg-gray-200 active:scale-95 transition-all"
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
                className="w-14 h-14 bg-gray-100 rounded-xl text-2xl font-bold text-gray-600 flex items-center justify-center active:bg-gray-200 active:scale-95 transition-all"
              >
                +
              </button>
            </div>
            {/* Quick quantity buttons */}
            <div className="flex gap-2 mt-2">
              {[1, 5, 10, 25, 50].map(q => (
                <button
                  key={q}
                  onClick={() => setQuantity(q.toString())}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    quantity === q.toString()
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
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
              <label className="text-sm font-medium text-gray-700 mb-2 block">Arah Transfer</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTransferTo('toko')}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${
                    transferTo === 'toko'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Gudang → Toko
                </button>
                <button
                  onClick={() => setTransferTo('gudang')}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${
                    transferTo === 'gudang'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Toko → Gudang
                </button>
              </div>
            </div>
          )}

          {/* Note */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Catatan (opsional)</label>
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
            className={`w-full py-4 rounded-xl font-semibold text-white text-base active:scale-[0.98] transition-all shadow-lg ${
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
            <p className="text-sm font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Quick Select Product */}
      {!foundProduct && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Pilih Produk Cepat</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {products.slice(0, 8).map(product => (
              <button
                key={product.id}
                onClick={() => { setFoundProduct(product); setManualBarcode(product.barcode); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.barcode}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-500">
                    📦{product.stockGudang} | 🏪{product.stockToko}
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
