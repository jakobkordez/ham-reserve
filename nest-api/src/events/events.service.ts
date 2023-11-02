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
    const now = Date.now();
    const from = new Date(now - 1000 * 60 * 60 * 24 * 7);
    const to = new Date(now + 1000 * 60 * 60 * 24 * 7);
    return this.eventModel
      .find({
        $and: [
          {
            $or: [{ fromDateTime: [null] }, { fromDateTime: { $lte: to } }],
          },
          {
            $or: [{ toDateTime: [null] }, { toDateTime: { $gte: from } }],
          },
        ],
        $nor: [{ isDeleted: true }, { isPrivate: true }],
      })
      .exec();
  }

  findPrivate(userId: string): Promise<Event[]> {
    const now = new Date();
    return this.eventModel
      .find({
        $and: [
          {
            $or: [{ fromDateTime: [null] }, { fromDateTime: { $lte: now } }],
          },
          {
            $or: [{ toDateTime: [null] }, { toDateTime: { $gte: now } }],
          },
        ],
        $nor: [{ isDeleted: true }],
        isPrivate: true,
        access: userId,
      })
      .exec();
  }

  findOne(id: string, populate: boolean): Promise<Event> {
    let q = this.eventModel.findById(id);
    if (populate) q = q.populate('access');
    return q.exec();
  }

  update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    return this.eventModel
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .exec();
  }

  grantAccess(id: string, userId: string): Promise<Event> {
    return this.eventModel
      .findByIdAndUpdate(id, { $addToSet: { access: userId } }, { new: true })
      .exec();
  }

  revokeAccess(id: string, userId: string): Promise<Event> {
    return this.eventModel
      .findByIdAndUpdate(id, { $pull: { access: userId } }, { new: true })
      .exec();
  }

  setDeleted(id: string): Promise<Event> {
    return this.eventModel
      .findByIdAndUpdate(id, { $set: { isDeleted: true } }, { new: true })
      .exec();
  }
}
