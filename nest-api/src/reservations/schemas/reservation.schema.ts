import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Event } from 'src/events/schemas/event.schema';
import { User } from 'src/users/schemas/user.schema';

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
  _id: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  user: User | string;

  @Prop({
    type: Types.ObjectId,
    ref: Event.name,
    required: true,
    index: true,
  })
  event: Event | string;

  @Prop({ required: true })
  forDate: Date;

  @Prop({
    type: [String],
    required: true,
  })
  modes: string[];

  @Prop({
    type: [String],
    required: true,
  })
  bands: string[];

  @Prop({
    required: true,
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    required: true,
    default: false,
  })
  isDeleted: boolean;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
