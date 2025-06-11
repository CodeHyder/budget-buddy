// frontend/src/hooks/transactions/useCreateTransaction.ts
import { useState } from 'react';
import { Transaction } from './useFetchTransactions'; // Reutilize a tipagem de Transaction

// A tipagem para o DTO de criação, baseada no backend
type CreateTransactionDto = {
  userId: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'REIMBURSEMENT' | 'BILL';
  category: string;
  date: string; // backend recebe como string
  isPaid: boolean;
};

export const useCreateTransaction = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Transaction | null>(null);

  const createTransaction = async (transactionData: CreateTransactionDto) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch('http://localhost:3000/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create transaction');
      }

      const newTransaction: Transaction = await response.json();
      setData(newTransaction);
      return newTransaction;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createTransaction, data, loading, error };
};