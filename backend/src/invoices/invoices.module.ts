import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice } from './entities/invoice.entity';
import { CustomersModule } from '../customers/customers.module';
import { EventsModule } from '../events/events.module';
import { NcfSeries } from './entities/ncf-series.entity';
import { InvoicesCronService } from './invoices.cron';

@Module({
	imports: [TypeOrmModule.forFeature([Invoice, NcfSeries]), CustomersModule, EventsModule],
	controllers: [InvoicesController],
	providers: [InvoicesService, InvoicesCronService],
	exports: [InvoicesService],
})
export class InvoicesModule {}
