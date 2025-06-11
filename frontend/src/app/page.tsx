// app/page.tsx
'use client';

import { useEffect, useState } from 'react';

type Transaction = {
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

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const userId = 'user-id-fake'; // Substituir com ID real depois

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (month) params.append('month', month);
      if (year) params.append('year', year);

      const res = await fetch(`http://localhost:3000/transactions/user/${userId}?${params.toString()}`);
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error('Erro ao buscar transações', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [month, year]);

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Minhas Transações</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="number"
          placeholder="Mês (1-12)"
          className="border p-2 rounded"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <input
          type="number"
          placeholder="Ano"
          className="border p-2 rounded"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <button onClick={fetchTransactions} className="bg-blue-600 text-white px-4 py-2 rounded">
          Filtrar
        </button>
      </div>

      {loading ? (
        <p>Carregando transações...</p>
      ) : transactions.length === 0 ? (
        <p>Nenhuma transação encontrada.</p>
      ) : (
        <ul className="space-y-2">
          {transactions.map((t) => (
            <li key={t.id} className="border rounded p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{t.description}</p>
                <p className="text-sm text-gray-500">{new Date(t.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <p className="text-xs">{t.category}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
