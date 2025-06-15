export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  price: number;
  stock: number;
}

export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  price: number;
  stock: number;
} 