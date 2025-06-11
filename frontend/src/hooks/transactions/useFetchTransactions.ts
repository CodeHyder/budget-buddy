// frontend/src/hooks/transactions/useFetchTransactions.ts
import { useEffect, useState, useCallback } from 'react'; // Importa useCallback

export type Transaction = {
  id: string;
  userTransactionId: number;
  userId: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'REIMBURSEMENT' | 'BILL';
  category: string;
  date: string;
  isPaid: boolean;
};

export const useFetchTransactions = (userId: string, initialMonth?: number, initialYear?: number) => {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados internos para o mês e ano do filtro
  const [month, setMonth] = useState<number | undefined>(initialMonth);
  const [year, setYear] = useState<number | undefined>(initialYear);

  // Usamos useCallback para memoizar a função fetchTransactions,
  // garantindo que ela só mude se suas dependências mudarem.
  const fetchTransactions = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (month) params.append('month', String(month));
    if (year) params.append('year', String(year));

    try {
      const res = await fetch(`http://localhost:3000/transactions/user/${userId}?${params.toString()}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch transactions');
      }
      const data = await res.json();
      setData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, month, year]); // Dependências do useCallback

  // O useEffect para a busca inicial e sempre que month/year internos mudarem
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]); // Dependência do useEffect é a função memoizada

  // Retornamos month e year e suas funções set para que o componente pai possa controlá-los
  // E também a função fetchTransactions para que o botão possa dispará-la
  return { data, loading, error, setMonth, setYear, refetch: fetchTransactions };
};