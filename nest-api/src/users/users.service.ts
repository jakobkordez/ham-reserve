import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel({
      ...createUserDto,
      passwordResetRequired: true,
    });
    return user.save();
  }

  findAll(): Promise<User[]> {
    return this.userModel.find({ $nor: [{ isDeleted: true }] }).exec();
  }

  findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  findMany(ids: string[]): Promise<User[]> {
    return this.userModel.find({ _id: ids }).exec();
  }

  findByUsername(username: string): Promise<User> {
    return this.userModel
      .findOne({ username, $nor: [{ isDeleted: true }] })
      .exec();
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async updatePassword(
    id: string,
    password: string,
    passwordResetRequired: boolean,
  ): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(id, { password, passwordResetRequired }, { new: true })
      .exec();
  }

  setDeleted(id: string): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(id, { $set: { isDeleted: true } }, { new: true })
      .exec();
  }

  setRefreshToken(id: string, token: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, { auth: token }).exec();
  }
}
