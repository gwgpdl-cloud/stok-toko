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

const initialProducts: Product[] = [];

const initialTransactions: StockTransaction[] = [];

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
