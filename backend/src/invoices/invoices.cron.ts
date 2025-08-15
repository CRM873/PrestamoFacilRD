import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class InvoicesCronService {
	constructor(@InjectRepository(Invoice) private readonly invRepo: Repository<Invoice>, private readonly events: EventsGateway) {}

	@Cron(CronExpression.EVERY_DAY_AT_2AM)
	async accrueDailyInterest() {
		const today = new Date().toISOString().slice(0, 10);
		const list = await this.invRepo.find();
		for (const inv of list) {
			if (parseFloat(inv.balance) <= 0) continue;
			if (new Date(inv.dueDate) >= new Date(today)) continue;
			const last = inv.lastInterestCalcDate ?? inv.dueDate;
			const days = Math.max(0, Math.floor((new Date(today).getTime() - new Date(last).getTime()) / 86400000));
			const rateAnnual = parseFloat(inv.interestRateAnnual ?? '0');
			if (days > 0 && rateAnnual > 0) {
				const dailyRate = rateAnnual / 365;
				const interest = parseFloat(inv.balance) * dailyRate * days;
				inv.balance = (parseFloat(inv.balance) + interest).toFixed(2);
				inv.lastInterestCalcDate = today;
			}
			inv.status = 'VENCIDA';
			await this.invRepo.save(inv);
			this.events.server?.emit('InvoiceOverdue', { invoiceId: inv.id, balance: inv.balance });
		}
	}
}