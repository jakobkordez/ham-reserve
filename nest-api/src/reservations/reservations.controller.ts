import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
  NotFoundException,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { UserTokenData } from 'src/auth/interfaces/user-token-data.interface';
import { Reservation } from './schemas/reservation.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { MongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { AdifValidationPipe } from 'src/pipes/adif-validation.pipe';
import { SimpleAdif } from 'adif-parser-ts';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Reservation> {
    const res = await this.reservationsService.findOne(id);
    if (!res) throw new NotFoundException('Reservation not found');
    return res;
  }

  @Get(':id/log')
  async getLog(@Param('id', MongoIdPipe) id: string): Promise<string> {
    const res = await this.reservationsService.findOne(id);
    if (!res) throw new NotFoundException('Reservation not found');
    if (!res.adiFile) throw new NotFoundException('Log not found');
    return res.adiFile;
  }

  @Post(':id/log')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLog(
    @Param('id', MongoIdPipe) id: string,
    @RequestUser() user: UserTokenData,
    @UploadedFile(AdifValidationPipe) file: SimpleAdif,
    @UploadedFile() rawFile: Express.Multer.File,
  ): Promise<Reservation> {
    if (!file) throw new NotFoundException('File missing');

    const res = await this.reservationsService.findOne(id);
    if (!res) throw new NotFoundException('Reservation not found');
    if (res.user !== user.id)
      throw new ForbiddenException('Reservation not owned by user');

    const reservedBands = new Set(res.bands.map((b) => b.toUpperCase()));
    const reservedModes = new Set(res.modes.map((m) => m.toUpperCase()));
    const warnings: string[] = [];

    const bands = new Set<string>();
    const modes = new Set<string>();
    const now = new Date();
    let minDate = now;
    let maxDate = new Date(0);
    for (const qso of file.records) {
      bands.add(qso.band.toUpperCase());
      modes.add(qso.mode.toUpperCase());

      let d = qso.qso_date;
      d = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}`;
      let t = qso.time_on;
      t = `${t.slice(0, 2)}:${t.slice(2, 4)}`;

      const dateTime = new Date(`${d}T${t}Z`);
      if (dateTime < minDate) minDate = dateTime;
      if (dateTime > maxDate) maxDate = dateTime;

      const lineWarning = [];
      if (dateTime > now) lineWarning.push(`Time in the future`);
      if (dateTime > res.endDateTime)
        lineWarning.push(`Time after end of reservation`);
      if (dateTime < res.startDateTime)
        lineWarning.push(`Time before start of reservation`);
      if (!reservedBands.has(qso.band.toUpperCase()))
        lineWarning.push(`Band ${qso.band} not reserved`);
      if (!reservedModes.has(qso.mode.toUpperCase()))
        lineWarning.push(`Mode ${qso.mode} not reserved`);
      if (lineWarning.length > 0)
        warnings.push(`${d} ${t} ${qso.call} ${lineWarning.join(', ')}`);
    }

    return this.reservationsService.updateLog(id, rawFile.buffer.toString(), {
      qso_count: file.records.length,
      bands: [...bands],
      modes: [...modes],
      first_qso_time: minDate,
      last_qso_time: maxDate,
      warnings,
    });
  }

  @Patch(':id')
  async update(
    @RequestUser() user: UserTokenData,
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    const res = await this.reservationsService.findOne(id);
    if (!res) throw new NotFoundException('Reservation not found');
    if (res.user !== user.id)
      throw new ForbiddenException('Reservation not owned by user');

    return this.reservationsService.update(id, updateReservationDto);
  }

  @Patch(':id/cancel')
  async cancel(
    @RequestUser() user: UserTokenData,
    @Param('id') id: string,
  ): Promise<Reservation> {
    const res = await this.reservationsService.findOne(id);
    if (!res) throw new NotFoundException('Reservation not found');
    if (res.user !== user.id)
      throw new ForbiddenException('Reservation not owned by user');

    return this.reservationsService.cancel(id);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Reservation> {
    const res = await this.reservationsService.remove(id);
    if (!res) throw new NotFoundException('Reservation not found');

    return res;
  }
}
