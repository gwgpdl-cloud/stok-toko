import React from 'react';
import { useApp } from '../context/AppContext';
import { Page } from '../types';
import { Home, Package, FileText, ScanLine, LogOut } from 'lucide-react';

export default function Navigation() {
  const { user, currentPage, setCurrentPage, logout } = useApp();

  const navItems: { key: Page; label: string; icon: React.ElementType; adminOnly?: boolean }[] = [
    { key: 'dashboard', label: 'Beranda', icon: Home },
    { key: 'stock', label: 'Stok', icon: Package },
    { key: 'report', label: 'Laporan', icon: FileText, adminOnly: true },
    { key: 'scanner', label: 'Scan', icon: ScanLine },
  ];

  const filteredNav = navItems.filter(item => {
    if (item.adminOnly && user?.role !== 'admin') return false;
    return true;
  });

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-40 md:hidden safe-area-bottom">
        <div className="flex items-center justify-around py-2 px-2">
          {filteredNav.map((item) => {
            const isActive = currentPage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setCurrentPage(item.key)}
                className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all min-w-[60px] ${
                  isActive
                    ? user?.role === 'admin' 
                      ? 'text-blue-600' 
                      : 'text-emerald-600'
                    : 'text-gray-400'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all ${
                  isActive 
                    ? user?.role === 'admin' 
                      ? 'bg-blue-100' 
                      : 'bg-emerald-100'
                    : ''
                }`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={logout}
            className="flex flex-col items-center py-1.5 px-3 rounded-xl text-gray-400 min-w-[60px]"
          >
            <div className="p-1.5 rounded-xl">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium mt-0.5">Keluar</span>
          </button>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 shadow-sm z-40">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              user?.role === 'admin' ? 'bg-blue-500' : 'bg-emerald-500'
            }`}>
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 text-lg">StokKu</h1>
              <p className="text-xs text-gray-400">
                {user?.role === 'admin' ? 'Admin Panel' : 'Operator Panel'}
              </p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              user?.role === 'admin' ? 'bg-blue-100' : 'bg-emerald-100'
            }`}>
              <span className="font-bold text-sm">
                {user?.role === 'admin' ? '👨‍💼' : '👷'}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-800 text-sm">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1">
          {filteredNav.map((item) => {
            const isActive = currentPage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setCurrentPage(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? user?.role === 'admin'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
                {item.adminOnly && (
                  <span className="ml-auto text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md font-medium">Admin</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
