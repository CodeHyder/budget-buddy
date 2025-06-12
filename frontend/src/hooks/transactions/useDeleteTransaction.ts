// frontend/src/hooks/transactions/useDeleteTransaction.ts
import { useState } from 'react';
import axios, { AxiosError } from 'axios';

// Configurado para usar a variável de ambiente
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Ex: http://localhost:3000
});

export const useDeleteTransaction = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const deleteTransaction = async (transactionId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await API.delete(`/transactions/${transactionId}`);
      setSuccess(true);
      return true;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;

      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Erro desconhecido ao deletar transação';

      setError(message);
      setSuccess(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteTransaction, loading, error, success };
};
