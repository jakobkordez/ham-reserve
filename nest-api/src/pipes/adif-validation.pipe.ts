import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AdifParser, SimpleAdif } from 'adif-parser-ts';

@Injectable()
export class AdifValidationPipe implements PipeTransform {
  transform(value: any): SimpleAdif {
    try {
      const adif = AdifParser.parseAdi(value.buffer.toString());
      if (!adif || !adif.records) throw new Error();
      return adif;
    } catch (err) {
      throw new BadRequestException('Invalid ADIF file');
    }
  }
}
