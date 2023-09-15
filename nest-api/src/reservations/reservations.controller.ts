import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { UserTokenData } from 'src/auth/interfaces/user-token-data.interface';
import { Reservation } from './schemas/reservation.schema';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Reservation> {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @RequestUser() user: UserTokenData,
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    const reservation = await this.reservationsService.findOne(id);
    if (!reservation) throw new NotFoundException('Reservation not found');
    if (reservation.user !== user.id)
      throw new ForbiddenException('Reservation not owned by user');

    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  async remove(
    @RequestUser() user: UserTokenData,
    @Param('id') id: string,
  ): Promise<Reservation> {
    const reservation = await this.reservationsService.findOne(id);
    if (!reservation) throw new NotFoundException('Reservation not found');
    if (reservation.user !== user.id)
      throw new ForbiddenException('Reservation not owned by user');

    return this.reservationsService.remove(id);
  }
}
