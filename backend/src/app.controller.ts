import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
	@Get()
	hello() {
		return { mensaje: 'Plataforma de gestión de deudas (es-DO, DOP)', version: '0.1.0' };
	}
}
