import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Package, BarChart3, ScanLine, LogOut, ChevronRight, Shield, User, Bell } from 'lucide-react';

export default function Navigation() {
  const { user, currentPage, setCurrentPage, logout, products } = useApp();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const isAdmin = user?.role === 'admin';

  const lowStockCount = products.filter(p => p.stockToko <= p.minStock || p.stockGudang <= p.minStock).length;

  const navItems = [
    { key: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
    { key: 'stock', label: 'Stok', icon: Package },
    { key: 'scanner', label: 'Scan', icon: ScanLine, isScanner: true },
    { key: 'report', label: 'Laporan', icon: BarChart3, adminOnly: true },
  ].filter(item => !item.adminOnly || isAdmin);

  const handleNavClick = (key: string) => {
    setCurrentPage(key as any);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-100 z-40">
        {/* Logo */}
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg ${
              isAdmin ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 'bg-gradient-to-br from-emerald-500 to-emerald-700'
            }`}>
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg tracking-tight">StokKu</h1>
              <p className="text-xs text-gray-400 font-medium">Manajemen Stok Toko</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="px-4 pt-5">
          <div className={`p-4 rounded-2xl ${isAdmin ? 'bg-gradient-to-br from-blue-50 to-indigo-50' : 'bg-gradient-to-br from-emerald-50 to-teal-50'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                isAdmin ? 'bg-blue-600' : 'bg-emerald-600'
              }`}>
                {isAdmin ? (
                  <Shield className="w-6 h-6 text-white" />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">{user?.name}</p>
                <p className={`text-xs font-medium ${isAdmin ? 'text-blue-600' : 'text-emerald-600'}`}>
                  {isAdmin ? 'Admin - Desktop' : 'Operator - Mobile'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Menu</p>
          <div className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                  currentPage === item.key
                    ? isAdmin
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {currentPage === item.key && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-50">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Keluar Akun
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100/50 z-30">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isAdmin ? 'bg-blue-600' : 'bg-emerald-600'
            }`}>
              <Package className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-[15px] leading-tight">StokKu</h1>
              <p className="text-[10px] text-gray-400 font-medium leading-tight">
                {isAdmin ? 'Admin Panel' : 'Operator Panel'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {lowStockCount > 0 && (
              <div className="relative">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {lowStockCount}
                </span>
              </div>
            )}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 text-gray-400 active:text-red-500 active:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100/50 z-30 safe-area-bottom">
        <div className="flex items-end justify-around px-1 pt-2 pb-1">
          {navItems.map(item => {
            const isActive = currentPage === item.key;
            
            if (item.isScanner) {
              return (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className="flex flex-col items-center -mt-5"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all active:scale-90 ${
                    isActive
                      ? isAdmin
                        ? 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-300'
                        : 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-emerald-300'
                      : 'bg-gradient-to-br from-gray-700 to-gray-900 shadow-gray-300'
                  }`}>
                    <ScanLine className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-[10px] font-semibold mt-1 ${
                    isActive
                      ? isAdmin ? 'text-blue-600' : 'text-emerald-600'
                      : 'text-gray-500'
                  }`}>
                    Scan
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all active:scale-90 ${
                  isActive
                    ? isAdmin
                      ? 'text-blue-600'
                      : 'text-emerald-600'
                    : 'text-gray-400'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? isAdmin ? 'bg-blue-50' : 'bg-emerald-50'
                    : ''
                }`}>
                  <item.icon className={`w-5 h-5 transition-all ${isActive ? 'scale-105' : ''}`} />
                </div>
                <span className="text-[10px] font-semibold">
                  {item.label}
                </span>
                {isActive && (
                  <div className={`w-1 h-1 rounded-full mt-0.5 ${
                    isAdmin ? 'bg-blue-600' : 'bg-emerald-600'
                  }`} />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Keluar Akun?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">Anda perlu login kembali untuk mengakses aplikasi.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => { logout(); setShowLogoutConfirm(false); }}
                className="flex-1 py-3.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-200"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
