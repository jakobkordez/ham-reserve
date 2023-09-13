import { User } from './user.interface';

export interface Event {
  _id: string;
  callsign: string;
  description: string;
  fromDateTime?: Date;
  toDateTime?: Date;
  isPrivate: boolean;
  access: string[];
  createdAt: Date;
  isDeleted: boolean;
}
