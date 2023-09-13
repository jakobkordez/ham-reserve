import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsUppercase,
  Matches,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsUppercase()
  @Matches(/^[A-Z\d]+\d+[A-Z]+$/, { message: 'Invalid callsign' })
  callsign: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsDateString()
  @IsOptional()
  fromDateTime: Date;

  @IsDateString()
  @IsOptional()
  toDateTime: Date;

  @IsBoolean()
  @IsOptional()
  isPrivate: boolean;
}
