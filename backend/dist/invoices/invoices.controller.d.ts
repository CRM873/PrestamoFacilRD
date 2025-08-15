import { InvoicesService } from './invoices.service';
import type { CreateInvoiceInput } from './invoices.service';
export declare class InvoicesController {
    private readonly invoicesService;
    constructor(invoicesService: InvoicesService);
    create(input: CreateInvoiceInput): Promise<import("./entities/invoice.entity").Invoice>;
    findAll(status?: string, customerId?: string): Promise<import("./entities/invoice.entity").Invoice[]>;
    findOne(id: string): Promise<import("./entities/invoice.entity").Invoice>;
}
