export interface Reservation {
  _id: string;
  user: string;
  event: string;
  forDate: Date;
  modes: string[];
  bands: string[];
  createdAt: Date;
  isDeleted: boolean;
}
