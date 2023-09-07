import { IsDate, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @MinLength(3)
  callsign: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsDate()
  fromDateTime: Date;

  @IsDate()
  toDateTime: Date;
}
