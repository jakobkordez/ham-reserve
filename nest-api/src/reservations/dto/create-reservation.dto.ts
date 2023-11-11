import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateReservationDto {
  @IsDateString({ strict: true })
  startDateTime: Date;

  @IsDateString({ strict: true })
  endDateTime: Date;

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @IsNotEmpty({ each: true })
  modes: string[];

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @IsNotEmpty({ each: true })
  bands: string[];
}
