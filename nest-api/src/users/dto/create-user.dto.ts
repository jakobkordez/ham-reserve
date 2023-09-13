import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUppercase,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsUppercase()
  @Matches(/^[A-Z\d]+\d+[A-Z]+$/, { message: 'Invalid callsign' })
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber()
  phone: string;
}
