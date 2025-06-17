import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async getAllUsers() {
    return await this.userRepository.find();
  }

  async createUser(userDto: CreateUserDto) {
    const userEntity = this.userRepository.create(userDto);
    return await this.userRepository.save(userEntity);
  }

  async updateUser(id: number, userDto: UpdateUserDto) {
    const user = await this.getById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const userUpdated = this.userRepository.merge(user, userDto);
    await this.userRepository.update(id, userUpdated);
    return user;
  }

  async deleteUser(id: number) {
    const user = await this.getById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.delete(id);
    return user;
  }
}
