import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
@Index(['email'], { unique: true })
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ length: 160 })
	name: string;

	@Column({ length: 160 })
	email: string;

	@Column({ name: 'password_hash', length: 200 })
	passwordHash: string;

	@Column({ length: 32, default: 'cobranza' })
	role: string; // admin, cobranza, analista, auditor, lectura

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}