import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('ncf_series')
@Index(['typeCode', 'active'], { unique: true, where: 'active = 1' })
export class NcfSeries {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'type_code', length: 8 })
	typeCode: string; // B01, B02, etc.

	@Column({ length: 16 })
	prefix: string; // e.g., B010000

	@Column({ type: 'int' })
	current: number;

	@Column({ type: 'int' })
	end: number;

	@Column({ type: 'datetime', nullable: true })
	expiresAt?: Date;

	@Column({ type: 'boolean', default: true })
	active: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}