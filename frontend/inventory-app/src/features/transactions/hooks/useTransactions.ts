import { useState, useEffect } from 'react';
import { Transaction, TransactionFormData } from '../data/interfaces/Transaction';
import { TransactionService } from '../services/TransactionService';

const STORAGE_KEY = 'transactions';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<{ items: Transaction[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
          setTransactions(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Error al cargar transacciones del localStorage:', error);
      }
    };

    loadFromStorage();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await TransactionService.getAll();
      setTransactions(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      setError('Error al cargar las transacciones');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transaction: TransactionFormData) => {
    try {
      setLoading(true);
      setError(null);
      const newTransaction = await TransactionService.create(transaction);
      setTransactions(prev => {
        if (!prev) return { items: [newTransaction] };
        return {
          items: [newTransaction, ...prev.items]
        };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        items: [newTransaction, ...(transactions?.items || [])]
      }));
      return newTransaction;
    } catch (error) {
      setError('Error al crear la transacción');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id: number, transaction: Partial<Transaction>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTransaction = await TransactionService.update(id, transaction);
      setTransactions(prev => {
        if (!prev) return null;
        return {
          items: prev.items.map(t => 
            t.id === id ? { ...t, ...updatedTransaction } : t
          )
        };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        items: transactions?.items.map(t => 
          t.id === id ? { ...t, ...updatedTransaction } : t
        ) || []
      }));
      return updatedTransaction;
    } catch (error) {
      setError('Error al actualizar la transacción');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransaction
  };
}; 