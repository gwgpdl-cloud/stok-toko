import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, Calendar, Filter, Download, TrendingUp, Package } from 'lucide-react';

export default function ReportPage() {
  const { transactions, products } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out' | 'transfer'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = transactions.filter(t => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (dateFrom && new Date(t.date) < new Date(dateFrom)) return false;
    if (dateTo && new Date(t.date) > new Date(dateTo + 'T23:59:59')) return false;
    if (searchTerm && !t.productName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalIn = filtered.filter(t => t.type === 'in').reduce((sum, t) => sum + t.quantity, 0);
  const totalOut = filtered.filter(t => t.type === 'out').reduce((sum, t) => sum + t.quantity, 0);
  const totalTransfer = filtered.filter(t => t.type === 'transfer').reduce((sum, t) => sum + t.quantity, 0);

  const exportCSV = () => {
    const headers = 'Tanggal,Waktu,Produk,Tipe,Jumlah,Dari,Ke,Catatan,Petugas\n';
    const rows = filtered.map(t => {
      const d = new Date(t.date);
      return `${d.toLocaleDateString('id-ID')},${d.toLocaleTimeString('id-ID')},${t.productName},${
        t.type === 'in' ? 'Masuk' : t.type === 'out' ? 'Keluar' : 'Transfer'
      },${t.quantity},${t.from},${t.to || '-'},${t.note},${t.user}`;
    }).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-stok-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Laporan Stok</h1>
          <p className="text-sm text-gray-500">Keluar masuk barang</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span className="hidden md:inline">Export CSV</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
          <ArrowDownCircle className="w-6 h-6 text-green-500 mb-2" />
          <p className="text-2xl font-bold text-green-700">{totalIn.toLocaleString()}</p>
          <p className="text-xs text-green-600">Barang Masuk</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
          <ArrowUpCircle className="w-6 h-6 text-red-500 mb-2" />
          <p className="text-2xl font-bold text-red-700">{totalOut.toLocaleString()}</p>
          <p className="text-xs text-red-600">Barang Keluar</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <ArrowLeftRight className="w-6 h-6 text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-blue-700">{totalTransfer.toLocaleString()}</p>
          <p className="text-xs text-blue-600">Transfer</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter</span>
        </div>
        
        {/* Type Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { key: 'all', label: 'Semua', icon: '📋' },
            { key: 'in', label: 'Masuk', icon: '📥' },
            { key: 'out', label: 'Keluar', icon: '📤' },
            { key: 'transfer', label: 'Transfer', icon: '🔄' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilterType(f.key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filterType === f.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>

        {/* Date Filter */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Dari Tanggal</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sampai Tanggal</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari nama produk..."
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-500 outline-none"
        />
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {filtered.map(t => (
          <div key={t.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                t.type === 'in' ? 'bg-green-100' : t.type === 'out' ? 'bg-red-100' : 'bg-blue-100'
              }`}>
                {t.type === 'in' ? <ArrowDownCircle className="w-5 h-5 text-green-600" /> :
                 t.type === 'out' ? <ArrowUpCircle className="w-5 h-5 text-red-600" /> :
                 <ArrowLeftRight className="w-5 h-5 text-blue-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{t.productName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {t.type === 'in' ? '📥 Barang Masuk' : t.type === 'out' ? '📤 Barang Keluar' : '🔄 Transfer'}
                      {' • '}{t.quantity} unit
                    </p>
                  </div>
                  <span className={`text-sm font-bold ${
                    t.type === 'in' ? 'text-green-600' : t.type === 'out' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {t.type === 'in' ? '+' : t.type === 'out' ? '-' : '→'}{t.quantity}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(t.date).toLocaleDateString('id-ID')} {new Date(t.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span>👤 {t.user}</span>
                </div>
                {t.note && (
                  <p className="text-xs text-gray-500 mt-1 bg-gray-50 rounded-lg px-2 py-1">💬 {t.note}</p>
                )}
                {t.type === 'transfer' && (
                  <p className="text-xs text-blue-500 mt-1">
                    {t.from === 'gudang' ? '🏭 Gudang' : '🏪 Toko'} → {t.to === 'toko' ? '🏪 Toko' : '🏭 Gudang'}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Tidak ada transaksi ditemukan</p>
          <p className="text-xs text-gray-400 mt-1">Coba ubah filter atau tanggal</p>
        </div>
      )}

      {/* Summary Footer */}
      <div className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5" />
          <h3 className="font-semibold">Ringkasan Periode</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-indigo-200 text-xs">Total Masuk</p>
            <p className="text-xl font-bold">{totalIn.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-indigo-200 text-xs">Total Keluar</p>
            <p className="text-xl font-bold">{totalOut.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-indigo-200 text-xs">Total Transfer</p>
            <p className="text-xl font-bold">{totalTransfer.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/20 text-sm">
          <p className="text-indigo-200">Total Transaksi: <span className="font-semibold text-white">{filtered.length}</span></p>
        </div>
      </div>
    </div>
  );
}
