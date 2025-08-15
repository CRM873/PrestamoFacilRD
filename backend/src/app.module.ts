import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PaymentsModule } from './payments/payments.module';
import { ReportsModule } from './reports/reports.module';
import { RemindersModule } from './reminders/reminders.module';
import { EventsModule } from './events/events.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
	imports: [ScheduleModule.forRoot(), DatabaseModule, AuthModule, CustomersModule, InvoicesModule, PaymentsModule, ReportsModule, RemindersModule, EventsModule],
	controllers: [AppController],
})
export class AppModule {}
