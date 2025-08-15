import { Customer } from '../../customers/entities/customer.entity';
import { Invoice } from '../../invoices/entities/invoice.entity';
export declare class Payment {
    id: string;
    customer: Customer;
    method: string;
    amountReceived: string;
    reference?: string;
    allocations?: PaymentAllocation[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class PaymentAllocation {
    id: string;
    payment: Payment;
    invoice: Invoice;
    amountApplied: string;
}
