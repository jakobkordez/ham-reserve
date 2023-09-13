import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
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

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

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
}
