import { Transaction, TransactionFormData } from '../data/interfaces/Transaction';

const API_URL = 'http://localhost:7299';

export class TransactionService {
  static async getAll(): Promise<{ items: Transaction[] }> {
    try {
      const response = await fetch(`${API_URL}/transactions`);
      if (!response.ok) {
        throw new Error('Error al obtener las transacciones');
      }
      const data = await response.json();
      return { items: data };
    } catch (error) {
      throw new Error('Error al obtener las transacciones');
    }
  }

  static async create(transaction: TransactionFormData): Promise<Transaction> {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...transaction,
          date: new Date().toISOString(), // Formato correcto de fecha
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la transacción');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Error al crear la transacción');
    }
  }

  static async update(id: number, transaction: Partial<Transaction>): Promise<Transaction> {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...transaction,
          date: transaction.date ? new Date(transaction.date).toISOString() : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la transacción');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Error al actualizar la transacción');
    }
  }
} 