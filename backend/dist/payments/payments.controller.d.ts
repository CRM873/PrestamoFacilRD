import { PaymentsService } from './payments.service';
import type { CreatePaymentInput } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    record(input: CreatePaymentInput): Promise<{
        id: string;
    }>;
}
