import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment, PaymentAllocation } from './entities/payment.entity';
import { InvoicesModule } from '../invoices/invoices.module';
import { CustomersModule } from '../customers/customers.module';
import { EventsModule } from '../events/events.module';

@Module({
	imports: [TypeOrmModule.forFeature([Payment, PaymentAllocation]), InvoicesModule, CustomersModule, EventsModule],
	controllers: [PaymentsController],
	providers: [PaymentsService],
	exports: [PaymentsService],
})
export class PaymentsModule {}
