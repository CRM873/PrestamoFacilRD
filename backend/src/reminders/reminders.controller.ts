import { Body, Controller, Post } from '@nestjs/common';
import { RemindersService } from './reminders.service';

@Controller('reminders')
export class RemindersController {
	constructor(private readonly svc: RemindersService) {}

	@Post('preview')
	preview(@Body() body: { template: string; data: Record<string, any> }) {
		return this.svc.preview(body.template, body.data);
	}

	@Post('send-now')
	send(@Body() body: { channel: 'EMAIL' | 'SMS'; to: string; subject?: string; html?: string; text?: string }) {
		return this.svc.sendNow(body);
	}
}