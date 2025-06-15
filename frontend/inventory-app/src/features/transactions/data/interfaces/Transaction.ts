export type TransactionType = 'Compra' | 'Venta';

export interface Transaction {
  id: number;
  date: string;
  type: TransactionType;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  details: string;
}

export interface TransactionFormData {
  type: TransactionType;
  productId: number;
  quantity: number;
  unitPrice: number;
  details: string;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
  productId?: number;
} 