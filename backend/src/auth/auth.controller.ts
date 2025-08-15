import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
	constructor(private readonly users: UsersService, private readonly jwt: JwtService) {}

	@Public()
	@Post('login')
	async login(@Body() body: { email: string; password: string }) {
		const user = await this.users.findByEmail(body.email);
		if (!user) throw new UnauthorizedException('Credenciales inválidas');
		const ok = await bcrypt.compare(body.password, user.passwordHash);
		if (!ok) throw new UnauthorizedException('Credenciales inválidas');
		const token = await this.jwt.signAsync({ sub: user.id, email: user.email, role: user.role });
		return { access_token: token };
	}
}