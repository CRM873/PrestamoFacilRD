import { Customer } from '../../customers/entities/customer.entity';
export declare class Invoice {
    id: string;
    customer: Customer;
    ncfType?: string;
    ncfNumber?: string;
    issueDate: string;
    dueDate: string;
    subtotal: string;
    itbisTotal: string;
    total: string;
    balance: string;
    status: string;
    interestRateAnnual: string;
    lastInterestCalcDate?: string;
    createdAt: Date;
    updatedAt: Date;
}
