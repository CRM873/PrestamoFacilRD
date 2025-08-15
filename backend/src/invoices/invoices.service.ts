import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { CustomersService } from '../customers/customers.service';
import { EventsGateway } from '../events/events.gateway';
import { NcfSeries } from './entities/ncf-series.entity';

export interface InvoiceLineInput { description: string; qty: number; unitPrice: number; itbisRate?: number; }
export interface CreateInvoiceInput {
	customerId: string;
	requiresFiscalReceipt?: boolean;
	ncfType?: string;
	lines: InvoiceLineInput[];
	issueDate?: string; // yyyy-MM-dd
	termsDays?: number;
	interestRateAnnual?: number;
}

@Injectable()
export class InvoicesService implements OnModuleInit {
	constructor(
		@InjectRepository(Invoice) private readonly invRepo: Repository<Invoice>,
		@InjectRepository(NcfSeries) private readonly ncfRepo: Repository<NcfSeries>,
		private readonly customersService: CustomersService,
		private readonly dataSource: DataSource,
		private readonly events: EventsGateway,
	) {}

	async onModuleInit() {
		const exists = await this.ncfRepo.findOne({ where: { typeCode: 'B01', active: true } });
		if (!exists) {
			await this.ncfRepo.save(this.ncfRepo.create({ typeCode: 'B01', prefix: 'B010000', current: 1, end: 999999, active: true }));
		}
	}

	private computeTotals(lines: InvoiceLineInput[]) {
		let subtotal = 0;
		let itbis = 0;
		for (const l of lines) {
			const lineSubtotal = l.qty * l.unitPrice;
			subtotal += lineSubtotal;
			const rate = l.itbisRate ?? 0.18;
			itbis += lineSubtotal * rate;
		}
		const total = subtotal + itbis;
		return {
			subtotal: subtotal.toFixed(2),
			itbisTotal: itbis.toFixed(2),
			total: total.toFixed(2),
		};
	}

	private async reserveNcf(typeCode: string): Promise<string> {
		return await this.dataSource.transaction(async (manager) => {
			const repo = manager.getRepository(NcfSeries);
			const series = await repo.findOne({ where: { typeCode, active: true } });
			if (!series) throw new BadRequestException('Serie NCF no disponible');
			if (series.current > series.end) throw new BadRequestException('Serie NCF agotada');
			const number = series.current;
			series.current = series.current + 1;
			await repo.save(series);
			const ncf = `${series.prefix}${String(number).padStart(6, '0')}`;
			return ncf;
		});
	}

	async create(input: CreateInvoiceInput): Promise<Invoice> {
		const customer = await this.customersService.findOne(input.customerId);
		const totals = this.computeTotals(input.lines);
		const issueDate = input.issueDate ?? new Date().toISOString().slice(0, 10);
		const due = new Date(issueDate);
		due.setDate(due.getDate() + (input.termsDays ?? customer.termsDays ?? 30));
		const inv: Partial<Invoice> = {
			customer,
			issueDate,
			dueDate: due.toISOString().slice(0, 10),
			subtotal: totals.subtotal,
			itbisTotal: totals.itbisTotal,
			total: totals.total,
			balance: totals.total,
			status: 'EMITIDA',
			ncfType: input.requiresFiscalReceipt ? input.ncfType ?? 'B01' : undefined,
			interestRateAnnual: String(input.interestRateAnnual ?? 0),
		};
		if (inv.ncfType) {
			inv.ncfNumber = await this.reserveNcf(inv.ncfType);
		}
		const saved = await this.invRepo.save(this.invRepo.create(inv));
		this.events.server?.emit('InvoiceCreated', { invoiceId: saved.id, customerId: customer.id });
		return saved;
	}

	async findAll(params?: { status?: string; customerId?: string }): Promise<Invoice[]> {
		return this.invRepo.find({ where: { ...(params?.status ? { status: params.status } : {}), ...(params?.customerId ? { customer: { id: params.customerId } } : {}) }, order: { issueDate: 'DESC' } });
	}

	async findOne(id: string): Promise<Invoice> {
		const inv = await this.invRepo.findOne({ where: { id } });
		if (!inv) throw new NotFoundException('Factura no encontrada');
		return inv;
	}
}