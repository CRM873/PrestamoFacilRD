import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import type { CreateInvoiceInput } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
	constructor(private readonly invoicesService: InvoicesService) {}

	@Post()
	create(@Body() input: CreateInvoiceInput) {
		return this.invoicesService.create(input);
	}

	@Get()
	findAll(@Query('status') status?: string, @Query('customerId') customerId?: string) {
		return this.invoicesService.findAll({ status, customerId });
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.invoicesService.findOne(id);
	}
}