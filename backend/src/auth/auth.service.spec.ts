import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockUsersService = {
  create: jest.fn(),
  findByEmail: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock_token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should return an access_token on success', async () => {
      mockUsersService.create.mockResolvedValue({
        id: 'uuid-123',
        email: 'test@test.com',
      });

      const result = await service.register('test@test.com', 'password123');

      expect(result).toEqual({ access_token: 'mock_token' });
      expect(mockUsersService.create).toHaveBeenCalledWith(
        'test@test.com',
        'password123',
      );
    });

    it('should throw UnauthorizedException if creation fails', async () => {
      mockUsersService.create.mockRejectedValue(new Error('DB error'));

      await expect(
        service.register('test@test.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return an access_token with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockUsersService.findByEmail.mockResolvedValue({
        id: 'uuid-123',
        email: 'test@test.com',
        password: hashedPassword,
      });

      const result = await service.login('test@test.com', 'password123');

      expect(result).toEqual({ access_token: 'mock_token' });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login('test@test.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockUsersService.findByEmail.mockResolvedValue({
        id: 'uuid-123',
        email: 'test@test.com',
        password: hashedPassword,
      });

      await expect(
        service.login('test@test.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
