import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcryptjs';

@Controller('users')
export class UsersController {
	constructor(private readonly users: UsersService) {}

	@Get()
	findAll() {
		return this.users.findAll();
	}

	@Post()
	async create(@Body() body: { name: string; email: string; password: string; role?: string }) {
		const passwordHash = await bcrypt.hash(body.password, 10);
		return this.users.create({ name: body.name, email: body.email, passwordHash, role: body.role ?? 'cobranza' });
	}
}
