import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repository/user.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * List all users
   * @returns users collection
   */
  async findAll(): Promise<User[] | string[]> {
    const value = await this.cacheManager.get<string[]>('users-key');
    if (value) {
      return value;
    }
    const users = await this.userRepository.getAllUsers();
    await this.cacheManager.set('users-key', users, 10000);
    return users;
  }

  /**
   * Find a user by ID
   * @param id
   * @returns user entity
   */
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Create a new user
   * @param userDto
   * @returns user entity
   */
  async create(userDto: CreateUserDto): Promise<User> {
    return await this.userRepository.createUser(userDto);
  }

  /**
   * Update a user by ID
   * @param id
   * @param userDto
   * @returns user entity
   */
  async update(id: number, userDto: UpdateUserDto): Promise<User> {
    return await this.userRepository.updateUser(id, userDto);
  }

  /**
   * Delete a user by ID
   * @param id
   * @returns boolean
   */
  async remove(id: number): Promise<User> {
    return await this.userRepository.deleteUser(id);
  }
}
