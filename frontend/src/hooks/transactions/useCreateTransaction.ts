// frontend/src/hooks/transactions/useCreateTransaction.ts
import { useState } from 'react';
import { Transaction } from './useFetchTransactions';
import axios, { AxiosError } from 'axios';

// DTO conforme o backend espera
export type CreateTransactionDto = {
  userId: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'REIMBURSEMENT' | 'BILL';
  category: string;
  date: string;
  isPaid: boolean;
};

// Recomendado: extrair o axios instance para reuso
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const useCreateTransaction = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Transaction | null>(null);

  const createTransaction = async (transactionData: CreateTransactionDto): Promise<Transaction | null> => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await API.post<Transaction>('/transactions', transactionData);
      setData(response.data);
      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro desconhecido ao criar transação';

      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createTransaction, data, loading, error };
};
