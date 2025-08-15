import { RemindersService } from './reminders.service';
export declare class RemindersController {
    private readonly svc;
    constructor(svc: RemindersService);
    preview(body: {
        template: string;
        data: Record<string, any>;
    }): {
        asunto: string;
        cuerpo: string;
    };
    send(body: {
        channel: 'EMAIL' | 'SMS';
        to: string;
        subject?: string;
        html?: string;
        text?: string;
    }): {
        enviado: boolean;
        proveedorId: string;
    };
}
