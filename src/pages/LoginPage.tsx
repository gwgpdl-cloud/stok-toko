import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { Package, Shield, User, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login } = useApp();
  const [role, setRole] = useState<Role>('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const success = login(username, password, role);
    if (!success) {
      setError('Username atau password salah!');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 shadow-lg">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">StokKu</h1>
          <p className="text-blue-200 mt-1">Sistem Manajemen Stok Toko</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Role Selector */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-600 mb-2 block">Pilih Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                  role === 'admin'
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Shield className={`w-8 h-8 mb-2 ${role === 'admin' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className={`font-semibold text-sm ${role === 'admin' ? 'text-blue-700' : 'text-gray-500'}`}>Admin</span>
                <span className="text-xs text-gray-400 mt-1">Laptop</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('operator')}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                  role === 'operator'
                    ? 'border-emerald-500 bg-emerald-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <User className={`w-8 h-8 mb-2 ${role === 'operator' ? 'text-emerald-600' : 'text-gray-400'}`} />
                <span className={`font-semibold text-sm ${role === 'operator' ? 'text-emerald-700' : 'text-gray-500'}`}>Operator</span>
                <span className="text-xs text-gray-400 mt-1">HP</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                placeholder="Masukkan username"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all pr-12"
                  placeholder="Masukkan password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg ${
                role === 'admin'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
              } ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl active:scale-[0.98]'}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Memproses...
                </span>
              ) : 'Masuk'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs font-medium text-gray-500 mb-2">Demo Credentials:</p>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">
                <span className="font-semibold">Admin:</span> admin / admin123
              </p>
              <p className="text-xs text-gray-500">
                <span className="font-semibold">Operator:</span> operator / operator123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
