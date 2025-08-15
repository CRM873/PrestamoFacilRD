import { IsEmail, IsIn, IsInt, IsNotEmpty, IsOptional, IsPhoneNumber, IsPositive, IsString, Length, Max, Min } from 'class-validator';

export class CreateCustomerDto {
	@IsString()
	@IsNotEmpty()
	@Length(2, 160)
	name: string;

	@IsString()
	@IsNotEmpty()
	@Length(9, 20)
	rncCedula: string;

	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsString()
	@Length(7, 32)
	phone?: string;

	@IsOptional()
	@IsString()
	address?: string;

	@IsOptional()
	@IsString()
	creditLimit?: string;

	@IsOptional()
	@IsInt()
	@Min(0)
	@Max(180)
	termsDays?: number;

	@IsOptional()
	@IsIn(['bajo', 'medio', 'alto'])
	riskLevel?: string;
}