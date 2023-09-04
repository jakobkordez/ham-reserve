import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { Public } from 'src/decorators/public.decorator';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { UserTokenData } from 'src/auth/interfaces/user-token-data.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin)
  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  getSelf(@RequestUser() userReq: UserTokenData) {
    const user = this.usersService.findOne(userReq.id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Get('search/:username')
  findByUsername(@Param('username') username: string) {
    const user = this.usersService.findByUsername(username);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Get(':id')
  findOne(@Param('id', MongoIdPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = this.usersService.update(id, updateUserDto);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    const user = this.usersService.remove(id);
    if (!user) throw new NotFoundException('User not found');
  }
}
