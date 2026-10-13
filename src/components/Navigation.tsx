import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Package, BarChart3, ScanLine, LogOut, Menu, X, ChevronRight, Shield, User } from 'lucide-react';

export default function Navigation() {
  const { user, currentPage, setCurrentPage, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAdmin = user?.role === 'admin';

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'stock', label: 'Stok', icon: Package },
    ...(isAdmin ? [{ key: 'report', label: 'Laporan', icon: BarChart3 }] : []),
    { key: 'scanner', label: 'Scan', icon: ScanLine },
  ];

  const handleNavClick = (key: string) => {
    setCurrentPage(key as any);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isAdmin ? 'bg-blue-600' : 'bg-emerald-600'
            }`}>
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 text-lg">StokKu</h1>
              <p className="text-xs text-gray-400">Manajemen Stok</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 mx-3 mt-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isAdmin ? 'bg-blue-100' : 'bg-emerald-100'
            }`}>
              {isAdmin ? (
                <Shield className="w-5 h-5 text-blue-600" />
              ) : (
                <User className="w-5 h-5 text-emerald-600" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-800 text-sm">{user?.name}</p>
              <p className={`text-xs font-medium ${isAdmin ? 'text-blue-600' : 'text-emerald-600'}`}>
                {isAdmin ? '🖥️ Admin (Desktop)' : '📱 Operator (Mobile)'}
              </p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 mt-2">
          <div className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  currentPage === item.key
                    ? isAdmin
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
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
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-30 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isAdmin ? 'bg-blue-600' : 'bg-emerald-600'
            }`}>
              <Package className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 text-sm">StokKu</h1>
              <p className="text-xs text-gray-400">
                {isAdmin ? 'Admin Panel' : 'Operator Panel'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              isAdmin ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {isAdmin ? '🖥️ Admin' : '📱 Operator'}
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map(item => {
            const isActive = currentPage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[60px] ${
                  isActive
                    ? isAdmin
                      ? 'text-blue-600'
                      : 'text-emerald-600'
                    : 'text-gray-400'
                }`}
              >
                {item.key === 'scanner' ? (
                  <div className={`w-12 h-12 -mt-5 rounded-full flex items-center justify-center shadow-lg ${
                    isActive
                      ? isAdmin
                        ? 'bg-blue-600 shadow-blue-200'
                        : 'bg-emerald-600 shadow-emerald-200'
                      : 'bg-gray-700 shadow-gray-300'
                  }`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <item.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                )}
                <span className={`text-[10px] font-medium ${item.key === 'scanner' ? 'mt-0.5' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
