import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { MongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { Event } from './schemas/event.schema';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Roles(Role.Admin)
  @Post()
  create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventsService.create(createEventDto);
  }

  @Roles(Role.Admin)
  @Get('all')
  findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  @Get()
  findCurrent(): Promise<Event[]> {
    return this.eventsService.findCurrent();
  }

  @Get(':id')
  findOne(@Param('id', MongoIdPipe) id: string): Promise<Event> {
    return this.eventsService.findOne(id);
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
  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string): Promise<Event> {
    return this.eventsService.setDeleted(id);
  }
}
