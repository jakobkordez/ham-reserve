import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class MongoIdPipe implements PipeTransform {
  transform(value: any): string {
    if (!isValidObjectId(value)) throw new BadRequestException('Invalid id');

    return value;
  }
}
