import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from './repository/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';

const userDto: CreateUserDto = {
  name: 'Jhoe Doe',
  email: 'jhoedoe@email.com',
  password: '1234567',
};

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: UserRepository;

  const mockUserRepository = () => ({
    getAllUsers: jest.fn(),
    createUser: jest.fn(),
    getById: jest.fn(),
    updateUser: jest.fn().mockResolvedValue(userDto),
    deleteUser: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      (userRepository.createUser as jest.Mock).mockResolvedValue(userDto);
      expect(userRepository.createUser).not.toHaveBeenCalled();
      const result = await service.create(userDto);
      expect(userRepository.createUser).toHaveBeenCalledWith(userDto);
      expect(result).toEqual(userDto);
    });
  });

  describe('getAllUsers', () => {
    it('List of all users in database', async () => {
      (userRepository.getAllUsers as jest.Mock).mockResolvedValue(
        'getAllUsers',
      );
      expect(userRepository.getAllUsers).not.toHaveBeenCalled();
      const result = await service.findAll();
      expect(userRepository.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual('getAllUsers');
    });
    it('List of 3 users in database', async () => {
      (userRepository.createUser as jest.Mock).mockResolvedValue(userDto);
      (userRepository.createUser as jest.Mock).mockResolvedValue(userDto);
      (userRepository.createUser as jest.Mock).mockResolvedValue(userDto);
      (userRepository.getAllUsers as jest.Mock).mockResolvedValue([
        userDto,
        userDto,
        userDto,
      ]);
      expect(userRepository.getAllUsers).not.toHaveBeenCalled();
      const result = await service.findAll();
      expect(userRepository.getAllUsers).toHaveBeenCalled();
      expect(result.length).toEqual(3);
    });
  });

  describe('getUser', () => {
    it('should retrieve an user with an ID', async () => {
      (userRepository.getById as jest.Mock).mockResolvedValue(userDto);
      const result = await service.findOne(1);
      expect(result).toEqual(userDto);
    });
    it('throws an error as a role is not found', async () => {
      (userRepository.getById as jest.Mock).mockResolvedValue(null);
      expect(service.findOne(2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete an user', async () => {
      (userRepository.deleteUser as jest.Mock).mockResolvedValue(userDto);
      expect(userRepository.deleteUser).not.toHaveBeenCalled();
      await service.remove(1);
      expect(userRepository.deleteUser).toHaveBeenCalledWith(1);
    });
  });
});
