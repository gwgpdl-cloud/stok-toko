import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowDownRight, ArrowUpRight, RefreshCw, Filter, Calendar, Warehouse, Store, TrendingUp, TrendingDown, Package } from 'lucide-react';

export default function ReportPage() {
  const { transactions, products } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out' | 'transfer'>('all');
  const [filterLocation, setFilterLocation] = useState<'all' | 'gudang' | 'toko'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredTransactions = transactions.filter(t => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (filterLocation !== 'all' && t.from !== filterLocation) return false;
    if (dateFrom && new Date(t.date) < new Date(dateFrom)) return false;
    if (dateTo && new Date(t.date) > new Date(dateTo + 'T23:59:59')) return false;
    return true;
  });

  const totalIn = filteredTransactions.filter(t => t.type === 'in').reduce((a, t) => a + t.quantity, 0);
  const totalOut = filteredTransactions.filter(t => t.type === 'out').reduce((a, t) => a + t.quantity, 0);
  const totalTransfer = filteredTransactions.filter(t => t.type === 'transfer').reduce((a, t) => a + t.quantity, 0);

  return (
    <div className="p-4 sm:p-6 pb-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Laporan Stok</h1>
        <p className="text-sm text-gray-500">Keluar masuk barang & transfer stok</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <p className="text-xl font-bold text-green-700">{totalIn}</p>
          <p className="text-xs text-gray-500">Barang Masuk</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <p className="text-xl font-bold text-red-700">{totalOut}</p>
          <p className="text-xs text-gray-500">Barang Keluar</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-xl font-bold text-blue-700">{totalTransfer}</p>
          <p className="text-xs text-gray-500">Transfer</p>
        </div>
      </div>

      {/* Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 text-sm text-gray-600 mb-4 px-3 py-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50"
      >
        <Filter className="w-4 h-4" />
        Filter & Pencarian
        {showFilters ? '▲' : '▼'}
      </button>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">Tipe Transaksi</label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'Semua' },
                { key: 'in', label: 'Masuk' },
                { key: 'out', label: 'Keluar' },
                { key: 'transfer', label: 'Transfer' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilterType(f.key as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterType === f.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">Lokasi</label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'Semua' },
                { key: 'gudang', label: 'Gudang' },
                { key: 'toko', label: 'Toko' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilterLocation(f.key as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterLocation === f.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Dari Tanggal</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Sampai Tanggal</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={() => { setFilterType('all'); setFilterLocation('all'); setDateFrom(''); setDateTo(''); }}
            className="text-xs text-blue-600 font-medium hover:text-blue-700"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* Transaction List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-500">{filteredTransactions.length} transaksi</p>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Tidak ada transaksi ditemukan</p>
          </div>
        ) : (
          filteredTransactions.map(t => (
            <div key={t.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                t.type === 'in' ? 'bg-green-100' : t.type === 'out' ? 'bg-red-100' : 'bg-blue-100'
              }`}>
                {t.type === 'in' ? (
                  <ArrowDownRight className="w-5 h-5 text-green-600" />
                ) : t.type === 'out' ? (
                  <ArrowUpRight className="w-5 h-5 text-red-600" />
                ) : (
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">{t.productName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    t.type === 'in' ? 'bg-green-50 text-green-700' : t.type === 'out' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {t.type === 'in' ? 'Masuk' : t.type === 'out' ? 'Keluar' : 'Transfer'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {t.from === 'gudang' ? '📦 Gudang' : '🏪 Toko'}
                    {t.to && ` → ${t.to === 'gudang' ? '📦 Gudang' : '🏪 Toko'}`}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`font-bold text-sm ${
                  t.type === 'in' ? 'text-green-600' : t.type === 'out' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {t.type === 'in' ? '+' : t.type === 'out' ? '-' : '↔'}{t.quantity}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <p className="text-xs text-gray-400">{t.user}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
