import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly repo;
    constructor(repo: Repository<User>);
    create(data: Partial<User>): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, data: Partial<User>): Promise<User>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
