// frontend/src/hooks/transactions/useDeleteTransaction.ts
import { useState } from 'react';

export const useDeleteTransaction = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const deleteTransaction = async (transactionId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`http://localhost:3000/transactions/${transactionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // Se a resposta não for OK, tentamos ler a mensagem de erro do backend
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete transaction');
      }

      // No caso de sucesso, o backend de exemplo retorna void, então não esperamos JSON
      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.message);
      setSuccess(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteTransaction, loading, error, success };
};