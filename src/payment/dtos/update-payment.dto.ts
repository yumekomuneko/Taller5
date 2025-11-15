import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDto } from './create-payment.dto';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
    @IsInt()
    orderId?: number;
    
    @IsNumber()
    amount?: number; // monto que paga (cliente)
    
    @IsString()
    method?: string; // e.g. "credit_card", "stripe", "paypal", "transfer"
    
    @IsOptional()
    @IsString()
    transactionId?: string; // id del proveedor (opcional)

    @IsString()
    @IsOptional()
    status?: string;
}
