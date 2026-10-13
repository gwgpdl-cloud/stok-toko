import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, Product, StockTransaction, Page } from '../types';

interface AppContextType {
  user: User | null;
  currentPage: Page;
  products: Product[];
  transactions: StockTransaction[];
  login: (role: 'admin' | 'operator') => void;
  logout: () => void;
  setCurrentPage: (page: Page) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addTransaction: (transaction: Omit<StockTransaction, 'id' | 'date'>) => void;
  getProductByBarcode: (barcode: string) => Product | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialProducts: Product[] = [
  { id: '1', name: 'Indomie Goreng', barcode: '8991001234567', category: 'Makanan', unit: 'pcs', stockGudang: 240, stockToko: 48, minStock: 20, price: 3500 },
  { id: '2', name: 'Aqua 600ml', barcode: '8991002345678', category: 'Minuman', unit: 'botol', stockGudang: 120, stockToko: 36, minStock: 24, price: 4000 },
  { id: '3', name: 'Sabun Lifebuoy', barcode: '8991003456789', category: 'Kebersihan', unit: 'pcs', stockGudang: 60, stockToko: 24, minStock: 12, price: 5500 },
  { id: '4', name: 'Beras Premium 5kg', barcode: '8991004567890', category: 'Sembako', unit: 'karung', stockGudang: 30, stockToko: 10, minStock: 5, price: 75000 },
  { id: '5', name: 'Minyak Goreng 2L', barcode: '8991005678901', category: 'Sembako', unit: 'botol', stockGudang: 45, stockToko: 15, minStock: 10, price: 32000 },
  { id: '6', name: 'Gula Pasir 1kg', barcode: '8991006789012', category: 'Sembako', unit: 'pack', stockGudang: 50, stockToko: 20, minStock: 10, price: 15000 },
  { id: '7', name: 'Kopi Kapal Api', barcode: '8991007890123', category: 'Minuman', unit: 'sachet', stockGudang: 200, stockToko: 60, minStock: 30, price: 2000 },
  { id: '8', name: 'Teh Pucuk 350ml', barcode: '8991008901234', category: 'Minuman', unit: 'botol', stockGudang: 96, stockToko: 30, minStock: 12, price: 5000 },
  { id: '9', name: 'Pasta Gigi Pepsodent', barcode: '8991009012345', category: 'Kebersihan', unit: 'tube', stockGudang: 36, stockToko: 12, minStock: 6, price: 12000 },
  { id: '10', name: 'Tisu Paseo 250s', barcode: '8991010123456', category: 'Kebersihan', unit: 'pack', stockGudang: 48, stockToko: 18, minStock: 8, price: 9000 },
];

const initialTransactions: StockTransaction[] = [
  { id: '1', productId: '1', productName: 'Indomie Goreng', type: 'in', quantity: 100, from: 'gudang', date: '2025-01-15T08:30:00', note: 'Restok dari supplier', user: 'Admin' },
  { id: '2', productId: '2', productName: 'Aqua 600ml', type: 'transfer', quantity: 24, from: 'gudang', to: 'toko', date: '2025-01-15T09:00:00', note: 'Restok toko', user: 'Admin' },
  { id: '3', productId: '3', productName: 'Sabun Lifebuoy', type: 'out', quantity: 6, from: 'toko', date: '2025-01-15T10:15:00', note: 'Penjualan', user: 'Operator' },
  { id: '4', productId: '4', productName: 'Beras Premium 5kg', type: 'in', quantity: 20, from: 'gudang', date: '2025-01-14T07:45:00', note: 'Pembelian dari distributor', user: 'Admin' },
  { id: '5', productId: '5', productName: 'Minyak Goreng 2L', type: 'out', quantity: 3, from: 'toko', date: '2025-01-14T14:20:00', note: 'Penjualan', user: 'Operator' },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [transactions, setTransactions] = useState<StockTransaction[]>(initialTransactions);

  const login = useCallback((role: 'admin' | 'operator') => {
    setUser({
      id: role === 'admin' ? '1' : '2',
      name: role === 'admin' ? 'Admin Toko' : 'Operator Toko',
      role,
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCurrentPage('dashboard');
  }, []);

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    const id = Date.now().toString();
    setProducts(prev => [...prev, { ...product, id }]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const addTransaction = useCallback((transaction: Omit<StockTransaction, 'id' | 'date'>) => {
    const id = Date.now().toString();
    const date = new Date().toISOString();
    setTransactions(prev => [{ ...transaction, id, date }, ...prev]);

    // Update stock
    setProducts(prev => prev.map(p => {
      if (p.id !== transaction.productId) return p;
      const updates: Partial<Product> = {};
      if (transaction.type === 'in' && transaction.from === 'gudang') {
        updates.stockGudang = p.stockGudang + transaction.quantity;
      } else if (transaction.type === 'in' && transaction.from === 'toko') {
        updates.stockToko = p.stockToko + transaction.quantity;
      } else if (transaction.type === 'out' && transaction.from === 'gudang') {
        updates.stockGudang = Math.max(0, p.stockGudang - transaction.quantity);
      } else if (transaction.type === 'out' && transaction.from === 'toko') {
        updates.stockToko = Math.max(0, p.stockToko - transaction.quantity);
      } else if (transaction.type === 'transfer') {
        if (transaction.from === 'gudang' && transaction.to === 'toko') {
          updates.stockGudang = Math.max(0, p.stockGudang - transaction.quantity);
          updates.stockToko = p.stockToko + transaction.quantity;
        } else if (transaction.from === 'toko' && transaction.to === 'gudang') {
          updates.stockToko = Math.max(0, p.stockToko - transaction.quantity);
          updates.stockGudang = p.stockGudang + transaction.quantity;
        }
      }
      return { ...p, ...updates };
    }));
  }, []);

  const getProductByBarcode = useCallback((barcode: string) => {
    return products.find(p => p.barcode === barcode);
  }, [products]);

  return (
    <AppContext.Provider value={{
      user, currentPage, products, transactions,
      login, logout, setCurrentPage, addProduct, updateProduct, deleteProduct,
      addTransaction, getProductByBarcode,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
