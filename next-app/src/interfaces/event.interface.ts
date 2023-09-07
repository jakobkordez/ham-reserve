import { User } from './user.interface';

export interface Event {
  _id: string;
  callsign: string;
  description: string;
  fromDateTime: Date;
  toDateTime: Date;
  access: User[];
  createdAt: Date;
  isDeleted: boolean;
}
