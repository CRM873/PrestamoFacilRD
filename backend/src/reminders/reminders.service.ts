import { Injectable } from '@nestjs/common';

@Injectable()
export class RemindersService {
	preview(template: string, data: Record<string, any>) {
		return { asunto: 'Recordatorio de pago', cuerpo: template.replace(/\{\{(\w+)\}\}/g, (_, k) => String(data[k] ?? '')) };
	}

	sendNow(payload: { channel: 'EMAIL' | 'SMS'; to: string; subject?: string; html?: string; text?: string }) {
		return { enviado: true, proveedorId: 'dev-sent' };
	}
}