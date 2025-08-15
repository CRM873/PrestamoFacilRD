import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentAllocation } from './entities/payment.entity';
import { CustomersService } from '../customers/customers.service';
import { InvoicesService } from '../invoices/invoices.service';
import { Invoice } from '../invoices/entities/invoice.entity';
import { EventsGateway } from '../events/events.gateway';

export interface CreatePaymentInput {
	customerId: string;
	method: 'cash' | 'transfer' | 'card';
	amount: number;
	reference?: string;
	allocations?: { invoiceId: string; amount: number }[];
}

@Injectable()
export class PaymentsService {
	constructor(
		@InjectRepository(Payment) private readonly payRepo: Repository<Payment>,
		@InjectRepository(PaymentAllocation) private readonly allocRepo: Repository<PaymentAllocation>,
		@InjectRepository(Invoice) private readonly invRepo: Repository<Invoice>,
		private readonly customersService: CustomersService,
		private readonly invoicesService: InvoicesService,
		private readonly events: EventsGateway,
	) {}

	private async allocateOldestFirst(customerId: string, amount: number): Promise<{ invoiceId: string; amount: number }[]> {
		const invoices = await this.invRepo.find({ where: { customer: { id: customerId }, status: 'EMITIDA' }, order: { dueDate: 'ASC' } });
		const allocations: { invoiceId: string; amount: number }[] = [];
		let remaining = amount;
		for (const inv of invoices) {
			if (remaining <= 0) break;
			const bal = parseFloat(inv.balance);
			const apply = Math.min(remaining, bal);
			if (apply > 0) {
				allocations.push({ invoiceId: inv.id, amount: apply });
				remaining -= apply;
			}
		}
		return allocations;
	}

	async record(input: CreatePaymentInput) {
		const customer = await this.customersService.findOne(input.customerId);
		const payment = this.payRepo.create({
			customer,
			method: input.method,
			amountReceived: input.amount.toFixed(2),
			reference: input.reference,
		});
		await this.payRepo.save(payment);

		const allocations = input.allocations?.length ? input.allocations : await this.allocateOldestFirst(customer.id, input.amount);
		let remaining = input.amount;
		for (const a of allocations) {
			const inv = await this.invRepo.findOne({ where: { id: a.invoiceId } });
			if (!inv) throw new NotFoundException('Factura no encontrada');
			let apply = Math.min(remaining, a.amount, parseFloat(inv.balance));
			if (apply <= 0) continue;
			const alloc = this.allocRepo.create({ payment, invoice: inv, amountApplied: apply.toFixed(2) });
			await this.allocRepo.save(alloc);
			const newBal = (parseFloat(inv.balance) - apply).toFixed(2);
			inv.balance = newBal;
			inv.status = parseFloat(newBal) === 0 ? 'PAGADA' : inv.status;
			await this.invRepo.save(inv);
			remaining -= apply;
		}
		if (remaining > 0) {
			customer.unappliedCredit = (parseFloat(customer.unappliedCredit ?? '0') + remaining).toFixed(2);
			await this.customersService.update(customer.id, { unappliedCredit: customer.unappliedCredit as any });
		}
		this.events.server?.emit('PaymentRecorded', { paymentId: payment.id, customerId: customer.id });
		return { id: payment.id };
	}
}