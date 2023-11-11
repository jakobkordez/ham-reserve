import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
  ParseArrayPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { UserTokenData } from 'src/auth/interfaces/user-token-data.interface';
import { User } from './schemas/user.schema';
import { Reservation } from 'src/reservations/schemas/reservation.schema';
import { ReservationsService } from 'src/reservations/reservations.service';
import { isMongoId } from 'class-validator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly reservationsService: ReservationsService,
  ) {}

  @Roles(Role.Admin)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const exitsting = await this.usersService.findByUsername(
      createUserDto.username,
    );
    if (exitsting) throw new BadRequestException('Username taken');

    return this.usersService.create(createUserDto);
  }

  @Roles(Role.Admin)
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('me')
  async getSelf(@RequestUser() userReq: UserTokenData): Promise<User> {
    const user = await this.usersService.findOne(userReq.id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Roles(Role.Admin)
  @Get('search/:username')
  async findByUsername(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Roles(Role.Admin)
  @Get(':id')
  findOne(@Param('id', MongoIdPipe) id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Get('me/reservations')
  async getSelfReservations(
    @RequestUser() userReq: UserTokenData,
    @Query('event') event?: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ): Promise<Reservation[]> {
    if (event && !isMongoId(event))
      throw new BadRequestException('Invalid event id');

    const user = await this.usersService.findOne(userReq.id);
    if (!user) throw new NotFoundException('User not found');

    return this.reservationsService.findAll({
      userId: userReq.id,
      eventId: event,
      fromDateTime: start ? new Date(start) : undefined,
      toDateTime: end ? new Date(end) : undefined,
    });
  }

  @Roles(Role.Admin)
  @Get(':id/reservations')
  async getReservationsForUser(
    @Param('id', MongoIdPipe) id: string,
  ): Promise<Reservation[]> {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return this.reservationsService.findAll({ userId: id });
  }

  @Roles(Role.Admin)
  @Post('many')
  findMany(@Body(ParseArrayPipe) ids: string[]): Promise<User[]> {
    return this.usersService.findMany(ids);
  }

  @Patch('me')
  async updateSelf(
    @RequestUser() userReq: UserTokenData,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.usersService.update(userReq.id, updateUserDto);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.usersService.update(id, updateUserDto);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Roles(Role.Admin)
  @Patch(':id/password')
  async updatePassword(
    @Param('id', MongoIdPipe) id: string,
    @Body('password') password: string,
  ): Promise<User> {
    const user = await this.usersService.updatePassword(id, password, true);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id', MongoIdPipe) id: string): Promise<void> {
    const user = await this.usersService.setDeleted(id);
    if (!user) throw new NotFoundException('User not found');
  }
}
