// frontend/src/components/TransactionForm.tsx
import React, { useState, useEffect } from 'react';
import { CreateTransactionDto } from '@/hooks/transactions/useCreateTransaction'; // Importa o DTO

// Define as props que o componente do formulário vai receber
interface TransactionFormProps {
  initialData?: Omit<CreateTransactionDto, 'userId'>; // Dados iniciais para edição (opcional)
  onSubmit: (data: Omit<CreateTransactionDto, 'userId'>) => Promise<void>;
  isLoading: boolean;
  submitError: string | null;
  submitSuccess: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  submitError,
  submitSuccess,
}) => {
  const [formData, setFormData] = useState<Omit<CreateTransactionDto, 'userId'>>({
    description: '',
    amount: 0,
    type: 'EXPENSE',
    category: '',
    date: new Date().toISOString().substring(0, 10),
    isPaid: false,
  });

  // Efeito para preencher o formulário com dados iniciais (para edição)
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Converte a data para o formato yyyy-MM-dd se for um objeto Date ou string ISO
        date: initialData.date ? new Date(initialData.date).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
      });
    }
  }, [initialData]);

  // Efeito para limpar o formulário após um envio bem-sucedido
  useEffect(() => {
    if (submitSuccess) {
      setFormData({
        description: '',
        amount: 0,
        type: 'EXPENSE',
        category: '',
        date: new Date().toISOString().substring(0, 10),
        isPaid: false,
      });
    }
  }, [submitSuccess]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';

    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : (name === 'amount' ? parseFloat(value) || 0 : value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData); // Chama a função onSubmit passada como prop
  };

  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-3 text-black dark:text-white">Adicionar Nova Transação</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="description"
          placeholder="Descrição"
          className="border p-2 rounded text-black"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Valor"
          className="border p-2 rounded text-black"
          value={formData.amount === 0 ? '' : formData.amount}
          onChange={handleInputChange}
          step="0.01"
          required
        />
        <select
          name="type"
          className="border p-2 rounded text-black"
          value={formData.type}
          onChange={handleInputChange}
        >
          <option value="EXPENSE">Despesa</option>
          <option value="INCOME">Receita</option>
          <option value="REIMBURSEMENT">Reembolso</option>
          <option value="BILL">Conta</option>
        </select>
        <input
          type="text"
          name="category"
          placeholder="Categoria"
          className="border p-2 rounded text-black"
          value={formData.category}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="date"
          className="border p-2 rounded text-black"
          value={formData.date}
          onChange={handleInputChange}
          required
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPaid"
            name="isPaid"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            checked={formData.isPaid}
            onChange={handleInputChange}
          />
          <label htmlFor="isPaid" className="text-gray-700 dark:text-gray-300">Pago?</label>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded col-span-full"
          disabled={isLoading}
        >
          {isLoading ? 'Processando...' : 'Adicionar Transação'}
        </button>
      </form>
      {submitError && <p className="text-red-500 mt-2">Erro: {submitError}</p>}
      {submitSuccess && <p className="text-green-500 mt-2">Transação adicionada com sucesso!</p>}
    </div>
  );
};

export default TransactionForm;