import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './schemas/event.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {}

  create(createEventDto: CreateEventDto): Promise<Event> {
    const event = new this.eventModel(createEventDto);
    return event.save();
  }

  findAll(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }

  findCurrent(): Promise<Event[]> {
    const now = new Date();
    return this.eventModel
      .find({
        $and: [{ fromDateTime: { $lte: now } }, { toDateTime: { $gte: now } }],
      })
      .exec();
  }

  findOne(id: string): Promise<Event> {
    return this.eventModel.findById(id).exec();
  }

  update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    return this.eventModel
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .exec();
  }

  setDeleted(id: string): Promise<Event> {
    return this.eventModel
      .findByIdAndUpdate(id, { $set: { isDeleted: true } }, { new: true })
      .exec();
  }
}
