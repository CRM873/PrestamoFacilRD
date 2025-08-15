import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: async () => ({
				type: 'sqljs',
				synchronize: true,
				autoLoadEntities: true,
				location: 'db/data',
				useLocalForage: false,
			}),
		}),
	],
})
export class DatabaseModule {}
