import React from 'react';
import { useApp } from '../context/AppContext';
import { Package, Warehouse, Store, AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw, ScanLine, TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function DashboardPage() {
  const { user, products, transactions, setCurrentPage } = useApp();
  const isAdmin = user?.role === 'admin';

  const totalStockGudang = products.reduce((acc, p) => acc + p.stockGudang, 0);
  const totalStockToko = products.reduce((acc, p) => acc + p.stockToko, 0);
  const lowStockProducts = products.filter(p => p.stockToko <= p.minStock || p.stockGudang <= p.minStock);
  const totalProducts = products.length;

  const recentTransactions = transactions.slice(0, 5);

  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Selamat Pagi' : today.getHours() < 17 ? 'Selamat Siang' : 'Selamat Malam';

  return (
    <div className="px-4 py-4 md:px-6 md:py-6 pb-6">
      {/* Header */}
      <div className="mb-5">
        <p className="text-sm text-gray-500 font-medium">{greeting},</p>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mt-0.5">
          {user?.name}
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          {today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Quick Scan Banner - Mobile Only */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setCurrentPage('scanner')}
          className={`w-full rounded-2xl p-4 flex items-center gap-3 shadow-lg active:scale-[0.98] transition-transform ${
            isAdmin
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-200'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-200'
          }`}
        >
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <ScanLine className="w-5 h-5 text-white" />
          </div>
          <div className="text-left flex-1">
            <p className="font-bold text-white text-sm">Scan Barcode</p>
            <p className="text-white/70 text-xs">Update stok dengan cepat</p>
          </div>
          <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Stats Cards - Mobile Optimized */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4 mb-5">
        <div className="bg-white rounded-2xl p-3.5 md:p-5 shadow-sm border border-gray-100/80">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Package className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            </div>
            <TrendingUp className="w-3.5 h-3.5 text-green-500 hidden md:block" />
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-900">{totalProducts}</p>
          <p className="text-[11px] md:text-xs text-gray-400 mt-0.5 font-medium">Total Produk</p>
        </div>

        <div className="bg-white rounded-2xl p-3.5 md:p-5 shadow-sm border border-gray-100/80">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <Warehouse className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-900">{totalStockGudang.toLocaleString()}</p>
          <p className="text-[11px] md:text-xs text-gray-400 mt-0.5 font-medium">Stok Gudang</p>
        </div>

        <div className="bg-white rounded-2xl p-3.5 md:p-5 shadow-sm border border-gray-100/80">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Store className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-900">{totalStockToko.toLocaleString()}</p>
          <p className="text-[11px] md:text-xs text-gray-400 mt-0.5 font-medium">Stok Toko</p>
        </div>

        <div className="bg-white rounded-2xl p-3.5 md:p-5 shadow-sm border border-gray-100/80">
          <div className="flex items-center justify-between mb-2">
            <div className={`w-9 h-9 md:w-10 md:h-10 ${lowStockProducts.length > 0 ? 'bg-amber-50' : 'bg-green-50'} rounded-xl flex items-center justify-center`}>
              <AlertTriangle className={`w-4 h-4 md:w-5 md:h-5 ${lowStockProducts.length > 0 ? 'text-amber-500' : 'text-green-500'}`} />
            </div>
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-900">{lowStockProducts.length}</p>
          <p className="text-[11px] md:text-xs text-gray-400 mt-0.5 font-medium">Stok Menipis</p>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm md:text-base font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              Peringatan Stok Menipis
            </h2>
            <button
              onClick={() => setCurrentPage('stock')}
              className="text-xs text-blue-600 font-semibold active:opacity-70"
            >
              Lihat
            </button>
          </div>
          <div className="space-y-2">
            {lowStockProducts.slice(0, 3).map(product => (
              <div key={product.id} className="bg-white rounded-xl p-3 shadow-sm border border-amber-100/50 flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{product.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-purple-600 font-medium">Gudang: {product.stockGudang}</span>
                    <span className="text-[11px] text-emerald-600 font-medium">Toko: {product.stockToko}</span>
                  </div>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-lg font-bold">
                  LOW
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm md:text-base font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-400" />
            Aktivitas Terbaru
          </h2>
          {isAdmin && (
            <button
              onClick={() => setCurrentPage('report')}
              className="text-xs text-blue-600 font-semibold active:opacity-70"
            >
              Semua
            </button>
          )}
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
          {recentTransactions.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-10 h-10 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Belum ada aktivitas</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentTransactions.map(t => (
                <div key={t.id} className="p-3 md:p-4 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    t.type === 'in' ? 'bg-green-50' : t.type === 'out' ? 'bg-red-50' : 'bg-blue-50'
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
                    <p className="font-semibold text-gray-800 text-sm truncate">{t.productName}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {t.type === 'in' ? 'Masuk' : t.type === 'out' ? 'Keluar' : 'Transfer'} | {t.quantity} {t.from === 'gudang' ? 'gudang' : 'toko'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-bold ${
                      t.type === 'in' ? 'text-green-600' : t.type === 'out' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {t.type === 'in' ? '+' : t.type === 'out' ? '-' : '~'}{t.quantity}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stock Overview - Desktop Only */}
      <div className="hidden md:block">
        <h2 className="text-base font-bold text-gray-900 mb-3">Stok per Kategori</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from(new Set(products.map(p => p.category))).map(category => {
            const catProducts = products.filter(p => p.category === category);
            const totalGudang = catProducts.reduce((a, p) => a + p.stockGudang, 0);
            const totalToko = catProducts.reduce((a, p) => a + p.stockToko, 0);
            return (
              <div key={category} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80">
                <h3 className="font-semibold text-gray-700 mb-3">{category}</h3>
                <div className="grid grid-cols-2 gap-3">
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
