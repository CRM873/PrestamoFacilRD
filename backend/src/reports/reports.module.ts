import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from '../invoices/entities/invoice.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Invoice])],
	controllers: [ReportsController],
})
export class ReportsModule {}
