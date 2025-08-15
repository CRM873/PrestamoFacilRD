import { OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';
export declare class EventsGateway implements OnModuleInit {
    server: Server;
    onModuleInit(): void;
    handlePing(data: any): void;
}
