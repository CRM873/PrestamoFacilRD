import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { Invoice } from '../../invoices/entities/invoice.entity';

@Entity('payments')
export class Payment {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Customer, { eager: true, onDelete: 'RESTRICT' })
	customer: Customer;

	@Column({ length: 16 })
	method: string; // cash, transfer, card

	@Column({ type: 'decimal', precision: 14, scale: 2 })
	amountReceived: string;

	@Column({ nullable: true, length: 64 })
	reference?: string;

	@OneToMany(() => PaymentAllocation, (a) => a.payment, { cascade: true })
	allocations?: PaymentAllocation[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}

@Entity('payment_allocations')
export class PaymentAllocation {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Payment, (p) => p.allocations, { onDelete: 'CASCADE' })
	payment: Payment;

	@ManyToOne(() => Invoice, { eager: true, onDelete: 'RESTRICT' })
	invoice: Invoice;

	@Column({ type: 'decimal', precision: 14, scale: 2 })
	amountApplied: string;
}