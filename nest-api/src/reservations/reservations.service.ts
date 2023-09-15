import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './schemas/reservation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

interface ReservationFilter {
  fromDate?: Date;
  toDate?: Date;
  userId?: string;
  eventId?: string;
}

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<Reservation>,
  ) {}

  create(
    createReservationDto: CreateReservationDto,
    eventId: string,
    userId: string,
  ): Promise<Reservation> {
    const created = new this.reservationModel({
      ...createReservationDto,
      event: eventId,
      user: userId,
    });
    return created.save();
  }

  findAll({
    fromDate,
    toDate,
    eventId,
    userId,
  }: ReservationFilter): Promise<Reservation[]> {
    return this.reservationModel
      .find({
        $nor: [{ isDeleted: true }],
        $and: [
          userId ? { user: userId } : {},
          eventId ? { event: eventId } : {},
          fromDate ? { forDate: { $gte: fromDate } } : {},
          toDate ? { forDate: { $lte: toDate } } : {},
        ],
      })
      .exec();
  }

  findOne(id: string): Promise<Reservation> {
    return this.reservationModel.findById(id).exec();
  }

  update(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    return this.reservationModel
      .findByIdAndUpdate(id, updateReservationDto, { new: true })
      .exec();
  }

  remove(id: string): Promise<Reservation> {
    return this.reservationModel
      .findByIdAndUpdate(id, { $set: { isDeleted: true } }, { new: true })
      .exec();
  }
}
