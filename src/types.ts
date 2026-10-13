export type Role = 'admin' | 'operator';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  barcode: string;
  category: string;
  unit: string;
  stockGudang: number;
  stockToko: number;
  minStock: number;
  price: number;
  image?: string;
}

export interface StockTransaction {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'transfer';
  quantity: number;
  from: 'gudang' | 'toko';
  to?: 'gudang' | 'toko';
  date: string;
  note: string;
  user: string;
}

export type Page = 'dashboard' | 'stock' | 'report' | 'scanner' | 'add-product' | 'edit-product';
