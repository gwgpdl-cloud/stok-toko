export type Role = 'admin' | 'operator';

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  category: string;
  stockGudang: number;
  stockToko: number;
  minStock: number;
  unit: string;
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
