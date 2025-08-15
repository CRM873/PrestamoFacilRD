import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

	create(data: Partial<User>) {
		const u = this.repo.create(data);
		return this.repo.save(u);
	}

	findAll() {
		return this.repo.find();
	}

	findOne(id: string) {
		return this.repo.findOne({ where: { id } });
	}

	findByEmail(email: string) {
		return this.repo.findOne({ where: { email } });
	}

	async update(id: string, data: Partial<User>) {
		await this.repo.update({ id }, data);
		const u = await this.findOne(id);
		if (!u) throw new NotFoundException('Usuario no encontrado');
		return u;
	}

	remove(id: string) {
		return this.repo.delete({ id });
	}
}
