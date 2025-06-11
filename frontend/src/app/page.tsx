// frontend/src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useFetchTransactions } from '@/hooks/transactions/useFetchTransactions';
import { useCreateTransaction } from '@/hooks/transactions/useCreateTransaction';
import { useDeleteTransaction } from '@/hooks/transactions/useDeleteTransaction'; // Importa o novo hook
import TransactionCard from '@/components/TransactionCard';

export default function HomePage() {
  const userId = 'user-id-fake';

  const {
    data: transactions,
    loading,
    error,
    setMonth,
    setYear,
    refetch,
  } = useFetchTransactions(userId);

  const {
    createTransaction,
    loading: createLoading,
    error: createError,
    data: newTransactionData
  } = useCreateTransaction();

  const {
    deleteTransaction,
    loading: deleteLoading,
    error: deleteError,
    success: deleteSuccess,
  } = useDeleteTransaction(); // Usa o hook de deleção

  const [currentMonthInput, setCurrentMonthInput] = useState<string>('');
  const [currentYearInput, setCurrentYearInput] = useState<string>('');

  useEffect(() => {
    // Apenas para fins de teste de re-fetch, se deleteSuccess for true, refetch as transações
    if (deleteSuccess) {
      refetch();
    }
  }, [deleteSuccess, refetch]);


  const handleFilter = () => {
    setMonth(Number(currentMonthInput) || undefined);
    setYear(Number(currentYearInput) || undefined);
  };

  const handleCreateDummyTransaction = async () => {
    const newTransaction = {
      userId: userId,
      description: `Dummy Transaction ${Math.random().toFixed(2)}`,
      amount: parseFloat((100 + Math.random() * 1000).toFixed(2)),
      type: (['INCOME', 'EXPENSE', 'REIMBURSEMENT', 'BILL'] as const)[Math.floor(Math.random() * 4)],
      category: (['Alimentação', 'Transporte', 'Salário', 'Contas'] as const)[Math.floor(Math.random() * 4)],
      date: new Date().toISOString(),
      isPaid: Math.random() > 0.5,
    };
    const created = await createTransaction(newTransaction);
    if (created) {
      console.log('Transação dummy criada:', created);
      refetch();
    }
  };

  const handleEdit = (transactionId: string) => {
    console.log(`Editar transação com ID: ${transactionId}`);
    // Futuramente, chamaremos o hook useUpdateTransaction aqui
  };

  const handleRemove = async (transactionId: string) => {
    if (window.confirm('Tem certeza que deseja remover esta transação?')) {
      const success = await deleteTransaction(transactionId);
      if (success) {
        console.log(`Transação ${transactionId} removida com sucesso!`);
        // O useEffect acima já vai chamar refetch()
      } else {
        console.error(`Falha ao remover transação ${transactionId}: ${deleteError}`);
      }
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Minhas Transações</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="number"
          placeholder="Mês (1-12)"
          className="border p-2 rounded text-black"
          value={currentMonthInput}
          onChange={(e) => setCurrentMonthInput(e.target.value)}
        />
        <input
          type="number"
          placeholder="Ano"
          className="border p-2 rounded text-black"
          value={currentYearInput}
          onChange={(e) => setCurrentYearInput(e.target.value)}
        />
        <button onClick={handleFilter} className="bg-blue-600 text-white px-4 py-2 rounded">
          Filtrar
        </button>
        <button
          onClick={handleCreateDummyTransaction}
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={createLoading}
        >
          {createLoading ? 'Criando...' : 'Criar Transação (Teste)'}
        </button>
      </div>

      {error && <p className="text-red-500">Erro ao carregar transações: {error}</p>}
      {createError && <p className="text-red-500">Erro ao criar transação: {createError}</p>}
      {deleteError && <p className="text-red-500">Erro ao remover transação: {deleteError}</p>}
      {newTransactionData && !createLoading && !createError && (
        <p className="text-green-500">Transação criada com sucesso! ID: {newTransactionData.id}</p>
      )}
      {deleteLoading && <p className="text-blue-500">Removendo transação...</p>}


      {loading ? (
        <p>Carregando transações...</p>
      ) : transactions.length === 0 ? (
        <p>Nenhuma transação encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {transactions.map((t) => (
            <TransactionCard
              key={t.id}
              transaction={t}
              onEdit={handleEdit}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </main>
  );
}