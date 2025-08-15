import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan } from 'typeorm';
import { Invoice } from '../invoices/entities/invoice.entity';

@Controller('reports')
export class ReportsController {
	constructor(@InjectRepository(Invoice) private readonly invRepo: Repository<Invoice>) {}

	@Get('dashboards/summary')
	async summary() {
		const all = await this.invRepo.find();
		const totalReceivables = all.reduce((s, i) => s + parseFloat(i.balance), 0);
		const overdue = all
			.filter((i) => new Date(i.dueDate) < new Date() && parseFloat(i.balance) > 0)
			.reduce((s, i) => s + parseFloat(i.balance), 0);
		return {
			moneda: 'DOP',
			totalPorCobrar: totalReceivables.toFixed(2),
			montoVencido: overdue.toFixed(2),
		};
	}

	@Get('aging')
	async aging(@Query('bucket') bucket: string) {
		const now = new Date();
		const all = await this.invRepo.find();
		const withDays = all.map((i) => ({ i, days: Math.max(0, Math.floor((Date.now() - new Date(i.dueDate).getTime()) / 86400000)) }));
		const ranges: Record<string, [number, number | null]> = {
			'0-30': [0, 30],
			'31-60': [31, 60],
			'61-90': [61, 90],
			'>90': [91, null],
		};
		const [start, end] = ranges[bucket] ?? [0, null];
		const filtered = withDays.filter(({ i, days }) => parseFloat(i.balance) > 0 && days >= start && (end === null || days <= end));
		const total = filtered.reduce((s, x) => s + parseFloat(x.i.balance), 0);
		return { bucket, total: total.toFixed(2), count: filtered.length };
	}
}