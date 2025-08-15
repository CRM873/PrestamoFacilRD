import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway implements OnModuleInit {
	@WebSocketServer()
	server: Server;

	onModuleInit() {
		this.server.emit('system', { msg: 'Servidor listo' });
	}

	@SubscribeMessage('ping')
	handlePing(@MessageBody() data: any) {
		this.server.emit('pong', { ok: true, data });
	}
}