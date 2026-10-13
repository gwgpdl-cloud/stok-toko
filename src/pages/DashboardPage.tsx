import React from 'react';
import { useApp } from '../context/AppContext';
import { Package, Warehouse, Store, AlertTriangle, TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const { user, products, transactions, setCurrentPage } = useApp();
  const isAdmin = user?.role === 'admin';

  const totalStockGudang = products.reduce((acc, p) => acc + p.stockGudang, 0);
  const totalStockToko = products.reduce((acc, p) => acc + p.stockToko, 0);
  const lowStockProducts = products.filter(p => p.stockToko <= p.minStock || p.stockGudang <= p.minStock);
  const totalProducts = products.length;

  const todayTransactions = transactions.filter(t => {
    const today = new Date().toDateString();
    return new Date(t.date).toDateString() === today;
  });

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {isAdmin ? 'Dashboard Admin' : 'Dashboard Operator'}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Selamat datang, {user?.name} • {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalProducts}</p>
          <p className="text-xs text-gray-500 mt-1">Total Produk</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Warehouse className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalStockGudang.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Stok Gudang</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Store className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalStockToko.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Stok Toko</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 ${lowStockProducts.length > 0 ? 'bg-red-100' : 'bg-green-100'} rounded-xl flex items-center justify-center`}>
              <AlertTriangle className={`w-5 h-5 ${lowStockProducts.length > 0 ? 'text-red-600' : 'text-green-600'}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{lowStockProducts.length}</p>
          <p className="text-xs text-gray-500 mt-1">Stok Menipis</p>
        </div>
      </div>

      {/* Quick Actions - Mobile */}
      <div className="md:hidden mb-6">
        <button
          onClick={() => setCurrentPage('scanner')}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-4 flex items-center gap-4 shadow-lg shadow-blue-200 active:scale-[0.98] transition-transform"
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M4 8h16a2 2 0 002-2V5a2 2 0 00-2-2H4a2 2 0 00-2 2v1a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-left">
            <p className="font-semibold text-lg">Scan Barcode</p>
            <p className="text-blue-100 text-sm">Update stok dengan cepat</p>
          </div>
        </button>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Peringatan Stok Menipis
            </h2>
          </div>
          <div className="space-y-2">
            {lowStockProducts.slice(0, 3).map(product => (
              <div key={product.id} className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-red-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">
                    Toko: {product.stockToko} | Gudang: {product.stockGudang}
                  </p>
                </div>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                  Rendah
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Aktivitas Terbaru</h2>
          {isAdmin && (
            <button
              onClick={() => setCurrentPage('report')}
              className="text-sm text-blue-600 font-medium hover:text-blue-700"
            >
              Lihat Semua →
            </button>
          )}
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {recentTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Belum ada aktivitas</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentTransactions.map(t => (
                <div key={t.id} className="p-3 sm:p-4 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    t.type === 'in' ? 'bg-green-100' : t.type === 'out' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {t.type === 'in' ? (
                      <ArrowDownRight className="w-4 h-4 text-green-600" />
                    ) : t.type === 'out' ? (
                      <ArrowUpRight className="w-4 h-4 text-red-600" />
                    ) : (
                      <RefreshCw className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{t.productName}</p>
                    <p className="text-xs text-gray-500">
                      {t.type === 'in' ? 'Barang Masuk' : t.type === 'out' ? 'Barang Keluar' : 'Transfer'} • {t.quantity} {t.from === 'gudang' ? 'Gudang' : 'Toko'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400">
                      {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </p>
                    <p className="text-xs text-gray-400">{t.user}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stock Overview - Desktop */}
      <div className="hidden md:block">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Ringkasan Stok per Kategori</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from(new Set(products.map(p => p.category))).map(category => {
            const catProducts = products.filter(p => p.category === category);
            const totalGudang = catProducts.reduce((a, p) => a + p.stockGudang, 0);
            const totalToko = catProducts.reduce((a, p) => a + p.stockToko, 0);
            return (
              <div key={category} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-700 mb-3">{category}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-purple-50 rounded-xl">
                    <p className="text-lg font-bold text-purple-700">{totalGudang}</p>
                    <p className="text-xs text-purple-500">Gudang</p>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 rounded-xl">
                    <p className="text-lg font-bold text-emerald-700">{totalToko}</p>
                    <p className="text-xs text-emerald-500">Toko</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
