import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, StockTransaction, Role, Page } from '../types';

interface AppContextType {
  user: User | null;
  currentPage: Page;
  products: Product[];
  transactions: StockTransaction[];
  login: (username: string, password: string, role: Role) => boolean;
  logout: () => void;
  setCurrentPage: (page: Page) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addTransaction: (transaction: Omit<StockTransaction, 'id'>) => void;
  getProductByBarcode: (barcode: string) => Product | undefined;
  searchProducts: (query: string) => Product[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialProducts: Product[] = [
  { id: '1', barcode: '8991234567890', name: 'Indomie Goreng', category: 'Makanan', stockGudang: 500, stockToko: 48, minStock: 20, unit: 'pcs', price: 3500 },
  { id: '2', barcode: '8991234567891', name: 'Aqua 600ml', category: 'Minuman', stockGudang: 300, stockToko: 24, minStock: 10, unit: 'botol', price: 4000 },
  { id: '3', barcode: '8991234567892', name: 'Sabun Lifebuoy', category: 'Kebersihan', stockGudang: 200, stockToko: 36, minStock: 15, unit: 'pcs', price: 5000 },
  { id: '4', barcode: '8991234567893', name: 'Beras Premium 5kg', category: 'Makanan', stockGudang: 100, stockToko: 12, minStock: 5, unit: 'karung', price: 75000 },
  { id: '5', barcode: '8991234567894', name: 'Minyak Goreng 2L', category: 'Makanan', stockGudang: 150, stockToko: 18, minStock: 8, unit: 'botol', price: 35000 },
  { id: '6', barcode: '8991234567895', name: 'Gula Pasir 1kg', category: 'Makanan', stockGudang: 80, stockToko: 15, minStock: 5, unit: 'pack', price: 15000 },
  { id: '7', barcode: '8991234567896', name: 'Kopi Kapal Api', category: 'Minuman', stockGudang: 250, stockToko: 30, minStock: 10, unit: 'sachet', price: 2000 },
  { id: '8', barcode: '8991234567897', name: 'Pasta Gigi Pepsodent', category: 'Kebersihan', stockGudang: 180, stockToko: 24, minStock: 10, unit: 'pcs', price: 12000 },
  { id: '9', barcode: '8991234567898', name: 'Teh Botol Sosro', category: 'Minuman', stockGudang: 400, stockToko: 36, minStock: 12, unit: 'botol', price: 5000 },
  { id: '10', barcode: '8991234567899', name: 'Tissue Paseo', category: 'Kebersihan', stockGudang: 120, stockToko: 20, minStock: 8, unit: 'pack', price: 18000 },
];

const initialTransactions: StockTransaction[] = [
  { id: '1', productId: '1', productName: 'Indomie Goreng', type: 'in', quantity: 100, from: 'gudang', date: '2024-01-15T08:00:00', note: 'Restok dari supplier', user: 'Admin' },
  { id: '2', productId: '2', productName: 'Aqua 600ml', type: 'transfer', quantity: 24, from: 'gudang', to: 'toko', date: '2024-01-15T09:00:00', note: 'Transfer ke toko', user: 'Admin' },
  { id: '3', productId: '1', productName: 'Indomie Goreng', type: 'out', quantity: 12, from: 'toko', date: '2024-01-15T10:00:00', note: 'Penjualan', user: 'Operator' },
  { id: '4', productId: '3', productName: 'Sabun Lifebuoy', type: 'in', quantity: 50, from: 'gudang', date: '2024-01-14T08:00:00', note: 'Restok', user: 'Admin' },
  { id: '5', productId: '5', productName: 'Minyak Goreng 2L', type: 'transfer', quantity: 6, from: 'gudang', to: 'toko', date: '2024-01-14T11:00:00', note: 'Transfer ke toko', user: 'Admin' },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [transactions, setTransactions] = useState<StockTransaction[]>(initialTransactions);

  useEffect(() => {
    const saved = localStorage.getItem('stokku_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
    const savedProducts = localStorage.getItem('stokku_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    const savedTransactions = localStorage.getItem('stokku_transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('stokku_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('stokku_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('stokku_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('stokku_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const login = (username: string, password: string, role: Role): boolean => {
    if (role === 'admin' && username === 'admin' && password === 'admin123') {
      setUser({ id: '1', username: 'admin', name: 'Administrator', role: 'admin' });
      return true;
    }
    if (role === 'operator' && username === 'operator' && password === 'operator123') {
      setUser({ id: '2', username: 'operator', name: 'Operator Toko', role: 'operator' });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCurrentPage('dashboard');
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...product, id: Date.now().toString() };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addTransaction = (transaction: Omit<StockTransaction, 'id'>) => {
    const newTransaction: StockTransaction = { ...transaction, id: Date.now().toString() };
    setTransactions(prev => [newTransaction, ...prev]);

    // Update stock
    setProducts(prev => prev.map(p => {
      if (p.id === transaction.productId) {
        if (transaction.type === 'in') {
          if (transaction.from === 'gudang') return { ...p, stockGudang: p.stockGudang + transaction.quantity };
          return { ...p, stockToko: p.stockToko + transaction.quantity };
        }
        if (transaction.type === 'out') {
          if (transaction.from === 'gudang') return { ...p, stockGudang: Math.max(0, p.stockGudang - transaction.quantity) };
          return { ...p, stockToko: Math.max(0, p.stockToko - transaction.quantity) };
        }
        if (transaction.type === 'transfer') {
          return {
            ...p,
            stockGudang: Math.max(0, p.stockGudang - transaction.quantity),
            stockToko: p.stockToko + transaction.quantity
          };
        }
      }
      return p;
    }));
  };

  const getProductByBarcode = (barcode: string) => {
    return products.find(p => p.barcode === barcode);
  };

  const searchProducts = (query: string) => {
    const q = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.barcode.includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  };

  return (
    <AppContext.Provider value={{
      user, currentPage, products, transactions,
      login, logout, setCurrentPage,
      addProduct, updateProduct, deleteProduct, addTransaction,
      getProductByBarcode, searchProducts
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
