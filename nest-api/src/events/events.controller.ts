import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { MongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { Event } from './schemas/event.schema';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { Public } from 'src/decorators/public.decorator';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { UserTokenData } from 'src/auth/interfaces/user-token-data.interface';
import { ReservationsService } from 'src/reservations/reservations.service';
import { CreateReservationDto } from 'src/reservations/dto/create-reservation.dto';
import { Reservation } from 'src/reservations/schemas/reservation.schema';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly reservationsService: ReservationsService,
  ) {}

  @Roles(Role.Admin)
  @Post()
  create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    const from = createEventDto.fromDateTime;
    const to = createEventDto.toDateTime;
    if (from && to && from > to)
      throw new BadRequestException('fromDateTime must be before toDateTime');

    return this.eventsService.create(createEventDto);
  }

  @Roles(Role.Admin)
  @Get('all')
  findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  @Get('private')
  findPrivate(@RequestUser() user: UserTokenData): Promise<Event[]> {
    return this.eventsService.findPrivate(user.id);
  }

  @Public()
  @Get()
  findCurrent(): Promise<Event[]> {
    return this.eventsService.findCurrent();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', MongoIdPipe) id: string): Promise<Event> {
    return this.eventsService.findOne(id, false);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventsService.update(id, updateEventDto);
  }

  @Roles(Role.Admin)
  @Get(':id/grant/:userId')
  grantAccess(
    @Param('id', MongoIdPipe) id: string,
    @Param('userId', MongoIdPipe) userId: string,
  ): Promise<Event> {
    return this.eventsService.grantAccess(id, userId);
  }

  @Roles(Role.Admin)
  @Get(':id/revoke/:userId')
  revokeAccess(
    @Param('id', MongoIdPipe) id: string,
    @Param('userId', MongoIdPipe) userId: string,
  ): Promise<Event> {
    return this.eventsService.revokeAccess(id, userId);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string): Promise<Event> {
    return this.eventsService.setDeleted(id);
  }

  @Post(':id/reservations')
  async reserve(
    @RequestUser() user: UserTokenData,
    @Param('id', MongoIdPipe) eventId: string,
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const event = await this.eventsService.findOne(eventId, false);
    if (!event) throw new BadRequestException('Event not found');
    if (!(event.access as string[]).includes(user.id))
      throw new BadRequestException('Access not granted');

    const errors = [];

    const hour = 60 * 60 * 1000;
    const startDTRaw = createReservationDto.startDateTime;
    const endDTRaw = createReservationDto.endDateTime;
    const startDTVal = Math.floor(new Date(startDTRaw).valueOf() / hour) * hour;
    const endDTVal = Math.floor(new Date(endDTRaw).valueOf() / hour) * hour;

    // TODO Error if start/end time is not on the hour

    // Check that start time is at least an hour before end time
    if (startDTVal >= endDTVal)
      errors.push(`Start time must be at least an hour before end time`);

    const startDT = new Date(startDTVal);
    const endDT = new Date(endDTVal);

    // Check that start time is not before event start time
    if (event.fromDateTime && startDT < event.fromDateTime)
      errors.push(`Event starts at ${event.fromDateTime.toISOString()}`);

    // Check that end time is not after event end time
    if (event.toDateTime && endDT > event.toDateTime)
      errors.push(`Event ends at ${event.toDateTime.toISOString()}`);

    const reservations = await this.reservationsService.findAll({
      eventId,
      fromDateTime: startDT,
      toDateTime: endDT,
    });

    const bandSet = new Set(createReservationDto.bands);
    const modes = new Set(createReservationDto.modes);
    for (const r of reservations) {
      for (const m of r.modes) {
        if (modes.has(m)) {
          for (const b of r.bands) {
            if (bandSet.has(b)) {
              errors.push(
                `Mode ${m} on band ${b} is already reserved for ${r.startDateTime.toISOString()} - ${r.endDateTime.toISOString()}`,
              );
            }
          }
        }
      }
    }

    if (errors.length > 0) throw new BadRequestException(errors);

    return this.reservationsService.create(
      createReservationDto,
      eventId,
      user.id,
    );
  }

  @Public()
  @Get(':id/reservations')
  findReservations(
    @Param('id', MongoIdPipe) eventId: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ): Promise<Reservation[]> {
    return this.reservationsService.findAll({
      eventId,
      fromDateTime: start ? new Date(start) : undefined,
      toDateTime: end ? new Date(end) : undefined,
    });
  }
}
