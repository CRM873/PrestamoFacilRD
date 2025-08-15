import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import type { Response } from 'express';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(dto: CreateCustomerDto): Promise<import("./entities/customer.entity").Customer>;
    findAll(q?: string, risk?: string): Promise<import("./entities/customer.entity").Customer[]>;
    exportCsv(res: Response, q?: string, risk?: string): Promise<void>;
    findOne(id: string): Promise<import("./entities/customer.entity").Customer>;
    update(id: string, dto: UpdateCustomerDto): Promise<import("./entities/customer.entity").Customer>;
    remove(id: string): Promise<void>;
}
