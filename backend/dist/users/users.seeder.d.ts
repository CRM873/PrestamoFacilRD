import { OnModuleInit } from '@nestjs/common';
import { UsersService } from './users.service';
export declare class UsersSeeder implements OnModuleInit {
    private readonly users;
    constructor(users: UsersService);
    onModuleInit(): Promise<void>;
}
