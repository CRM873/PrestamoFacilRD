import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({ origin: '*', credentials: true });
	app.setGlobalPrefix('api');
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true,
			validationError: { target: false },
		}),
	);
	const port = Number(process.env.PORT ?? 3000);
	await app.listen(port, '0.0.0.0');
}
bootstrap();
