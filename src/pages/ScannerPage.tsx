import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Camera, X, Package, ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, Check, AlertCircle } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { Product } from '../types';

export default function ScannerPage() {
  const { getProductByBarcode, addTransaction, user } = useApp();
  const [manualBarcode, setManualBarcode] = useState('');
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const [actionType, setActionType] = useState<'in' | 'out' | 'transfer'>('in');
  const [actionQty, setActionQty] = useState('1');
  const [actionNote, setActionNote] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const startScanner = async () => {
    setError('');
    setIsScanning(true);
    
    try {
      const html5QrCode = new Html5Qrcode("scanner-container");
      scannerRef.current = html5QrCode;
      
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText) => {
          handleBarcodeScanned(decodedText);
          html5QrCode.stop().catch(() => {});
          setIsScanning(false);
        },
        () => {}
      );
    } catch (err) {
      setError('Tidak dapat mengakses kamera. Gunakan input manual.');
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (e) {}
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleBarcodeScanned = (barcode: string) => {
    const product = getProductByBarcode(barcode);
    if (product) {
      setScannedProduct(product);
      setError('');
    } else {
      setError(`Produk dengan barcode "${barcode}" tidak ditemukan`);
      setScannedProduct(null);
    }
  };

  const handleManualSearch = () => {
    if (manualBarcode.trim()) {
      handleBarcodeScanned(manualBarcode.trim());
    }
  };

  const handleAction = () => {
    if (!scannedProduct || !actionQty) return;
    const qty = parseInt(actionQty);
    if (isNaN(qty) || qty <= 0) return;

    addTransaction({
      productId: scannedProduct.id,
      productName: scannedProduct.name,
      type: actionType,
      quantity: qty,
      from: actionType === 'transfer' ? 'gudang' : (actionType === 'in' ? 'gudang' : 'toko'),
      to: actionType === 'transfer' ? 'toko' : undefined,
      date: new Date().toISOString(),
      note: actionNote || `Scan barcode - ${actionType === 'in' ? 'Barang masuk' : actionType === 'out' ? 'Barang keluar' : 'Transfer'}`,
      user: user?.name || 'Unknown'
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setScannedProduct(null);
      setShowAction(false);
      setActionQty('1');
      setActionNote('');
    }, 2000);
  };

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Scan Barcode</h1>
        <p className="text-sm text-gray-500">Scan barcode produk untuk update stok cepat</p>
      </div>

      {/* Scanner Area */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        {!isScanning ? (
          <div className="text-center py-8">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-12 h-12 text-blue-500" />
            </div>
            <p className="text-gray-600 font-medium mb-2">Scan Barcode Produk</p>
            <p className="text-sm text-gray-400 mb-4">Arahkan kamera ke barcode produk</p>
            <button
              onClick={startScanner}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-2 mx-auto"
            >
              <Camera className="w-5 h-5" />
              Buka Kamera
            </button>
          </div>
        ) : (
          <div className="relative">
            <div id="scanner-container" ref={scannerContainerRef} className="rounded-xl overflow-hidden"></div>
            <button
              onClick={stopScanner}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-white text-sm bg-black/50 rounded-lg px-3 py-1.5 inline-block backdrop-blur-sm">
                Arahkan ke barcode...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Manual Input */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <p className="text-sm font-medium text-gray-600 mb-2">Input Manual Barcode</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
            placeholder="Masukkan kode barcode..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
          />
          <button
            onClick={handleManualSearch}
            className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-3 rounded-xl font-medium transition-all"
          >
            Cari
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-4 flex items-center gap-3 animate-pulse">
          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p className="text-sm text-green-600 font-medium">Stok berhasil diperbarui!</p>
        </div>
      )}

      {/* Scanned Product */}
      {scannedProduct && !showAction && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{scannedProduct.name}</h3>
              <p className="text-xs text-gray-500">Barcode: {scannedProduct.barcode}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-purple-50 rounded-xl p-3 text-center">
              <p className="text-xs text-purple-500">Gudang</p>
              <p className="text-xl font-bold text-purple-700">{scannedProduct.stockGudang}</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3 text-center">
              <p className="text-xs text-emerald-500">Toko</p>
              <p className="text-xl font-bold text-emerald-700">{scannedProduct.stockToko}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => { setActionType('in'); setShowAction(true); }}
              className="py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium text-sm transition-all"
            >
              📥 Masuk
            </button>
            <button
              onClick={() => { setActionType('out'); setShowAction(true); }}
              className="py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium text-sm transition-all"
            >
              📤 Keluar
            </button>
            <button
              onClick={() => { setActionType('transfer'); setShowAction(true); }}
              className="py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium text-sm transition-all"
            >
              🔄 Transfer
            </button>
          </div>
        </div>
      )}

      {/* Action Form */}
      {showAction && scannedProduct && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">
              {actionType === 'in' ? '📥 Barang Masuk' : actionType === 'out' ? '📤 Barang Keluar' : '🔄 Transfer'}
            </h3>
            <button onClick={() => setShowAction(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-3 mb-4">
            <p className="font-medium text-gray-800">{scannedProduct.name}</p>
            <p className="text-sm text-gray-500">
              Gudang: {scannedProduct.stockGudang} | Toko: {scannedProduct.stockToko}
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Jumlah</label>
              <input
                type="number"
                value={actionQty}
                onChange={(e) => setActionQty(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-lg font-bold text-center"
                min="1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Catatan (opsional)</label>
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
              ✓ Konfirmasi
            </button>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="mt-6 bg-amber-50 border border-amber-100 rounded-2xl p-4">
        <p className="text-sm font-medium text-amber-700 mb-2">💡 Tips:</p>
        <ul className="text-xs text-amber-600 space-y-1">
          <li>• Pastikan barcode terlihat jelas di kamera</li>
          <li>• Gunakan cahaya yang cukup untuk scan</li>
          <li>• Bisa juga input barcode secara manual</li>
          <li>• Transfer memindahkan stok dari gudang ke toko</li>
        </ul>
      </div>
    </div>
  );
}
