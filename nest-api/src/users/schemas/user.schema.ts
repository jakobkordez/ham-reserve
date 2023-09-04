import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: ObjectId;

  @Prop({ required: true })
  username: string;

  @Prop({
    required: true,
    transform: () => undefined,
    set: (value: string) => bcrypt.hashSync(value, 10),
  })
  password: string;

  @Prop({
    default: [Role.User],
    type: [
      { type: String, enum: [Role.User.toString(), Role.Admin.toString()] },
    ],
  })
  roles: Role[];

  @Prop({ required: true })
  name: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop({
    transform: () => undefined,
    set: (value: string) => bcrypt.hashSync(value, 10),
  })
  auth: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
