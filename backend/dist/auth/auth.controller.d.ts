import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthController {
    private readonly users;
    private readonly jwt;
    constructor(users: UsersService, jwt: JwtService);
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
}
