import { useState, useEffect } from 'react';
import { Product, ProductFormData } from '../data/interfaces/Product';
import { ProductService } from '../services/ProductService';

const STORAGE_KEY = 'products_data';

export const useProducts = () => {
  const [products, setProducts] = useState<{ items: Product[] }>({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProductService.getAll();
      setProducts(data);
      // Guardar en localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: ProductFormData) => {
    try {
      setLoading(true);
      setError(null);
      const newProduct = await ProductService.create(productData);
      const updatedProducts = {
        items: [...products.items, newProduct]
      };
      setProducts(updatedProducts);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el producto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: number, productData: ProductFormData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProduct = await ProductService.update(id, productData);
      const updatedProducts = {
        items: products.items.map(p => p.id === id ? updatedProduct : p)
      };
      setProducts(updatedProducts);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el producto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await ProductService.delete(id);
      const updatedProducts = {
        items: products.items.filter(p => p.id !== id)
      };
      setProducts(updatedProducts);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el producto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setProducts(parsedData);
      } catch (err) {
        console.error('Error al parsear datos del localStorage:', err);
      }
    }
    // Cargar datos del servidor
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
}; 