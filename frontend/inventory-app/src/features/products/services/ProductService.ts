import { Product, ProductFormData } from '../data/interfaces/Product';

const API_URL = 'http://localhost:7299';

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export class ProductService {
  static async getAll(): Promise<{ items: Product[] }> {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('Error al obtener los productos');
    }
    const data = await response.json();
    return { items: data };
  }

  static async getById(id: number): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener el producto');
    }
    return response.json();
  }

  static async create(product: ProductFormData): Promise<Product> {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error('Error al crear el producto');
    }
    return response.json();
  }

  static async update(id: number, product: ProductFormData): Promise<Product> {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el producto');
      }

      // Si la respuesta está vacía, devolvemos el producto actualizado
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return { id, ...product };
      }

      // Si hay respuesta JSON, la procesamos
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Error al actualizar el producto');
    }
  }

  static async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error al eliminar el producto');
    }
  }
} 