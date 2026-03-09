import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user with a hashed password', async () => {
      mockPrismaService.user.create.mockResolvedValue({
        id: 'uuid-123',
        email: 'test@test.com',
        password: 'hashedpassword',
        createdAt: new Date(),
      });

      const result = await service.create('test@test.com', 'password123');

      expect(result.email).toBe('test@test.com');
      expect(mockPrismaService.user.create).toHaveBeenCalledTimes(1);
    });

    it('should hash the password before saving', async () => {
      mockPrismaService.user.create.mockResolvedValue({
        id: 'uuid-123',
        email: 'test@test.com',
        password: 'hashedpassword',
        createdAt: new Date(),
      });

      await service.create('test@test.com', 'password123');

      const callArg = mockPrismaService.user.create.mock.calls[0][0];
      expect(callArg.data.password).not.toBe('password123');
    });
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'uuid-123',
        email: 'test@test.com',
        password: 'hashedpassword',
        createdAt: new Date(),
      });

      const result = await service.findByEmail('test@test.com');

      expect(result).not.toBeNull();
      expect(result?.email).toBe('test@test.com');
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findByEmail('unknown@test.com');

      expect(result).toBeNull();
    });
  });
});
