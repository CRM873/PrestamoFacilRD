import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('customers')
@Index(['rncCedula'], { unique: true })
@Index(['name'])
export class Customer {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ length: 160 })
	name: string;

	@Column({ name: 'rnc_cedula', length: 20 })
	rncCedula: string;

	@Column({ nullable: true, length: 160 })
	email?: string;

	@Column({ nullable: true, length: 32 })
	phone?: string;

	@Column({ nullable: true, type: 'text' })
	address?: string;

	@Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
	creditLimit: string;

	@Column({ type: 'int', default: 30 })
	termsDays: number;

	@Column({ type: 'varchar', length: 16, default: 'medio' })
	riskLevel: string; // bajo/medio/alto

	@Column({ type: 'int', default: 600 })
	creditScore: number; // 300-900

	@Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
	unappliedCredit: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}