import { Repository } from 'typeorm';
import { Invoice } from '../invoices/entities/invoice.entity';
export declare class ReportsController {
    private readonly invRepo;
    constructor(invRepo: Repository<Invoice>);
    summary(): Promise<{
        moneda: string;
        totalPorCobrar: string;
        montoVencido: string;
    }>;
    aging(bucket: string): Promise<{
        bucket: string;
        total: string;
        count: number;
    }>;
}
