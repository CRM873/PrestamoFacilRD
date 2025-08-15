import { UsersService } from './users.service';
export declare class UsersController {
    private readonly users;
    constructor(users: UsersService);
    findAll(): Promise<import("./entities/user.entity").User[]>;
    create(body: {
        name: string;
        email: string;
        password: string;
        role?: string;
    }): Promise<import("./entities/user.entity").User>;
}
