import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowDownRight, ArrowUpRight, RefreshCw, Filter, TrendingUp, TrendingDown, Package, X } from 'lucide-react';

export default function ReportPage() {
  const { transactions } = useApp();
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
    <div className="px-4 py-4 md:px-6 md:py-6 pb-6">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-lg md:text-xl font-bold text-gray-900">Laporan Stok</h1>
        <p className="text-xs text-gray-400 mt-0.5">Keluar masuk barang & transfer stok</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4">
        <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100/80">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-green-600" />
            </div>
          </div>
          <p className="text-lg md:text-xl font-bold text-green-700">{totalIn}</p>
          <p className="text-[10px] md:text-xs text-gray-400 font-medium">Barang Masuk</p>
        </div>
        <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100/80">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-3.5 h-3.5 text-red-600" />
            </div>
          </div>
          <p className="text-lg md:text-xl font-bold text-red-700">{totalOut}</p>
          <p className="text-[10px] md:text-xs text-gray-400 font-medium">Barang Keluar</p>
        </div>
        <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100/80">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            </div>
          </div>
          <p className="text-lg md:text-xl font-bold text-blue-700">{totalTransfer}</p>
          <p className="text-[10px] md:text-xs text-gray-400 font-medium">Transfer</p>
        </div>
      </div>

      {/* Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 text-xs text-gray-600 mb-3 px-3 py-2.5 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all font-semibold shadow-sm"
      >
        <Filter className="w-4 h-4" />
        Filter & Pencarian
        <span className="text-[10px]">{showFilters ? '▲' : '▼'}</span>
      </button>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/80 mb-4 space-y-3 animate-slide-up">
          <div>
            <label className="text-[10px] font-bold text-gray-500 mb-1.5 block uppercase tracking-wide">Tipe Transaksi</label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { key: 'all', label: 'Semua' },
                { key: 'in', label: 'Masuk' },
                { key: 'out', label: 'Keluar' },
                { key: 'transfer', label: 'Transfer' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilterType(f.key as any)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                    filterType === f.key
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 mb-1.5 block uppercase tracking-wide">Lokasi</label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { key: 'all', label: 'Semua' },
                { key: 'gudang', label: 'Gudang' },
                { key: 'toko', label: 'Toko' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilterLocation(f.key as any)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                    filterLocation === f.key
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-gray-500 mb-1 block uppercase tracking-wide">Dari Tanggal</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 mb-1 block uppercase tracking-wide">Sampai Tanggal</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={() => { setFilterType('all'); setFilterLocation('all'); setDateFrom(''); setDateTo(''); }}
            className="text-xs text-blue-600 font-bold hover:text-blue-700 active:opacity-70"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* Transaction List */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-xs text-gray-400 font-semibold">{filteredTransactions.length} transaksi</p>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Tidak ada transaksi ditemukan</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTransactions.map(t => (
              <div key={t.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100/80 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  t.type === 'in' ? 'bg-green-50' : t.type === 'out' ? 'bg-red-50' : 'bg-blue-50'
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
                  <p className="font-semibold text-gray-800 text-sm truncate">{t.productName}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      t.type === 'in' ? 'bg-green-50 text-green-700' : t.type === 'out' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {t.type === 'in' ? 'Masuk' : t.type === 'out' ? 'Keluar' : 'Transfer'}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {t.from === 'gudang' ? '📦' : '🏪'}
                      {t.to && ` → ${t.to === 'gudang' ? '📦' : '🏪'}`}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold ${
                    t.type === 'in' ? 'text-green-600' : t.type === 'out' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {t.type === 'in' ? '+' : t.type === 'out' ? '-' : '↔'}{t.quantity}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </p>
                  <p className="text-[10px] text-gray-400">{t.user}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
