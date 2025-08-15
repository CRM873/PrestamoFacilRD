import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomersService {
    private readonly customersRepo;
    constructor(customersRepo: Repository<Customer>);
    create(data: CreateCustomerDto): Promise<Customer>;
    findAll(query?: {
        q?: string;
        risk?: string;
    }): Promise<Customer[]>;
    findOne(id: string): Promise<Customer>;
    update(id: string, data: UpdateCustomerDto): Promise<Customer>;
    remove(id: string): Promise<void>;
}
