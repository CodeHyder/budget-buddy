import { IsString, IsNumber, IsEnum, IsDateString, IsBoolean } from 'class-validator';

export class CreateTransactionDto {

    @IsString()
    userId: string;
    
    @IsString()
    description: string;

    @IsNumber()
    amount: number;

    @IsEnum(['INCOME', 'EXPENSE', 'REIMBURSEMENT', 'BILL'])
    type: 'INCOME' | 'EXPENSE' | 'REIMBURSEMENT' | 'BILL';

    @IsString()
    category: string;

    @IsDateString()
    date: string;

    @IsBoolean()
    isPaid: boolean;
}
