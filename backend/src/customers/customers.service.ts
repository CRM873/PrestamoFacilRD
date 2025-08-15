import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
	constructor(
		@InjectRepository(Customer)
		private readonly customersRepo: Repository<Customer>,
	) {}

	async create(data: CreateCustomerDto): Promise<Customer> {
		const entity = this.customersRepo.create({
			...data,
			riskLevel: data.riskLevel ?? 'medio',
			termsDays: data.termsDays ?? 30,
			creditLimit: data.creditLimit ?? '0',
		});
		return this.customersRepo.save(entity);
	}

	async findAll(query?: { q?: string; risk?: string }): Promise<Customer[]> {
		const where = [] as any[];
		if (query?.q) {
			where.push({ name: ILike(`%${query.q}%`) });
			where.push({ rncCedula: ILike(`%${query.q}%`) });
		}
		if (query?.risk) {
			where.push({ riskLevel: query.risk });
		}
		return this.customersRepo.find({
			where: where.length ? where : undefined,
			order: { name: 'ASC' },
		});
	}

	async findOne(id: string): Promise<Customer> {
		const c = await this.customersRepo.findOne({ where: { id } });
		if (!c) throw new NotFoundException('Cliente no encontrado');
		return c;
	}

	async update(id: string, data: UpdateCustomerDto): Promise<Customer> {
		await this.customersRepo.update({ id }, data);
		return this.findOne(id);
	}

	async remove(id: string): Promise<void> {
		await this.customersRepo.delete({ id });
	}
}