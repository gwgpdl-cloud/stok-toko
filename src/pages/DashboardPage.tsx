import React from 'react';
import { useApp } from '../context/AppContext';
import { Package, AlertTriangle, ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, TrendingUp, Warehouse, Store } from 'lucide-react';

export default function DashboardPage() {
  const { products, transactions, user } = useApp();

  const totalGudang = products.reduce((sum, p) => sum + p.stockGudang, 0);
  const totalToko = products.reduce((sum, p) => sum + p.stockToko, 0);
  const lowStockProducts = products.filter(p => p.stockToko <= p.minStock);
  const todayTransactions = transactions.filter(t => {
    const today = new Date().toDateString();
    return new Date(t.date).toDateString() === today;
  });
  const totalProducts = products.length;

  const stats = [
    { label: 'Total Produk', value: totalProducts, icon: Package, color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-600' },
    { label: 'Stok Gudang', value: totalGudang.toLocaleString(), icon: Warehouse, color: 'bg-purple-500', lightColor: 'bg-purple-50', textColor: 'text-purple-600' },
    { label: 'Stok Toko', value: totalToko.toLocaleString(), icon: Store, color: 'bg-emerald-500', lightColor: 'bg-emerald-50', textColor: 'text-emerald-600' },
    { label: 'Stok Rendah', value: lowStockProducts.length, icon: AlertTriangle, color: 'bg-red-500', lightColor: 'bg-red-50', textColor: 'text-red-600' },
  ];

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Selamat Datang, {user?.name} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {user?.role === 'admin' ? 'Panel Administrator' : 'Panel Operator'} • {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`${stat.lightColor} rounded-2xl p-4 md:p-5 border border-white/50 shadow-sm`}>
            <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-sm`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-2xl p-4 md:p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-red-700">Peringatan Stok Rendah</h3>
          </div>
          <div className="space-y-2">
            {lowStockProducts.slice(0, 3).map(p => (
              <div key={p.id} className="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2">
                <div>
                  <p className="font-medium text-sm text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-500">Min. stok: {p.minStock} {p.unit}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">{p.stockToko}</p>
                  <p className="text-xs text-gray-400">di toko</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Aktivitas Terakhir</h3>
          <span className="text-xs text-gray-400">{todayTransactions.length} transaksi hari ini</span>
        </div>
        <div className="space-y-2">
          {recentTransactions.map(t => (
            <div key={t.id} className="bg-white rounded-xl p-3 md:p-4 border border-gray-100 shadow-sm flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                t.type === 'in' ? 'bg-green-100' : t.type === 'out' ? 'bg-red-100' : 'bg-blue-100'
              }`}>
                {t.type === 'in' ? <ArrowDownCircle className="w-5 h-5 text-green-600" /> :
                 t.type === 'out' ? <ArrowUpCircle className="w-5 h-5 text-red-600" /> :
                 <ArrowLeftRight className="w-5 h-5 text-blue-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-800 truncate">{t.productName}</p>
                <p className="text-xs text-gray-500">
                  {t.type === 'in' ? 'Barang Masuk' : t.type === 'out' ? 'Barang Keluar' : 'Transfer'}
                  {' • '}{t.quantity} {t.from === 'gudang' ? 'gudang' : 'toko'}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`font-bold text-sm ${
                  t.type === 'in' ? 'text-green-600' : t.type === 'out' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {t.type === 'in' ? '+' : t.type === 'out' ? '-' : '→'}{t.quantity}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(t.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5" />
          <h3 className="font-semibold">Ringkasan Stok</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <p className="text-blue-200 text-xs">Total Gudang</p>
            <p className="text-2xl font-bold">{totalGudang.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs">Total Toko</p>
            <p className="text-2xl font-bold">{totalToko.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="flex justify-between text-sm">
            <span className="text-blue-200">Rasio Gudang:Toko</span>
            <span className="font-semibold">{totalGudang > 0 ? (totalGudang / Math.max(totalToko, 1)).toFixed(1) : 0}x</span>
          </div>
        </div>
      </div>
    </div>
  );
}
