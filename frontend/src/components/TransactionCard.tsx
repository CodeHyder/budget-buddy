// frontend/src/components/TransactionCard.tsx
import React from 'react';
import { Transaction } from '@/hooks/transactions/useFetchTransactions'; // Importa a tipagem de Transaction

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction: t, onEdit, onRemove }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between items-start aspect-square">
      <div>
        <p className="font-medium text-black truncate">{t.description}</p>
        <p className="text-sm text-gray-500">{new Date(t.date).toLocaleDateString()}</p>
        <p className="text-xs text-gray-500">{t.category}</p>
      </div>
      <div className="self-end mt-auto">
        <p className={`font-bold text-lg ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'} mb-2`}>
          {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(t.id)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
          >
            Editar
          </button>
          <button
            onClick={() => onRemove(t.id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;