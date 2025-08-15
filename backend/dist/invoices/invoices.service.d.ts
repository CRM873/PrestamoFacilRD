import { OnModuleInit } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { CustomersService } from '../customers/customers.service';
import { EventsGateway } from '../events/events.gateway';
import { NcfSeries } from './entities/ncf-series.entity';
export interface InvoiceLineInput {
    description: string;
    qty: number;
    unitPrice: number;
    itbisRate?: number;
}
export interface CreateInvoiceInput {
    customerId: string;
    requiresFiscalReceipt?: boolean;
    ncfType?: string;
    lines: InvoiceLineInput[];
    issueDate?: string;
    termsDays?: number;
    interestRateAnnual?: number;
}
export declare class InvoicesService implements OnModuleInit {
    private readonly invRepo;
    private readonly ncfRepo;
    private readonly customersService;
    private readonly dataSource;
    private readonly events;
    constructor(invRepo: Repository<Invoice>, ncfRepo: Repository<NcfSeries>, customersService: CustomersService, dataSource: DataSource, events: EventsGateway);
    onModuleInit(): Promise<void>;
    private computeTotals;
    private reserveNcf;
    create(input: CreateInvoiceInput): Promise<Invoice>;
    findAll(params?: {
        status?: string;
        customerId?: string;
    }): Promise<Invoice[]>;
    findOne(id: string): Promise<Invoice>;
}
