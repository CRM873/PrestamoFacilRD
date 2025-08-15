import { Repository } from 'typeorm';
import { Payment, PaymentAllocation } from './entities/payment.entity';
import { CustomersService } from '../customers/customers.service';
import { InvoicesService } from '../invoices/invoices.service';
import { Invoice } from '../invoices/entities/invoice.entity';
import { EventsGateway } from '../events/events.gateway';
export interface CreatePaymentInput {
    customerId: string;
    method: 'cash' | 'transfer' | 'card';
    amount: number;
    reference?: string;
    allocations?: {
        invoiceId: string;
        amount: number;
    }[];
}
export declare class PaymentsService {
    private readonly payRepo;
    private readonly allocRepo;
    private readonly invRepo;
    private readonly customersService;
    private readonly invoicesService;
    private readonly events;
    constructor(payRepo: Repository<Payment>, allocRepo: Repository<PaymentAllocation>, invRepo: Repository<Invoice>, customersService: CustomersService, invoicesService: InvoicesService, events: EventsGateway);
    private allocateOldestFirst;
    record(input: CreatePaymentInput): Promise<{
        id: string;
    }>;
}
