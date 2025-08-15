import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import type { Response } from 'express';
import dayjs from 'dayjs';
import { Public } from '../auth/public.decorator';

@Controller('customers')
export class CustomersController {
	constructor(private readonly customersService: CustomersService) {}

	@Post()
	create(@Body() dto: CreateCustomerDto) {
		return this.customersService.create(dto);
	}

	@Public()
	@Get()
	findAll(@Query('q') q?: string, @Query('risk') risk?: string) {
		return this.customersService.findAll({ q, risk });
	}

	@Public()
	@Get('export.csv')
	async exportCsv(@Res() res: Response, @Query('q') q?: string, @Query('risk') risk?: string) {
		const rows = await this.customersService.findAll({ q, risk });
		res.setHeader('Content-Type', 'text/csv; charset=utf-8');
		res.setHeader('Content-Disposition', `attachment; filename=clientes_${dayjs().format('YYYYMMDD_HHmm')}.csv`);
		const header = 'Nombre,RNC/Cédula,Correo,Teléfono,Riesgo,Límite de crédito,Score\n';
		res.write('\ufeff');
		res.write(header);
		for (const c of rows) {
			const line = [c.name, c.rncCedula, c.email ?? '', c.phone ?? '', c.riskLevel, c.creditLimit, String(c.creditScore)].map((x) => `"${(x ?? '').toString().replace(/"/g, '""')}` + '"').join(',');
			res.write(line + '\n');
		}
		res.end();
	}

	@Public()
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.customersService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
		return this.customersService.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.customersService.remove(id);
	}
}