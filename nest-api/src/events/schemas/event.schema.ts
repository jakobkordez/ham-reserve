import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  _id: string;

  @Prop({ required: true })
  callsign: string;

  @Prop()
  description: string;

  @Prop()
  fromDateTime: Date;

  @Prop()
  toDateTime: Date;

  @Prop({
    default: false,
  })
  isPrivate: boolean;

  @Prop({
    type: [{ type: Types.ObjectId, ref: User.name }],
    default: [],
  })
  access: User[] | string[];

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

export const EventSchema = SchemaFactory.createForClass(Event);
