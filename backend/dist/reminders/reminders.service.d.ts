export declare class RemindersService {
    preview(template: string, data: Record<string, any>): {
        asunto: string;
        cuerpo: string;
    };
    sendNow(payload: {
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
