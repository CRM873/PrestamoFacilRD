import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import type { CreatePaymentInput } from './payments.service';

@Controller('payments')
export class PaymentsController {
	constructor(private readonly paymentsService: PaymentsService) {}

	@Post()
	record(@Body() input: CreatePaymentInput) {
		return this.paymentsService.record(input);
	}
}