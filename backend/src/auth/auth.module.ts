import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.JWT_SECRET || 'dev_secret_change_me',
			signOptions: { expiresIn: '1d' },
		}),
		UsersModule,
	],
	controllers: [AuthController],
	providers: [JwtStrategy, { provide: APP_GUARD, useClass: JwtAuthGuard }],
	exports: [JwtModule],
})
export class AuthModule {}
