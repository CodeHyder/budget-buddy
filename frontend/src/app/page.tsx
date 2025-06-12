// frontend/src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useFetchTransactions } from '@/hooks/transactions/useFetchTransactions';
import { useCreateTransaction } from '@/hooks/transactions/useCreateTransaction';
import { useDeleteTransaction } from '@/hooks/transactions/useDeleteTransaction';
import TransactionCard from '@/components/TransactionCard';
import TransactionForm from '@/components/TransactionForm'; // Importa o novo componente de formulário
import { CreateTransactionDto } from '@/hooks/transactions/useCreateTransaction'; // Importa o DTO

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
    data: newTransactionData // Este data será usado para acionar o refetch e feedback
  } = useCreateTransaction();

  const {
    deleteTransaction,
    loading: deleteLoading,
    error: deleteError,
    success: deleteSuccess,
  } = useDeleteTransaction();

  const [currentMonthInput, setCurrentMonthInput] = useState<string>('');
  const [currentYearInput, setCurrentYearInput] = useState<string>('');

  // Estados para gerenciar o modo de edição
  const [editingTransaction, setEditingTransaction] = useState<Omit<CreateTransactionDto, 'userId'> | null>(null);

  // Efeito para re-fetch após deleção ou criação bem-sucedida
  useEffect(() => {
    if (deleteSuccess || newTransactionData) {
      refetch();
    }
  }, [deleteSuccess, newTransactionData, refetch]);


  const handleFilter = () => {
    setMonth(Number(currentMonthInput) || undefined);
    setYear(Number(currentYearInput) || undefined);
  };

  const handleEdit = (transactionId: string) => {
    console.log(`Editar transação com ID: ${transactionId}`);
    // No futuro: Carregar os dados da transação para preencher o formulário para edição
    const transactionToEdit = transactions.find(t => t.id === transactionId);
    if (transactionToEdit) {
      // Aqui, prepare os dados para o formulário de edição
      // Certifique-se de que a data está no formato YYYY-MM-DD
      setEditingTransaction({
        description: transactionToEdit.description,
        amount: transactionToEdit.amount,
        type: transactionToEdit.type,
        category: transactionToEdit.category,
        date: new Date(transactionToEdit.date).toISOString().substring(0, 10),
        isPaid: transactionToEdit.isPaid,
      });
      // Poderíamos ter um estado para controlar se o formulário está em modo de "adição" ou "edição"
    }
  };

  const handleRemove = async (transactionId: string) => {
    if (window.confirm('Tem certeza que deseja remover esta transação?')) {
      console.log(`[page.tsx] Iniciando handleRemove para ID: ${transactionId}`);
      const successResult = await deleteTransaction(transactionId);
      console.log(`[page.tsx] deleteTransaction retornou: ${successResult}`);
      console.log(`[page.tsx] Estado deleteError do hook: ${deleteError}`);

      if (successResult) {
        console.log(`Transação ${transactionId} removida com sucesso!`);
      } else {
        console.error(`Falha ao remover transação ${transactionId}: ${deleteError}`);
      }
    }
  };

  // Função que será passada para o TransactionForm
  const handleCreateTransactionSubmit = async (formData: Omit<CreateTransactionDto, 'userId'>) => {
    const transactionData: CreateTransactionDto = {
      userId: userId, // Adiciona o userId aqui, que é global para a página
      description: formData.description,
      amount: formData.amount,
      type: formData.type,
      category: formData.category,
      date: new Date(formData.date).toISOString(), // Converte para ISO string para o backend
      isPaid: formData.isPaid,
    };
    await createTransaction(transactionData);
  };

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Minhas Transações</h1>

      {/* Seção de Filtro */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-3 text-black dark:text-white">Filtrar Transações</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="number"
            placeholder="Mês (1-12)"
            className="border p-2 rounded text-black flex-grow min-w-[100px]"
            value={currentMonthInput}
            onChange={(e) => setCurrentMonthInput(e.target.value)}
          />
          <input
            type="number"
            placeholder="Ano"
            className="border p-2 rounded text-black flex-grow min-w-[100px]"
            value={currentYearInput}
            onChange={(e) => setCurrentYearInput(e.target.value)}
          />
          <button onClick={handleFilter} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex-shrink-0">
            Filtrar
          </button>
        </div>
      </div>

      {/* Seção de Criar Nova Transação (usando o componente) */}
      <TransactionForm
        initialData={editingTransaction || undefined} // Passa dados para edição se houver
        onSubmit={handleCreateTransactionSubmit} // A função que lida com o envio
        isLoading={createLoading}
        submitError={createError}
        submitSuccess={!!newTransactionData} // Converte para boolean
      />

      {/* Mensagens de Feedback globais */}
      {error && <p className="text-red-500">Erro ao carregar transações: {error}</p>}
      {deleteError && <p className="text-red-500">Erro ao remover transação: {deleteError}</p>}
      {deleteLoading && <p className="text-blue-500">Removendo transação...</p>}


      {/* Lista de Transações */}
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