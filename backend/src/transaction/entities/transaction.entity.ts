export class Transaction {
    id: string;
    userId?: string;
    userTransactionId: number;
    description: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE' | 'REIMBURSEMENT' | 'BILL';
    category: string;
    date: Date;
    isPaid: boolean;
  }
  