import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersSeeder implements OnModuleInit {
	constructor(private readonly users: UsersService) {}

	async onModuleInit() {
		const existing = await this.users.findByEmail('admin@local');
		if (!existing) {
			const passwordHash = await bcrypt.hash('admin123', 10);
			await this.users.create({ name: 'Administrador', email: 'admin@local', passwordHash, role: 'admin' });
			// eslint-disable-next-line no-console
			console.log('Usuario admin creado: admin@local / admin123');
		}
	}
}