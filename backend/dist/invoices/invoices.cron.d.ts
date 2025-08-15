import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { EventsGateway } from '../events/events.gateway';
export declare class InvoicesCronService {
    private readonly invRepo;
    private readonly events;
    constructor(invRepo: Repository<Invoice>, events: EventsGateway);
    accrueDailyInterest(): Promise<void>;
}
