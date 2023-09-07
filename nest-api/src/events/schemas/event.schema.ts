import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
    type: [{ type: String, ref: User.name }],
    default: [],
  })
  access: User[];

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
