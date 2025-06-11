import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  private transactions: Transaction[] = [];
  private idCounter = 1;

  create(createDto: CreateTransactionDto): Transaction {
  // Filtra todas as transações desse usuário
  const userTransactions = this.transactions.filter(t => t.userId === createDto.userId);

  // Calcula o próximo ID incremental para esse usuário
  const nextUserTransactionId = userTransactions.length + 1;

  // Cria a transação com os campos necessários
  const transaction: Transaction = {
    id: String(this.idCounter++), 
    userTransactionId: nextUserTransactionId, // contador por usuário
    ...createDto,
    date: new Date(createDto.date), // garante que seja um objeto Date
  }; //

  this.transactions.push(transaction);
  return transaction;
}

  findAll(): Transaction[] {
    return this.transactions;
  }

  findOne(id: string): Transaction {
    const transaction = this.transactions.find((t) => t.id === id);
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  findByUser(userId: string, month?: string, year?: string): Transaction[] {
    return this.transactions.filter((t) => {
      if (t.userId !== userId) return false;

      if (month && year) {
        const date = new Date(t.date);
        return (
          date.getMonth() + 1 === Number(month) &&
          date.getFullYear() === Number(year)
        );
      }

      return true; 
    });
  }
  remove(id: string): void {
    this.transactions = this.transactions.filter((t) => t.id !== id);
    if (!this.transactions.find((t) => t.id === id)) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
  }

  update(id: string, updateDto: UpdateTransactionDto): Transaction {
    const transaction = this.findOne(id);
    Object.assign(transaction, updateDto);
    return transaction;
  }
}
