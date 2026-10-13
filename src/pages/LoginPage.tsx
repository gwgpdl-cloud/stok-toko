import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Shield, User, Store } from 'lucide-react';

export default function LoginPage() {
  const { login } = useApp();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'operator' | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    if (!selectedRole) return;
    setIsLoggingIn(true);
    setTimeout(() => {
      login(selectedRole);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-3">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">StokKu</h1>
          <p className="text-blue-100 text-sm">Sistem Manajemen Stok Toko</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 text-center mb-1">Masuk ke Akun</h2>
          <p className="text-gray-500 text-sm text-center mb-5">Pilih role Anda untuk melanjutkan</p>

          {/* Role Selection */}
          <div className="space-y-2.5 mb-5">
            <button
              onClick={() => setSelectedRole('admin')}
              className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all duration-200 active:scale-98 ${
                selectedRole === 'admin'
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                selectedRole === 'admin' ? 'bg-blue-500' : 'bg-gray-100'
              }`}>
                <Shield className={`w-5 h-5 ${selectedRole === 'admin' ? 'text-white' : 'text-gray-500'}`} />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-gray-800 text-sm">Admin</p>
                <p className="text-xs text-gray-500">Menggunakan Laptop / Desktop</p>
              </div>
              {selectedRole === 'admin' && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>

            <button
              onClick={() => setSelectedRole('operator')}
              className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all duration-200 active:scale-98 ${
                selectedRole === 'operator'
                  ? 'border-emerald-500 bg-emerald-50 shadow-md'
                  : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                selectedRole === 'operator' ? 'bg-emerald-500' : 'bg-gray-100'
              }`}>
                <User className={`w-5 h-5 ${selectedRole === 'operator' ? 'text-white' : 'text-gray-500'}`} />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-gray-800 text-sm">Operator</p>
                <p className="text-xs text-gray-500">Menggunakan HP / Mobile</p>
              </div>
              {selectedRole === 'operator' && (
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={!selectedRole || isLoggingIn}
            className={`w-full py-3.5 rounded-2xl font-bold text-white text-sm transition-all duration-200 active:scale-95 ${
              selectedRole
                ? selectedRole === 'admin'
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isLoggingIn ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Memasuk...
              </span>
            ) : (
              'Masuk'
            )}
          </button>

          {/* Info */}
          <div className="mt-5 p-3 bg-gray-50 rounded-xl">
            <div className="flex items-start gap-2">
              <Store className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-500 leading-relaxed">
                <strong>Admin</strong> memiliki akses penuh termasuk laporan masuk/keluar barang. 
                <strong> Operator</strong> fokus pada operasional toko dan scan barcode.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-blue-200 text-xs mt-5">
          StokKu v1.0 © 2025
        </p>
      </div>
    </div>
  );
}
