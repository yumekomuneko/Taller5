import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    ParseIntPipe,
    UseGuards,
    Patch,
    Delete,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { UpdatePaymentDto } from './dtos/update-payment.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    // Admin puede ver todos
    @Roles(UserRole.ADMIN)
    @Get()
    findAll() {
        return this.paymentService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.paymentService.findOne(id);
    }

    // Endpoint para procesar un pago
    @Post()
    create(@Body() dto: CreatePaymentDto) {
        return this.paymentService.createPayment(dto);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePaymentDto){
        return this.paymentService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number){
        return this.paymentService.remove(id);
    }
}
