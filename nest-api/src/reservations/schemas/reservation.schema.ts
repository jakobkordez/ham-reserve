import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Event } from 'src/events/schemas/event.schema';
import { User } from 'src/users/schemas/user.schema';
import { LogSummary } from '../interfaces/log-summary.interface';

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
    transform: () => undefined,
  })
  adiFile: string;

  @Prop({
    type: raw({
      qso_count: { type: Number },
      bands: { type: [String] },
      modes: { type: [String] },
      first_qso_time: { type: Date },
      last_qso_time: { type: Date },
      warnings: { type: [String] },
    }),
  })
  logSummary: LogSummary;

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
