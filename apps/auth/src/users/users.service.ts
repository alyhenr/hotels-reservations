import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    return this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  async verifyUser(email: string, password: string) {
    const foundUser = await this.usersRepository.findOne({
      email,
    });

    if (!foundUser) throw new NotFoundException('Email not found');
    if (!(await bcrypt.compare(password, foundUser.password)))
      throw new UnauthorizedException('Credentials are not valid');

    return foundUser;
  }
}
