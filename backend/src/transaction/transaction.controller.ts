import { Controller, Get, Post, Patch, Body, Param, Query, Delete } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly service: TransactionService) { }

  @Post()
  create(@Body() dto: CreateTransactionDto): Transaction {
    return this.service.create(dto);
  }

  @Get()
  findAll(): Transaction[] {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Transaction {
    return this.service.findOne(id);
  }

  @Get('user/:userId')
  findByUser(
    @Param('userId') userId: string,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.service.findByUser(userId, month, year);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<UpdateTransactionDto>): Transaction {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): void {
    return this.service.remove(id);
  }
}
