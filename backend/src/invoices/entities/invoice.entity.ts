import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';

@Entity('invoices')
@Index(['ncfNumber'], { unique: true, where: 'ncf_number IS NOT NULL' })
export class Invoice {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Customer, { eager: true, onDelete: 'RESTRICT' })
	customer: Customer;

	@Column({ name: 'ncf_type', nullable: true, length: 8 })
	ncfType?: string;

	@Column({ name: 'ncf_number', nullable: true, length: 20 })
	ncfNumber?: string;

	@Column({ type: 'date' })
	issueDate: string;

	@Column({ type: 'date' })
	dueDate: string;

	@Column({ type: 'decimal', precision: 14, scale: 2 })
	subtotal: string;

	@Column({ type: 'decimal', precision: 14, scale: 2 })
	itbisTotal: string;

	@Column({ type: 'decimal', precision: 14, scale: 2 })
	total: string;

	@Column({ type: 'decimal', precision: 14, scale: 2 })
	balance: string;

	@Column({ length: 16 })
	status: string; // EMITIDA, PARCIAL, VENCIDA, PAGADA

	@Column({ type: 'decimal', precision: 8, scale: 4, default: 0 })
	interestRateAnnual: string;

	@Column({ type: 'date', nullable: true })
	lastInterestCalcDate?: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}