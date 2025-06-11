import { useEffect, useState } from 'react';

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

export const useFetchTransactions = (userId: string, month?: number, year?: number) => {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const params = new URLSearchParams();
    if (month) params.append('month', String(month));
    if (year) params.append('year', String(year));

    fetch(`http://localhost:3000/transactions/user/${userId}?${params.toString()}`)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId, month, year]);

  return { data, loading, error };
};
